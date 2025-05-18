import { Outlet } from 'react-router-dom';

import Header from 'src/layouts/InstrumentLayout/components/Header/Header';
import Sidebar from 'src/layouts/InstrumentLayout/components/Sidebar/Sidebar';

import './InstrumentLayout.scss';

const InstrumentLayout = () => (
  <div className="instrument-layout">
    <Header className="instrument-layout__header" />
    <div className="instrument-layout__content">
      <div className="instrument-layout__outlet">
        <Outlet />
      </div>
      <Sidebar className="instrument-layout__sidebar" />
    </div>
  </div>
);

export default InstrumentLayout;
