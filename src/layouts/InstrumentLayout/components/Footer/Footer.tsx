import MySketch from 'src/components/Scetch/Sketch';
import SoundSettings from 'src/components/SoundSettings/SoundSettings';

import './Footer.scss';
import clsx from 'clsx';
import SynthCard from 'src/features/Effects/components/SynthCard/SynthCard';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => (
  <div className={clsx('footer', className)}>
    <SynthCard className="footer__synth" name="Synth" />
    <div className="footer__effects"></div>
    <MySketch className="footer__sketch" />
  </div>
);

export default Footer;
