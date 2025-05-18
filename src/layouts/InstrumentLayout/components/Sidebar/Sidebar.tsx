import MySketch from 'src/components/Scetch/Sketch';
import SoundSettings from 'src/components/SoundSettings/SoundSettings';

import './Sidebar.scss';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => (
  <div className={`sidebar ${className}`}>
    <SoundSettings className="sidebar__settings" />
    <MySketch className="sidebar__sketch" />
  </div>
);

export default Sidebar;
