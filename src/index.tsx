import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './app/App';
import store from './shared/redux/store/store';

import './index.scss';

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') {
    return;
  }

  const { startMockServiceWorker } = await import('src/shared/lib/msw/browser');

  return startMockServiceWorker();
}

const container = document.getElementById('root') as Element;
const root = createRoot(container);

enableMocking().then(() => {
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});
