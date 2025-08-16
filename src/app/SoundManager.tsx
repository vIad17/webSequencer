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
  addSelectedNote,
  addPlayingNote,
  changeSelectedNote,
  removePlayingNote,
  setActiveNote,
  removeActiveNotes
} from 'src/shared/redux/slices/notesArraySlice';
import store, { RootState } from 'src/shared/redux/store/store';

import * as lamejs from '@breezystack/lamejs';

import { parseArrayBuffer } from 'midi-json-parser';
import { addNote } from 'src/shared/redux/slices/notesArraySlice';
import { setBpm, setTacts } from 'src/shared/redux/slices/settingsSlice';

/* creating a synth */
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0.01
  }
}).connect(new Tone.Add(2));

/* creating effects */

// tremoloFrequency [0, 10]
// tremoloDepth [0, 1]
const tremolo = new Tone.Tremolo(0, 0).start(); // affects the gain

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

synth.chain(
  tremolo,
  delay,
  dist,
  crusher,
  shifter,
  highFilter,
  lowFilter,
  gain,
  Tone.getDestination()
);

/* creating a loop music */
function playMusic(time: number) {
  const currentBit = store.getState().currentMusic.currentBit;
  const tactsCounter = store.getState().settings.tacts ?? 8;
  const notesArray = store.getState().notesArray.notesArray;

  console.log("time", time)

  notesArray.forEach((note, index) => {
    if (note.attackTime === currentBit) {
      store.dispatch(setActiveNote({ index, isActive: true }));
      synth.triggerAttackRelease(
        pitchNotes[note.note],
        `0:0:${note.duration}`,
        time);
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
            Math.ceil((completedNotes[completedNotes.length - 1].attackTime ??
              0 + completedNotes[completedNotes.length - 1].duration) / 16)
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
  // const pitchNotes = store.getState().pitchNotes;
  const tactsCounter = store.getState().settings.tacts ?? 8;

  const bpm = store.getState().settings.bpm ?? 120;

  const totalSteps = tactsCounter * 4;
  const durationSeconds = ((tactsCounter * 4) / bpm ) * 60;

  const buffer = await Tone.Offline(({ transport }) => {
    // --- recreate synth in offline context (clone from live if needed)
    const synth = new Tone.Synth().toDestination();

    console.log("tempo: " + transport.bpm.value)

    // --- recreate effects (you can also pass `.get()` from live instances)
    const tremolo = new Tone.Tremolo().start();
    const delay = new Tone.FeedbackDelay("8n", 0.5);
    const dist = new Tone.Distortion(0.4);
    const crusher = new Tone.BitCrusher(4);
    const shifter = new Tone.PitchShift(2);
    const highFilter = new Tone.Filter(12000, "lowpass");
    const lowFilter = new Tone.Filter(200, "highpass");
    const gain = new Tone.Gain(0.8);

    // --- chain them together
    synth.chain(
      tremolo,
      delay,
      dist,
      crusher,
      shifter,
      highFilter,
      lowFilter,
      gain,
      Tone.getDestination()
    );

    // --- schedule notes
    notesArray
      // .sort((a, b) => a.attackTime - b.attackTime)
      .forEach((note) => {
        const startTime = `0:0:${note.attackTime}`;
        const durTime = `0:0:${note.duration}`;

        console.log(startTime, durTime)

        synth.triggerAttackRelease(
          pitchNotes[note.note],
          durTime,
          startTime
        );
      });

    transport.start(0);
  }, durationSeconds);

  return buffer.get();
}

function audioBufferToMp3(buffer: AudioBuffer): Blob {
  console.log("ABOBA: " + buffer.sampleRate)
  const mp3Encoder = new lamejs.Mp3Encoder(1, buffer.sampleRate, 128);
  const samples = buffer.getChannelData(0); // mono for simplicity
  const mp3Data: Uint8Array[] = [];

  const sampleBlockSize = 1152;
  for (let i = 0; i < samples.length; i += sampleBlockSize) {
    const sampleChunk = (samples.subarray(i, i + sampleBlockSize).map(el => el * 10000));
    // console.log(sampleChunk)
    const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  const mp3buf = mp3Encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }

  return new Blob(mp3Data, { type: "audio/mp3" });
}

export async function exportMp3() {
  const buffer = await exportToBuffer();
  const mp3Blob = audioBufferToMp3(buffer);

  const url = URL.createObjectURL(mp3Blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "melody.mp3";
  a.click();
  URL.revokeObjectURL(url);
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
