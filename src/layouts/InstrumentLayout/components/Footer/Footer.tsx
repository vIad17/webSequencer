import MySketch from 'src/components/Scetch/Sketch';
import SoundSettings from 'src/components/SoundSettings/SoundSettings';

import './Footer.scss';
import clsx from 'clsx';
import SynthCard from 'src/features/Effects/components/SynthCard/SynthCard';

//temp
import FXBitcrush from 'src/features/Effects/components/EffectCard/FXBitcruch/FXBitcrush';
import FXTremolo from 'src/features/Effects/components/EffectCard/FXTremolo/FXTremolo';
import FXGainADSR from 'src/features/Effects/components/EffectCard/FXGainADSR/FXGainADSR';
//--

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => (
  <div className={clsx('footer', className)}>
    <SynthCard className="footer__synth" name="Synth" />
    <div className="footer__effects">
      <FXBitcrush className='footer__effects_card' name={'Bitcrush'}></FXBitcrush>
      <FXTremolo name={''}></FXTremolo>
      <FXGainADSR name={''}></FXGainADSR>
    </div>
    <MySketch className="footer__sketch" />
  </div>
);

export default Footer;
