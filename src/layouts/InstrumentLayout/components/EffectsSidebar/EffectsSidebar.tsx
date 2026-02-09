import MySketch from 'src/components/Scetch/Sketch';
import SoundSettings from 'src/components/SoundSettings/SoundSettings';

import './EffectsSidebar.scss';
import { RootState } from 'src/shared/redux/store/store';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import EffectPreview from 'src/features/Effects/components/EffectPreview/EffectPreview';
import { IconType } from 'src/shared/icons/IconMap';
import { EffectType } from 'src/shared/redux/slices/effectsSlice';

const allEffectTypes = (Object.values(EffectType).filter(
  (v) => typeof v === "number"
) as EffectType[]);

interface SidebarProps {
  className?: string;
}

const EffectsSidebar = ({ className = '' }: SidebarProps) => {
  const isSidebarOpen = useSelector((state: RootState) => state.effectsSidebar.isOpen);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    if (isSidebarOpen) {
      sidebar.style.width = 'auto';
      const naturalWidth = sidebar.offsetWidth;
      sidebar.style.width = '';

      setWidth(naturalWidth);
    } else {
      setWidth(0);
    }
  }, [isSidebarOpen]);

  return (
    <div
      ref={sidebarRef}
      className={clsx('effects-sidebar', className, { 'effects-sidebar_open': isSidebarOpen })}
      style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
    >
      <div className='effects-sidebar__container'>
        {allEffectTypes.map((type) => (
          <EffectPreview key={type} type={type} />
        ))}
      </div>
    </div>
  );
};

export default EffectsSidebar;
