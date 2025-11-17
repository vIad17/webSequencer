/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker.
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 */

const PACKAGE_VERSION = '2.12.1';
const INTEGRITY_CHECKSUM = '4db4a41e972cec1b64cc569c66952d82';
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse');
const activeClientIds = new Set<string>();

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', async (event: ExtendableMessageEvent) => {
  const clientId = Reflect.get(event.source || {}, 'id') as string | undefined;

  if (!clientId || !self.clients) {
    return;
  }

  const client = await self.clients.get(clientId);
  if (!client) return;

  const allClients = await self.clients.matchAll({ type: 'window' });

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(client, { type: 'KEEPALIVE_RESPONSE' });
      break;
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(client, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: {
          packageVersion: PACKAGE_VERSION,
          checksum: INTEGRITY_CHECKSUM
        }
      });
      break;
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId);
      sendToClient(client, {
        type: 'MOCKING_ENABLED',
        payload: {
          client: {
            id: client.id,
            frameType: client.frameType
          }
        }
      });
      break;
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId);

      const remainingClients = allClients.filter(
        (client) => client.id !== clientId
      );

      if (remainingClients.length === 0) {
        self.registration.unregister();
      }

      break;
    }
  }
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const requestInterceptedAt = Date.now();

  if (event.request.mode === 'navigate') return;

  if (
    event.request.cache === 'only-if-cached' &&
    event.request.mode !== 'same-origin'
  ) {
    return;
  }

  if (activeClientIds.size === 0) return;

  const requestId = crypto.randomUUID();
  event.respondWith(handleRequest(event, requestId, requestInterceptedAt));
});

async function handleRequest(
  event: FetchEvent,
  requestId: string,
  requestInterceptedAt: number
): Promise<Response> {
  const client = await resolveMainClient(event);
  const requestCloneForEvents = event.request.clone();
  const response = await getResponse(
    event,
    client,
    requestId,
    requestInterceptedAt
  );

  if (client && activeClientIds.has(client.id)) {
    const serializedRequest = await serializeRequest(requestCloneForEvents);
    const responseClone = response.clone();

    sendToClient(
      client,
      {
        type: 'RESPONSE',
        payload: {
          isMockedResponse: IS_MOCKED_RESPONSE in response,
          request: {
            id: requestId,
            ...serializedRequest
          },
          response: {
            type: responseClone.type,
            status: responseClone.status,
            statusText: responseClone.statusText,
            headers: Object.fromEntries(responseClone.headers.entries()),
            body: responseClone.body
          }
        }
      },
      responseClone.body ? [serializedRequest.body, responseClone.body] : []
    );
  }

  return response;
}

async function resolveMainClient(
  event: FetchEvent
): Promise<Client | undefined> {
  const client = await self.clients.get(event.clientId);

  if (client && activeClientIds.has(event.clientId)) {
    return client;
  }

  if (client?.frameType === 'top-level') {
    return client;
  }

  const allClients = await self.clients.matchAll({ type: 'window' });

  return allClients
    .filter((client) => client.visibilityState === 'visible')
    .find((client) => activeClientIds.has(client.id));
}

async function getResponse(
  event: FetchEvent,
  client: Client | undefined,
  requestId: string,
  requestInterceptedAt: number
): Promise<Response> {
  const requestClone = event.request.clone();

  function passthrough() {
    const headers = new Headers(requestClone.headers);
    const acceptHeader = headers.get('accept');

    if (acceptHeader) {
      const filtered = acceptHeader
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v !== 'msw/passthrough');

      if (filtered.length > 0) headers.set('accept', filtered.join(', '));
      else headers.delete('accept');
    }

    return fetch(requestClone, { headers });
  }

  if (!client) return passthrough();
  if (!activeClientIds.has(client.id)) return passthrough();

  const serializedRequest = await serializeRequest(event.request);

  const clientMessage = await sendToClient(
    client,
    {
      type: 'REQUEST',
      payload: {
        id: requestId,
        interceptedAt: requestInterceptedAt,
        ...serializedRequest
      }
    },
    [serializedRequest.body]
  );

  switch (clientMessage.type) {
    case 'MOCK_RESPONSE':
      return respondWithMock(clientMessage.data);

    case 'PASSTHROUGH':
      return passthrough();
  }

  return passthrough();
}

function sendToClient(
  client: Client,
  message: any,
  transferrables: Transferable[] = []
): Promise<any> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event) => {
      if (event.data?.error) {
        reject(event.data.error);
      }
      resolve(event.data);
    };

    client.postMessage(message, [
      channel.port2,
      ...transferrables.filter(Boolean)
    ]);
  });
}

function respondWithMock(response: any): Response {
  if (response.status === 0) {
    return Response.error();
  }

  const mocked = new Response(response.body, response);

  Reflect.defineProperty(mocked, IS_MOCKED_RESPONSE, {
    value: true,
    enumerable: true
  });

  return mocked;
}

async function serializeRequest(request: Request) {
  return {
    url: request.url,
    mode: request.mode,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    cache: request.cache,
    credentials: request.credentials,
    destination: request.destination,
    integrity: request.integrity,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    body: await request.arrayBuffer(),
    keepalive: request.keepalive
  };
}
