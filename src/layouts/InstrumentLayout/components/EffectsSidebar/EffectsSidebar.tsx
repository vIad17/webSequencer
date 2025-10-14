import MySketch from 'src/components/Scetch/Sketch';
import SoundSettings from 'src/components/SoundSettings/SoundSettings';

import './EffectsSidebar.scss';
import { RootState } from 'src/shared/redux/store/store';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

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
      // Temporarily show to measure width
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
      <p>aasdsfhdsh</p>
      <p>aasdsfhdsh</p>
      <p>aasdsfhdsh</p>
      <p>aasdsfhdsh</p>
      <p>aasdsfhdsh</p>
    </div>
  );
};

export default EffectsSidebar;
