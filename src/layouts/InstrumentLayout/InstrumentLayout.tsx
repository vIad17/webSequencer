import { Outlet } from 'react-router-dom';

import Header from 'src/layouts/InstrumentLayout/components/Header/Header';
import Sidebar from 'src/layouts/InstrumentLayout/components/Sidebar/Sidebar';

import './InstrumentLayout.scss';
import Footer from './components/Footer/Footer';

const InstrumentLayout = () => (
  <div className="instrument-layout">
    <Header className="instrument-layout__header" />
    <div className="instrument-layout__content">
      <div className="instrument-layout__content">
        <Outlet />
      </div>
      {/* <Sidebar className="instrument-layout__sidebar" /> */}
    </div>
    {<Footer className="instrument-layout__footer" />}
  </div>
);

export default InstrumentLayout;
