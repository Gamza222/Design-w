/** The prerendered page is usable immediately; no artificial loading delay. */
export function completePreloader() {}

export function usePreloaderDone(): boolean {
  return true;
}
