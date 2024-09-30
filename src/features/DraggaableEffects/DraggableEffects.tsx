import './DraggableEffects.scss';
import EffectCard from './components/EffectCard/EffectCard';

interface DraggaableEffectsProps {
  className?: string;
}

const DraggaableEffects = ({ className = '' }: DraggaableEffectsProps) => {


  return <div className={`draggable-effects ${className}`}><EffectCard /></div>;
};

export default DraggaableEffects;
