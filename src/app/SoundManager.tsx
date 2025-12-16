//@ts-nocheck
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import AudioKeys, { Key } from 'audiokeys';
import * as Tone from 'tone';

import { pitchNotes } from 'src/shared/const/notes';
import {
  setCurrentBit,
  setIsPlaying
} from 'src/shared/redux/slices/currentMusicSlice';
import {
  addPlayingNote,
  removePlayingNote,
  setActiveNote,
  removeActiveNotes
} from 'src/shared/redux/slices/notesArraySlice';
import store, { RootState } from 'src/shared/redux/store/store';

import * as lamejs from '@breezystack/lamejs';

import { parseArrayBuffer } from 'midi-json-parser';
import { addNote } from 'src/shared/redux/slices/notesArraySlice';
import { setBpm, setTacts } from 'src/shared/redux/slices/settingsSlice';

import { FXChain } from 'src/features/Effects/FXChain';
import {
  setCurrentStep,
  setProgress
} from 'src/shared/redux/slices/progressSlice';

const chain = new FXChain();
const synth = chain.getSynth();
/* creating effects */

// tremoloFrequency [0, 10]
// tremoloDepth [0, 1]
const tremolo = new Tone.Tremolo(0, 0); //.start(); // affects the gain

// delayTime [0, 1]
// feedback [0, 1]
const delay = new Tone.FeedbackDelay(0, 0);

// distortion [0, 10]
const dist = new Tone.Distortion(0); // affects the gain

// bits [1, 16]
const crusher = new Tone.BitCrusher(16);

// pitchShift [0, 1]
const shifter = new Tone.PitchShift(0);

// filter [20, 8000]
const highFilter = new Tone.Filter(20, 'lowpass');
const lowFilter = new Tone.Filter(8000, 'highpass');

const gain = new Tone.Gain(6);

chain.appendFX(tremolo);
chain.appendFX(delay);
// chain.appendFX(dist);
chain.appendFX(crusher);
chain.appendFX(shifter);
chain.appendFX(highFilter);
chain.appendFX(lowFilter);
// chain.appendFX(gain);

/* creating a loop music */
function playMusic(time: number) {
  const currentBit = store.getState().currentMusic.currentBit;
  const tactsCounter = store.getState().settings.tacts ?? 8;
  const notesArray = store.getState().notesArray.notesArray;

  console.log('time', time);

  notesArray.forEach((note, index) => {
    if (note.attackTime === currentBit) {
      store.dispatch(setActiveNote({ index, isActive: true }));
      synth.triggerAttackRelease(
        pitchNotes[note.note],
        `0:0:${note.duration}`,
        time
      );
    }
    if (note.attackTime + note.duration <= currentBit) {
      note.isActive &&
        store.dispatch(setActiveNote({ index, isActive: false }));
    }
  });

  store.dispatch(setCurrentBit((currentBit + 1) % (tactsCounter * 16)));
}

export function pauseMusic() {
  store.dispatch(removeActiveNotes());
  store.dispatch(setIsPlaying(false));
  Tone.Transport.pause();
}

export function stopMusic() {
  store.dispatch(removeActiveNotes());
  store.dispatch(setCurrentBit(0));
  store.dispatch(setIsPlaying(false));
  Tone.Transport.stop();
}

// Tone.Timeline()

// const seq = new Tone.Sequence((time, note) => {
// 	synth.triggerAttackRelease(note, 0.1, time);
// }, ["C4", ["E4", "D4", "E4", "F4"], "G4", [244, "G4"]]).start(0);
// Tone.Transport.start();

export function rewindMusic(bit: number) {
  //console.log("Rewinding to: "+ bit)
  store.dispatch(removeActiveNotes());
  store.dispatch(setCurrentBit(bit));
}

export function noteDown(note: string) {
  store.dispatch(addPlayingNote(note));
  synth.triggerAttack(note);
}

export function noteUp(note: string) {
  store.dispatch(removePlayingNote(note));
  synth.triggerRelease(note);
}

export function getPitch(i: number): string {
  return pitchNotes[i];
}

/*MIDI Import*/

interface MIDINote {
  note: number;
  attackTime: number;
  duration: number;
}

interface MidiEvent {
  delta?: number;
  setTempo?: { microsecondsPerQuarter: number };
  noteOn?: { noteNumber: number; velocity: number };
  noteOff?: { noteNumber: number };
}

