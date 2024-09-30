import { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import { useDispatch, useSelector } from 'react-redux';

import p5 from 'p5';

import { round } from 'src/shared/functions/math';
import { setCurrentBit } from 'src/shared/redux/slices/currentMusicSlice';
import { RootState } from 'src/shared/redux/store/store';

import p5svg, { p5SVG } from 'p5.js-svg';

import './TimeStripe.scss';

p5svg(p5);

interface TimeStripeProps {
  className?: string;
}

const stripeHeigth = 30;

const TimeStripe = ({ className = '' }: TimeStripeProps) => {
  const bpm = useSelector((state: RootState) => state.settings.bpm);
  const currentBit = useSelector(
    (state: RootState) => state.currentMusic.currentBit
  );
  const isPlaying = useSelector(
    (state: RootState) => state.currentMusic.isPlaying
  );
  const drawableField = useSelector((state: RootState) => state.drawableField);
  const elementWidth = drawableField.elementWidth;
  const columnsCount = drawableField.columnsCount;

  const [p5, setP5] = useState<p5>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (p5) {
      p5.resizeCanvas(elementWidth * columnsCount, stripeHeigth);
    }
  }, [elementWidth, columnsCount]);

  const onClick = (e: MouseEvent) => {
    dispatch(setCurrentBit(round(e.offsetX, elementWidth) / elementWidth));
  };

  const setupTimeStripe = (p5: p5SVG, canvasParentRef: Element) => {
    setP5(p5);
    p5.createCanvas(elementWidth * columnsCount, stripeHeigth, p5.SVG)
      // @ts-expect-error: can't declare a p5SVG type
      .mouseClicked(onClick)
      .parent(canvasParentRef);
    p5.noLoop();
  };

  const drawTimeStripe = (p5: p5) => {
    setP5(p5);
    p5.background('#515151');
    p5.fill(0, 0, 0, 50);

    for (let x = 0; x <= columnsCount; x++) {
      x % 16 === 0 ? p5.strokeWeight(2) : p5.strokeWeight(1);
      p5.line(x * elementWidth, 0, x * elementWidth, stripeHeigth);
    }
    p5.line(0, stripeHeigth, elementWidth * columnsCount, stripeHeigth);
  };

  const setupTimeline = (p5: p5SVG, canvasParentRef: Element) => {
    setP5(p5);
    p5.createCanvas(20, p5.windowHeight, p5.SVG)
      // @ts-expect-error: can't declare a p5SVG type
      .mouseClicked(onClick)
      .parent(canvasParentRef);
    p5.noLoop();
  };

  const drawTimeline = (p5: p5) => {
    setP5(p5);

    p5.fill('orange').triangle(
      0,
      stripeHeigth / 1.5,
      20,
      stripeHeigth / 1.5,
      10,
      stripeHeigth
    );

    p5.stroke('orange')
      .strokeWeight(2)
      .line(elementWidth / 2, stripeHeigth, elementWidth / 2, 1000);
  };

  return bpm ? (
    <div
      className={`time-stripe ${isPlaying ? 'time-stripe_animated ' : ''}${className}`}
      style={{
        '--x': `${currentBit * elementWidth - 10}px`,
        '--anim-time': `${60 / (bpm * 4)}s`
      }}
    >
      <Sketch
        className="time-stripe__timeline"
        setup={(p5, canvasParentRef) =>
          setupTimeline(p5 as p5SVG, canvasParentRef)
        }
        draw={drawTimeline}
      />
      <Sketch
        className="time-stripe__stripe"
        setup={(p5, canvasParentRef) =>
          setupTimeStripe(p5 as p5SVG, canvasParentRef)
        }
        draw={drawTimeStripe}
      />
    </div>
  ) : (
    <></>
  );
};

export default TimeStripe;
