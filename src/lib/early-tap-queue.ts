import earlyTapSource from './early-tap-script.js?raw';

// A raw source string is stable across server/client transforms; Function.toString() is not.
export const earlyTapQueueScript = earlyTapSource;

/** Runs the exact inline script shipped in the page head (used by tests). */
export function installEarlyTapQueue() {
  new Function(earlyTapSource)();
}
