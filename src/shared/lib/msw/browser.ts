import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

const worker = setupWorker(...handlers);

export const startMockServiceWorker = async () => {
  await worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/webSequencer/mockServiceWorker.js'
    }
  });

  console.log('🔶 MSW: Mock Service Worker started');
};
