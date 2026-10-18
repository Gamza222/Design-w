import { renderToReadableStream } from 'react-dom/server';
import { ServerRouter, type EntryContext } from 'react-router';

// Used only at build time to prerender static HTML (ssr:false). A *streaming*
// renderer is required: React Router serialises the route data into the render
// stream (the `__reactRouterContext.stream` scripts) so the client
// `HydratedRouter` has something to hydrate from. `renderToString` emits only
// the shell — the data is never written, so the client hangs forever waiting on
// the stream and the page never hydrates. Awaiting `allReady` flushes the whole
// document, including those data scripts, before we hand it back to the prerenderer.
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const stream = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        responseStatusCode = 500;
        console.error(error);
      },
    },
  );

  await stream.allReady;

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(stream, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
