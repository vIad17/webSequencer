import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from 'src/layouts/Layout/Layout';

import InstrumentPage from 'src/pages/InstrumentPage/InstrumentPage';
import Main from 'src/pages/Main/OldMain';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/webSequencer/old" element={<Main />} />
        <Route path="/" element={<InstrumentPage />} />
        <Route path="/:params" element={<InstrumentPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
