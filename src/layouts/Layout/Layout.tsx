import { Outlet } from 'react-router-dom';

import Header from 'src/layouts/Layout/components/Header/Header';
import Sidebar from 'src/layouts/Layout/components/Sidebar/Sidebar';

import './Layout.scss';
import SearchParamsManager from 'src/app/SearchParamsManager';

const Layout = () => (
  <div className="layout">
    <SearchParamsManager />
    <Header className="layout__header" />
    <div className="layout__content">
      <div className="layout__outlet">
        <Outlet />
      </div>
      <Sidebar className="layout__sidebar" />
    </div>
  </div>
);

export default Layout;
