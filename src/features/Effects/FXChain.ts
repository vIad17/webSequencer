import { useSelector } from "react-redux";
import { RootState } from "src/shared/redux/store/store";
import * as Tone from 'tone';

export class FXChain {
  private synth: Tone.PolySynth;
  private effectsChain: Tone.ToneAudioNode[] = [];

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
    position: number
  ): T {
    position = Math.max(position, 0);
    const newFX = new FXClass();

    if (position >= this.effectsChain.length) {
      if (this.effectsChain.length > 0) {
        this.effectsChain[this.effectsChain.length - 1].disconnect();
        this.effectsChain[this.effectsChain.length - 1].connect(newFX);
      } else {
        this.synth.disconnect();
        this.synth.connect(newFX);
      }
      newFX.toDestination();
      this.effectsChain.push(newFX);
    } else {
      if (position === 0) {
        this.synth.disconnect();
        this.synth.connect(newFX);
        newFX.connect(this.effectsChain[0]);
      } else {
        // Insert in the middle
        this.effectsChain[position - 1].disconnect();
        this.effectsChain[position - 1].connect(newFX);
        newFX.connect(this.effectsChain[position]);
      }
      this.effectsChain.splice(position, 0, newFX);
    }

    if (typeof (newFX as any).start === 'function') {
      (newFX as any).start();
    }

    return newFX;
  }

  //Adds existing FX to chain
  public addFX(newFX: Tone.ToneAudioNode, position: number): Tone.ToneAudioNode {
    position = Math.max(position, 0);

    if (position >= this.effectsChain.length) {
      if (this.effectsChain.length > 0) {
        this.effectsChain[this.effectsChain.length - 1].disconnect();
        this.effectsChain[this.effectsChain.length - 1].connect(newFX);
      } else {
        this.synth.disconnect();
        this.synth.connect(newFX);
      }
      newFX.toDestination();
      this.effectsChain.push(newFX);
    } else {
      if (position === 0) {
        this.synth.disconnect();
        this.synth.connect(newFX);
        newFX.connect(this.effectsChain[0]);
      } else {
        this.effectsChain[position - 1].disconnect();
        this.effectsChain[position - 1].connect(newFX);
        newFX.connect(this.effectsChain[position]);
      }
      this.effectsChain.splice(position, 0, newFX);
    }

    if (typeof (newFX as any).start === 'function') {
      (newFX as any).start();
    }

    return newFX;
  }

  private removeFXconnections(position: number): Tone.ToneAudioNode {
    const removedFX = this.effectsChain[position];

    if (this.effectsChain.length === 1) {
      this.synth.disconnect();
      removedFX.disconnect();
      this.synth.toDestination();
    } else if (position === 0) {
      this.synth.disconnect();
      removedFX.disconnect();
      this.synth.connect(this.effectsChain[1]);
    } else if (position === this.effectsChain.length - 1) {
      this.effectsChain[position - 1].disconnect();
      removedFX.disconnect();
      this.effectsChain[position - 1].toDestination();
    } else {
      this.effectsChain[position - 1].disconnect();
      removedFX.disconnect();
      this.effectsChain[position - 1].connect(this.effectsChain[position + 1]);
    }

    return removedFX;
  }

  public removeFX(position: number): void {
    if (position < 0 || position >= this.effectsChain.length) return;

    this.removeFXconnections(position);
    this.effectsChain[position].dispose();
    this.effectsChain.splice(position, 1);
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

  public appendFX(newFX: Tone.ToneAudioNode) {
    this.addFX(newFX, this.effectsChain.length);
  }

  public clone(): FXChain {
    const synthOptions = this.synth.get();
    const clonedChain = new FXChain(synthOptions);

    // Recreate each effect in order
    this.effectsChain.forEach((fx, index) => {
      const FXConstructor = fx.constructor as new () => Tone.ToneAudioNode;
      try {
        const clonedFX = new FXConstructor();

        // Copy over parameters if possible
        if ((fx as any).get && (clonedFX as any).set) {
          const params = (fx as any).get();
          (clonedFX as any).set(params);
        }

        clonedChain.appendFX(clonedFX);
      } catch (e) {
        console.warn("Could not clone effect at index", index, e);
      }
    });

    return clonedChain;
  }

  public getSynth(): Tone.PolySynth {
    return this.synth;
  }

  public getEffectsChain(): Tone.ToneAudioNode[] {
    return [...this.effectsChain];
  }

  public dispose(): void {
    this.synth.dispose();
    this.effectsChain.forEach(fx => fx.dispose());
    this.effectsChain = [];
  }
}