export function convertMIDInoteToSequencer(note: number): number {
  return 108 - note;
}

function mpqToBpm(microsecondsPerQuarter: number): number {
  const MICROSECONDS_PER_MINUTE = 60_000_000; // 60,000,000 μs in a minute
  return Math.round(MICROSECONDS_PER_MINUTE / microsecondsPerQuarter);
}

export function openMIDI(arrayBuffer: ArrayBuffer) {
  parseArrayBuffer(arrayBuffer)
    .then((json) => {
      if (!json?.tracks?.length) {
        console.error('Invalid MIDI file: No tracks found');
        return;
      }

      const ticksPerBeat = (json.division || 480) / 4; // Default to 480 if missing
      const mainTrack = json.tracks[0];
      let currentTick = 0;
      const activeNotes: Map<number, MIDINote> = new Map();
      const completedNotes: MIDINote[] = [];

      // First pass: Process all events
      for (const event of mainTrack) {
        const e = event as MidiEvent;
        currentTick += event.delta || 0;
        if (e.setTempo) {
          const bpm = mpqToBpm(e.setTempo.microsecondsPerQuarter);
          console.log(`Tempo change: ${bpm.toFixed(1)} BPM`);
          store.dispatch(setBpm(bpm));
        } else if (e.noteOn && e.noteOn.velocity > 0) {
          // Note ON event
          const noteData = {
            note: convertMIDInoteToSequencer(e.noteOn.noteNumber),
            attackTime: Math.round(currentTick / ticksPerBeat), // Convert ticks to beats
            duration: 0 // Will be calculated later
          };
          activeNotes.set(e.noteOn.noteNumber, noteData);
        } else if (e.noteOff || (e.noteOn && e.noteOn.velocity === 0)) {
          // Note OFF event (explicit or zero-velocity noteOn)
          const noteNumber = e.noteOff?.noteNumber || e.noteOn?.noteNumber;
          if (noteNumber === undefined) continue;

          const noteStart = activeNotes.get(noteNumber);
          if (noteStart) {
            const durationBeats =
              (currentTick - noteStart.attackTime * ticksPerBeat) /
              ticksPerBeat;
            completedNotes.push({
              ...noteStart,
              duration: Math.max(durationBeats, 0.1) // Ensure minimal duration
            });
            activeNotes.delete(noteNumber);
          }
        }
      }

      if (completedNotes.length > 0) {
        store.dispatch(
          setTacts(
            Math.ceil(
              (completedNotes[completedNotes.length - 1].attackTime ??
                0 + completedNotes[completedNotes.length - 1].duration) / 16
            )
          )
        );
      }

      // Second pass: Dispatch notes to Redux
      completedNotes.forEach((note) => {
        store.dispatch(
          addNote({
            note: note.note,
            attackTime: note.attackTime,
            duration: note.duration
          })
        );
      });

      console.log(`Imported ${completedNotes.length} notes from MIDI`);
    })
    .catch((error) => {
      console.error('Error processing MIDI file:', error);
    });
}

/*end: MIDI Import*/

new Tone.Loop(playMusic, '16n').start();

/* creating a keyboard events */
const keyboard = new AudioKeys({
  rows: 1
});

keyboard.down((key: Key) => {
  const note = pitchNotes[108 - key.note];
  noteDown(note);
});

keyboard.up((key: Key) => {
  const note = pitchNotes[108 - key.note];
  noteUp(note);
});

async function exportToBuffer() {
  const notesArray = store.getState().notesArray.notesArray;
  const tactsCounter = store.getState().settings.tacts ?? 8;

  const bpm = store.getState().settings.bpm ?? 120;

  store.dispatch(setCurrentStep('Exporting data to buffer'));
  store.dispatch(setProgress(0));

  const totalSteps = tactsCounter * 4;
  const durationSeconds = ((tactsCounter * 4) / bpm) * 60;

  const buffer = await Tone.Offline(
    ({ transport }) => {
      const chainOffline = chain.clone();
      // const gain = new Tone.Gain(0.2);
      // chainOffline.appendFX(gain);
      const exportedSynth = chainOffline.getSynth();

      notesArray
        // .sort((a, b) => a.attackTime - b.attackTime)
        .forEach((note) => {
          const startTime = `0:0:${note.attackTime}`;
          const durTime = `0:0:${note.duration}`;

          exportedSynth.triggerAttackRelease(
            pitchNotes[note.note],
            durTime,
            startTime
          );
        });

      transport.start(0);
    },
    durationSeconds,
    1,
    48000
  );

  store.dispatch(setProgress(100));
  return buffer.get();
}

