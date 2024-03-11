import { useSelector } from 'react-redux';

import AudioKeys, { Key } from 'audiokeys';
import * as Tone from 'tone';

import { pitchNotes } from 'src/shared/const/notes';
import { setBit } from 'src/shared/redux/slices/bitSlice';
import store, { RootState } from 'src/shared/redux/store/store';

/* creating a synth */
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine'
  },
  envelope: {
    attack: 0,
    decay: 0,
    sustain: 1,
    release: 0
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
  const bit = (Tone.Transport.position as string).split(':');
  const currentBit =
    (parseInt(bit[0]) * 16 + parseInt(bit[1]) * 4 + parseInt(bit[2])) %
    (store.getState().settings.tacts * 16);

  store.dispatch(setBit(currentBit));

  const notesArray = store.getState().notesArray.notesArray;

  notesArray.forEach((note) => {
    if (note.attackTime === currentBit) {
      synth.triggerAttackRelease(
        pitchNotes[note.note],
        `0:0:${note.duration}`,
        time
      );
    }
  });
}

new Tone.Loop(playMusic, '16n').start();

/* creating a keyboard event */
const keyboard = new AudioKeys({
  rows: 1
});

keyboard.down((key: Key) => {
  synth.triggerAttack(key.frequency);
});

keyboard.up((key: Key) => {
  synth.triggerRelease(key.frequency);
});

/* creating a component */
const SoundManager = () => {
  const soundSettings = useSelector((state: RootState) => state.soundSettings);
  const bpm = useSelector((state: RootState) => state.settings.bpm);

  synth.volume.value = soundSettings.volume - 12;
  synth.set({
    oscillator: {
      type: soundSettings.wave
    },
    envelope: {
      attack: soundSettings.attack,
      decay: soundSettings.decay,
      sustain: soundSettings.sustain,
      release: soundSettings.release
    }
  });

  tremolo.frequency.value = soundSettings.tremoloFrequency;
  tremolo.depth.value = soundSettings.tremoloDepth;
  delay.delayTime.value = soundSettings.delayTime;
  delay.feedback.value = soundSettings.feedback;
  dist.distortion = soundSettings.distortion;
  crusher.bits.value = soundSettings.bits;
  shifter.pitch = soundSettings.pitchShift;
  lowFilter.set({ frequency: soundSettings.lowFilter });
  highFilter.set({ frequency: soundSettings.highFilter });

  Tone.Transport.bpm.value = bpm;

  return <></>;
};

export default SoundManager;
