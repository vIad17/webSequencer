import { useSelector } from "react-redux";
import store, { RootState } from "src/shared/redux/store/store";
import * as Tone from 'tone';
import { number, string } from "zod";

export type FXChainNode = {node: Tone.ToneAudioNode, uID: string};

export class FXChain {
  private synth: Tone.PolySynth;
  private effectsChain: FXChainNode[] = [];
  // private effectsIdMap: Map<string, Tone.ToneAudioNode>;

  constructor(synthOptions?: Tone.SynthOptions) {
    this.synth = new Tone.PolySynth(Tone.Synth, synthOptions ?? {
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
    this.synth.toDestination();
  }

  // Creates FX with default values and adds it to chain. position 0 = right after synth
  public CreateFX<T extends Tone.ToneAudioNode>(
    FXClass: new (...args: any[]) => T,
    position: number,
    uID?: string
  ):  FXChainNode {
    position = Math.max(position, 0);
    const newFX = new FXClass();

    if(!uID){
      uID = crypto.randomUUID();
    }

    let NewNode:FXChainNode = {node: newFX, uID};
    // this.effectsIdMap.set(uID, newFX);

    if (position >= this.effectsChain.length) {
      if (this.effectsChain.length > 0) {
        this.effectsChain[this.effectsChain.length - 1].node.disconnect();
        this.effectsChain[this.effectsChain.length - 1].node.connect(newFX);
      } else {
        this.synth.disconnect();
        this.synth.connect(newFX);
      }
      newFX.toDestination();
      this.effectsChain.push(NewNode);
    } else {
      if (position === 0) {
        this.synth.disconnect();
        this.synth.connect(newFX);
        newFX.connect(this.effectsChain[0].node);
      } else {
        // Insert in the middle
        this.effectsChain[position - 1].node.disconnect();
        this.effectsChain[position - 1].node.connect(newFX);
        newFX.connect(this.effectsChain[position].node);
      }
      this.effectsChain.splice(position, 0, NewNode);
    }

    if (typeof (newFX as any).start === 'function') {
      (newFX as any).start();
    }

    return NewNode;
  }

  //Adds existing FX to chain
  public addFX(newFX: Tone.ToneAudioNode, position: number, uID?: string): FXChainNode {
    if(!uID){
      uID = crypto.randomUUID();
    }
    // this.effectsIdMap.set(uID, newFX);

    position = Math.max(position, 0);

    let NewNode:FXChainNode = {node: newFX, uID};

    if (position >= this.effectsChain.length) {
      if (this.effectsChain.length > 0) {
        this.effectsChain[this.effectsChain.length - 1].node.disconnect();
        this.effectsChain[this.effectsChain.length - 1].node.connect(newFX);
      } else {
        this.synth.disconnect();
        this.synth.connect(newFX);
      }
      newFX.toDestination();
      this.effectsChain.push(NewNode);
    } else {
      if (position === 0) {
        this.synth.disconnect();
        this.synth.connect(newFX);
        newFX.connect(this.effectsChain[0].node);
      } else {
        this.effectsChain[position - 1].node.disconnect();
        this.effectsChain[position - 1].node.connect(newFX);
        newFX.connect(this.effectsChain[position].node);
      }
      this.effectsChain.splice(position, 0, NewNode);
    }

    if (typeof (newFX as any).start === 'function') {
      (newFX as any).start();
    }

    return NewNode;
  }

  addFXnode(newFX: FXChainNode, position: number): FXChainNode{
    return this.addFX(newFX.node, position, newFX.uID);
  }

  public appendFX(newFX: Tone.ToneAudioNode, uID?: string): FXChainNode{
    console.log("ABOBA");
    return this.addFX(newFX, this.effectsChain.length, uID);
  }

  public appendFXnode(newFX: FXChainNode): FXChainNode{
    return this.appendFX(newFX.node, newFX.uID);
  }

  public moveFX(position: number, newPosition: number) {
    if (position < 0 || position >= this.effectsChain.length) return;
    newPosition = Math.max(0, Math.min(newPosition, this.effectsChain.length - 1));
    if (newPosition == position) return;

    const removedFX = this.removeFXconnections(position);

    if (newPosition > position) newPosition++;
    this.addFX(removedFX, newPosition);

    this.effectsChain.splice(position, 1);

  }

  public removeFX(index?: string | number): void {
    let ind: number =-1;

    if(typeof index === 'string') {
      ind = this.effectsChain.findIndex(e => e.uID === index);
    }else if (typeof index === 'number'){
      ind = index;
    };

    if (ind < 0 || ind >= this.effectsChain.length) return;

    this.removeFXconnections(ind);
    this.effectsChain[ind].node.dispose();
    this.effectsChain.splice(ind, 1);
  }

  //TODO: Boilerplate. Rewrite
  public clone(): FXChain {
    // Clone synth first
    const synthOptions = this.synth.get();
    const clonedChain = new FXChain(synthOptions);

    const ss = store.getState().soundSettings;

    const tremolo = new Tone.Tremolo(0, 0)
    const delay = new Tone.FeedbackDelay(0, 0);
    // const dist = new Tone.Distortion(0);
    const crusher = new Tone.BitCrusher(16);
    const shifter = new Tone.PitchShift(0);
    const highFilter = new Tone.Filter(20, 'lowpass');
    const lowFilter = new Tone.Filter(8000, 'highpass');
    // const gain = new Tone.Gain(6);

    if (ss.tremoloFrequency) tremolo.frequency.value = ss.tremoloFrequency;
    if (ss.tremoloDepth) tremolo.depth.value = ss.tremoloDepth;
    if (ss.delayTime) delay.delayTime.value = ss.delayTime;
    if (ss.feedback) delay.feedback.value = ss.feedback;
    // if (ss.distortion) dist.distortion = ss.distortion;
    if (ss.bits) crusher.bits.value = ss.bits;
    if (ss.pitchShift) shifter.pitch = ss.pitchShift;
    if (ss.lowFilter) lowFilter.set({ frequency: ss.lowFilter });
    if (ss.highFilter) highFilter.set({ frequency: ss.highFilter });


    clonedChain.appendFX(tremolo);
    clonedChain.appendFX(delay);
    // clonedChain.appendFX(dist);
    clonedChain.appendFX(crusher);
    clonedChain.appendFX(shifter);
    clonedChain.appendFX(highFilter);
    clonedChain.appendFX(lowFilter);
    // clonedChain.appendFX(gain);

    return clonedChain;
  }

  public getSynth(): Tone.PolySynth {
    return this.synth;
  }

  public getFX(index?: string | number): FXChainNode | undefined{
    if(typeof index === 'string') {
      return this.effectsChain.find(e => e.uID === index );
    } 
    if(typeof index === 'number') return this.effectsChain[index];
    return undefined;
  }

  public getEffectsChain(): FXChainNode[] {
    return [...this.effectsChain];
  }

  public dispose(): void {
    this.getFX()
    this.synth.dispose();
    this.effectsChain.forEach(fx => fx.node.dispose());
    this.effectsChain = [];
  }

  private removeFXconnections(position: number): Tone.ToneAudioNode {
    const removedFX = this.effectsChain[position].node;

    if (this.effectsChain.length === 1) {
      this.synth.disconnect();
      removedFX.disconnect();
      this.synth.toDestination();
    } else if (position === 0) {
      this.synth.disconnect();
      removedFX.disconnect();
      this.synth.connect(this.effectsChain[1].node);
    } else if (position === this.effectsChain.length - 1) {
      this.effectsChain[position - 1].node.disconnect();
      removedFX.disconnect();
      this.effectsChain[position - 1].node.toDestination();
    } else {
      this.effectsChain[position - 1].node.disconnect();
      removedFX.disconnect();
      this.effectsChain[position - 1].node.connect(this.effectsChain[position + 1].node);
    }

    return removedFX;
  }
}