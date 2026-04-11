import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';


import MySketch from 'src/components/Scetch/Sketch';
import SynthCard from 'src/features/Effects/components/SynthCard/SynthCard';

import { SortableItem } from './SortableItem';

import type { RootState } from 'src/shared/redux/store/store';

import './Footer.scss';

export const FOOTER_DROP_ID = 'footer-dropzone';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {

  const effects = useSelector((state: RootState) => 
    state.effects.effects
  );

  const { setNodeRef: setFooterDropRef, active } = useDroppable({ id: FOOTER_DROP_ID });

  return (
    <div className={clsx('footer', className)}>
      <SynthCard className="footer__synth" name="Synth" />

      <div ref={setFooterDropRef} className="footer__effects">
        <SortableContext items={effects} strategy={horizontalListSortingStrategy}>
          {effects.map((effect) => {
            if (!effect) return null;
            return <SortableItem key={effect.id} id={effect.id} effect={effect} />;
          })}
        </SortableContext>
      </div>

      <MySketch className="footer__sketch" />
    </div>
  );
};

export default Footer;
