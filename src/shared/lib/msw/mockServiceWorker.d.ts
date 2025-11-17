/* mockServiceWorker.d.ts */
/* Типы для mockServiceWorker.ts */

declare const PACKAGE_VERSION: string;
declare const INTEGRITY_CHECKSUM: string;

declare const IS_MOCKED_RESPONSE: unique symbol;

declare const activeClientIds: Set<string>;

declare function handleRequest(
  event: FetchEvent,
  requestId: string,
  requestInterceptedAt: number
): Promise<Response>;

declare function resolveMainClient(
  event: FetchEvent
): Promise<Client | undefined>;

declare function getResponse(
  event: FetchEvent,
  client: Client | undefined,
  requestId: string,
  requestInterceptedAt: number
): Promise<Response>;

declare function sendToClient(
  client: Client,
<<<<<<< HEAD
  message: string,
=======
  message: any,
>>>>>>> 4d48279 (fix: add PO's wishes 🔧)
  transferrables?: Transferable[]
): Promise<any>;

declare function respondWithMock(response: any): Response;

declare function serializeRequest(request: Request): Promise<{
  url: string;
  mode: RequestMode;
  method: string;
  headers: Record<string, string>;
  cache: RequestCache;
  credentials: RequestCredentials;
  destination: RequestDestination;
  integrity: string;
  redirect: RequestRedirect;
  referrer: string;
  referrerPolicy: ReferrerPolicy;
  body: ArrayBuffer;
  keepalive: boolean;
}>;

interface ExtendableMessageEvent extends ExtendableEvent {
  data?: any;
  source?: Client | ServiceWorker | MessagePort | null;
}

declare const self: ServiceWorkerGlobalScope;
