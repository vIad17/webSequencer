import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


import { useMIDINote, useMIDIInputs } from '@react-midi/hooks';
import {noteDown, noteUp, convertMIDInoteToSequencer, getPitch } from 'src/app/SoundManager'

/* creating a component */
const LiveMIDIInput = () => {
  // Listen to ALL MIDI notes on ALL channels (no filter)
  const noteEvent = useMIDINote();
  const { input, inputs, selectInput, selectedInputId } = useMIDIInputs();
  
  //console.log(noteEvent);
  //selectInput('input-1');

  useEffect(() => {
    if (!noteEvent) return;
    //console.log(noteEvent);
    
    if (!!noteEvent.on) {
      noteDown(getPitch(convertMIDInoteToSequencer(noteEvent.note)));
      console.log('Key PRESSED:', noteEvent);
    } else {
      noteUp(getPitch(convertMIDInoteToSequencer(noteEvent.note)));
      console.log('Key RELEASED:', noteEvent);
    }
  }, [noteEvent]);

  return <></>;
}

export default LiveMIDIInput;