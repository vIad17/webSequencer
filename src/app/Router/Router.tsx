import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import InstrumentLayout from 'src/layouts/InstrumentLayout/InstrumentLayout';
import Layout from 'src/layouts/Layout/Layout';

import InstrumentPage from 'src/pages/InstrumentPage/InstrumentPage';
import Main from 'src/pages/Main/OldMain';
import PreviewPage from 'src/pages/PreviewPage/PreviewPage';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path="preview" element={<PreviewPage />}></Route>
        <Route path="" element={<InstrumentLayout />}>
          <Route path="old" element={<Main />} />
          <Route path="" element={<InstrumentPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
