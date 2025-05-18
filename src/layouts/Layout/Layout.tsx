import { Outlet } from 'react-router-dom';

import SearchParamsManager from 'src/app/SearchParamsManager';

const Layout = () => (
  <>
    <SearchParamsManager />
    <Outlet />
  </>
);

export default Layout;
