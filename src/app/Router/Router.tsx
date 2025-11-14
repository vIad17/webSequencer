import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CreationField from 'src/features/DrawableField/components/CreationField/CreationField';
import DrawableField from 'src/features/DrawableField/DrawableField';

import InstrumentLayout from 'src/layouts/InstrumentLayout/InstrumentLayout';

import InstrumentPage from 'src/pages/InstrumentPage/InstrumentPage';
import Main from 'src/pages/Main/OldMain';
import Layout from 'src/layouts/Layout/Layout';
import PreviewPage from 'src/pages/PreviewPage/PreviewPage';

const Router = () => (
  <BrowserRouter basename="/webSequencer">
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path="preview" element={<PreviewPage />}></Route>
        <Route path="" element={<InstrumentLayout />}>
          <Route path="old" element={<Main />} />
          <Route path="" element={<InstrumentPage />} />
          <Route path="*" element={<Navigate to="/webSequencer" />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
