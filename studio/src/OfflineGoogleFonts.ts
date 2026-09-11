/**
 * Remotion renders run without outbound network access in this workspace.
 * Keep brand.ts as the single font-loading source, but redirect its exact
 * Google Fonts WOFF2 requests to the same locally cached font binaries.
 */
if (typeof FontFace !== 'undefined') {
  const NativeFontFace = FontFace;
  const localFontUrls = new Map<string, string>([
    [
      'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2',
      new URL('./fonts/cormorant-garamond-latin.woff2', import.meta.url).href,
    ],
    [
      'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYp3tKgS4.woff2',
      new URL('./fonts/cormorant-garamond-latin-ext.woff2', import.meta.url).href,
    ],
    [
      'https://fonts.gstatic.com/s/instrumentsans/v4/pxiTypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr0SZe1Q.woff2',
      new URL('./fonts/instrument-sans-latin.woff2', import.meta.url).href,
    ],
    [
      'https://fonts.gstatic.com/s/instrumentsans/v4/pxiTypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr0She1YmV.woff2',
      new URL('./fonts/instrument-sans-latin-ext.woff2', import.meta.url).href,
    ],
    [
      'https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2',
      new URL('./fonts/instrument-serif-latin.woff2', import.meta.url).href,
    ],
    [
      'https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zsTjmbI.woff2',
      new URL('./fonts/instrument-serif-latin-ext.woff2', import.meta.url).href,
    ],
  ]);

  class OfflineFontFace extends NativeFontFace {
    constructor(
      family: string,
      source: string | BufferSource,
      descriptors?: FontFaceDescriptors,
    ) {
      const rewritten = typeof source === 'string'
        ? [...localFontUrls.entries()].reduce(
            (value, [remoteUrl, localUrl]) => value.replace(remoteUrl, localUrl),
            source,
          )
        : source;
      super(family, rewritten, descriptors);
    }
  }

  globalThis.FontFace = OfflineFontFace as typeof FontFace;
}
