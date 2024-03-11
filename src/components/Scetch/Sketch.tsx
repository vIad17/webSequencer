import Sketch from 'react-p5';

import p5 from 'p5';
import * as Tone from 'tone';

interface MySketchProps {
  className?: string;
}

const MySketch = ({ className = '' }: MySketchProps) => {
  const waveform = new Tone.Waveform();
  Tone.Master.connect(waveform);

  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(400, 400).parent(canvasParentRef);
  };

  const draw = (p5: p5) => {
    p5.background('black');
    p5.stroke('white');
    p5.noFill();

    const buffer = waveform.getValue();

    let start = 0;
    for (let i = 1; i < buffer.length; i++) {
      if (buffer[i - 1] < 0 && buffer[i] >= 0) {
        start = i;
        break;
      }
    }
    const end = buffer.length / 2 + start;

    p5.beginShape();
    for (let i = start; i < end; i++) {
      const x = p5.map(i, start, end, 0, p5.width);
      const y = p5.map(buffer[i], -1, 1, 0, p5.height);
      p5.vertex(x, y);
    }
    p5.vertex(p5.width, p5.height);
    p5.vertex(0, p5.height);
    p5.endShape(p5.CLOSE);
  };

  return <Sketch className={`sketch ${className}`} setup={setup} draw={draw} />;
};

export default MySketch;