// function floatTo16BitPCM(float32Array) {
//     const int16Array = new Int16Array(float32Array.length);
//     for (let i = 0; i < float32Array.length; i++) {
//         const s = Math.max(-1, Math.min(1, float32Array[i]));
//         int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
//     }
//     return int16Array;
// }

// Alternative more concise version
function floatTo16BitPCM(float32Array: Float32Array<ArrayBufferLike>) {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    int16Array[i] = (float32Array[i] * 0x7fff) / 16;
  }
  return int16Array;
}

function audioBufferToMp3(buffer: AudioBuffer): Promise<Blob> {
  const mp3Encoder = new lamejs.Mp3Encoder(
    buffer.numberOfChannels,
    buffer.sampleRate,
    320
  );
  const samples = buffer.getChannelData(0);
  const mp3Data: Uint8Array[] = [];

  const int16Array = floatTo16BitPCM(samples);
  const sampleBlockSize = 1152;

  return new Promise<Blob>((resolve) => {
    let i = 0;

    const processChunk = () => {
      store.dispatch(
        setCurrentStep(`Encoding... ${Math.round((i / samples.length) * 100)}%`)
      );

      const end = Math.min(i + sampleBlockSize, samples.length);
      const sampleChunk = int16Array.subarray(i, end);
      const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }

      store.dispatch(setProgress((i / samples.length) * 100));

      i += sampleBlockSize;

      if (i < samples.length) {
        setTimeout(processChunk, 0);
      } else {
        const mp3buf = mp3Encoder.flush();
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }
        store.dispatch(setCurrentStep('Done'));
        store.dispatch(setProgress(100));
        resolve(new Blob(mp3Data, { type: 'audio/mp3' }));
      }
    };

    processChunk();
  }).then((blob) => blob);
}

export async function exportMp3() {
  const buffer = await exportToBuffer();
  if (buffer) {
    const mp3Blob = await audioBufferToMp3(buffer);

    store.dispatch(setCurrentStep('Saving mp3'));
    store.dispatch(setProgress(0));

    const url = URL.createObjectURL(mp3Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'untitledf1.mp3';
    a.click();
    URL.revokeObjectURL(url);
    store.dispatch(setProgress(100));
    store.dispatch(setCurrentStep(null));
  }
}

/* creating a component */
const SoundManager = () => {
  const ss = useSelector((state: RootState) => state.soundSettings);
  const settings = useSelector((state: RootState) => state.settings);
  const currentNote = useSelector(
    (state: RootState) => state.notesArray.currentNote
  );

  const [prevNote, setPrevNote] = useState('');

  useEffect(() => {
    synth.triggerRelease(prevNote);
    if (currentNote) {
      synth.triggerAttack(currentNote);
    }
    setPrevNote(currentNote);
  }, [currentNote]);

  synth.volume.value = (ss.volume ?? 0) - 12;
  synth.set({
    oscillator: {
      type: ss.wave ?? 'sine'
    },
    envelope: {
      attack: ss.attack ?? 0,
      decay: ss.decay ?? 0,
      sustain: ss.sustain ?? 1,
      release: ss.release ?? 0
    }
  });

  if (ss.tremoloFrequency) tremolo.frequency.value = ss.tremoloFrequency;
  if (ss.tremoloDepth) tremolo.depth.value = ss.tremoloDepth;
  if (ss.delayTime) delay.delayTime.value = ss.delayTime;
  if (ss.feedback) delay.feedback.value = ss.feedback;
  if (ss.distortion) dist.distortion = ss.distortion;
  if (ss.bits) crusher.bits.value = ss.bits;
  if (ss.pitchShift) shifter.pitch = ss.pitchShift;
  if (ss.lowFilter) lowFilter.set({ frequency: ss.lowFilter });
  if (ss.highFilter) highFilter.set({ frequency: ss.highFilter });

  if (settings.bpm) Tone.Transport.bpm.value = settings.bpm;

  return <></>;
};

export default SoundManager;
