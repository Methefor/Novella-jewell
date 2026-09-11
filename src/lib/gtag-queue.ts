/** gtag.js consumes Arguments objects. A rest-parameter Array is not a command. */
export function createGtagQueue(dataLayer: unknown[]): (...args: unknown[]) => void {
  return function gtag() {
    // eslint-disable-next-line prefer-rest-params -- Google tag protocol requires Arguments, not Array.
    dataLayer.push(arguments);
  };
}
