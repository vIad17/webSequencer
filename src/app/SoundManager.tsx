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

  notesArray.forEach((note, index) => {
    if (note.attackTime === currentBit) {
      store.dispatch(setActiveNote({ index, isActive: true }));
      synth.triggerAttackRelease(
        pitchNotes[note.note],
        `0:0:${note.duration}`,
        time
      );
      store.dispatch(addPlayingNote(pitchNotes[note.note]));
    }
    if (note.attackTime + note.duration <= currentBit) {
      note.isActive &&
        store.dispatch(setActiveNote({ index, isActive: false }));
      store.dispatch(removePlayingNote(pitchNotes[note.note]));
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

function convertMIDInoteToSequencer(note: number) :number{
  return 83 - note;
}

function mpqToBpm(microsecondsPerQuarter: number): number {
  const MICROSECONDS_PER_MINUTE = 60000000;  // 60,000,000 μs in a minute
  return MICROSECONDS_PER_MINUTE / microsecondsPerQuarter;
}

export function openMIDI(arrayBuffer: ArrayBuffer) {
  parseArrayBuffer(arrayBuffer).then((json) => {
    if (!json?.tracks?.length) {
      console.error('Invalid MIDI file: No tracks found');
      return;
    }

    console.log(json);

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
          attackTime: currentTick / ticksPerBeat, // Convert ticks to beats
          duration: 0 // Will be calculated later
        };
        activeNotes.set(e.noteOn.noteNumber, noteData);
      } 
      else if (
        (e.noteOff) || 
        (e.noteOn && e.noteOn.velocity === 0)
      ) {
        // Note OFF event (explicit or zero-velocity noteOn)
        const noteNumber = e.noteOff?.noteNumber || e.noteOn?.noteNumber;
        if (noteNumber === undefined) continue;

        const noteStart = activeNotes.get(noteNumber);
        if (noteStart) {
          const durationBeats = (currentTick - noteStart.attackTime * ticksPerBeat) / ticksPerBeat;
          completedNotes.push({
            ...noteStart,
            duration: Math.max(durationBeats, 0.1) // Ensure minimal duration
          });
          activeNotes.delete(noteNumber);
        }
      }
    }

    // Second pass: Dispatch notes to Redux
    completedNotes.forEach(note => {
      store.dispatch(
        addNote({
          note: note.note,
          attackTime: note.attackTime,
          duration: note.duration
        })
      );
    });

    console.log(`Imported ${completedNotes.length} notes from MIDI`);
  }).catch(error => {
    console.error('Error processing MIDI file:', error);
  });
}

new Tone.Loop(playMusic, '16n').start();

/* creating a keyboard events */
const keyboard = new AudioKeys({
  rows: 1
});

keyboard.down((key: Key) => {
  const note = pitchNotes[95 - key.note];
  store.dispatch(addPlayingNote(note));
  synth.triggerAttack(note);
});

keyboard.up((key: Key) => {
  const note = pitchNotes[95 - key.note];
  store.dispatch(removePlayingNote(note));
  synth.triggerRelease(note);
});

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
