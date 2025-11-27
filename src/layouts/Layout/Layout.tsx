import { Outlet } from 'react-router-dom';

import SearchParamsManager from 'src/app/SearchParamsManager';

const Layout = () => {
  return (
    <>
      <SearchParamsManager />
      <Outlet />
    </>
  );
};

export default Layout;
