import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './app/App';
import store from './shared/redux/store/store';

import './index.scss';

const container = document.getElementById('root') as Element;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
