'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const clips = [
  { id: 'kutu', title: 'İlk bakış', description: 'Krem renkli Novella kutusu ve üzerindeki marka detayı.', src: '/media/paketleme/novella-kutu.mp4', poster: '/media/paketleme/novella-kutu.webp' },
  { id: 'icerik', title: 'İçindeki özen', description: 'Açık kutuda örnek takı ve Novella kartviziti.', src: '/media/paketleme/novella-kutu-icerigi.mp4', poster: '/media/paketleme/novella-kutu-icerigi.webp' },
] as const;

export default function PackagingShowcase() {
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [failedClip, setFailedClip] = useState<string | null>(null);

  return (
    <section id="novella-kutusu" aria-labelledby="packaging-title" className="scroll-mt-24 flex min-h-[calc(100svh-var(--navbar-h))] items-center bg-[#f4efe6] py-12 md:py-20">
      <div className="container-custom grid items-center gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="max-w-md">
          <p className="section-label mb-4">Novella kutusu</p>
          <h1 id="packaging-title" className="font-serif text-4xl font-light leading-[1.1] tracking-[-0.03em] md:text-5xl">
            Küçük bir kutu.<br /><span className="italic text-[#75603b]">Özenli bir başlangıç.</span>
          </h1>
          <p className="mt-6 text-sm leading-7 text-black/65">
            Seçtiğiniz parça, Novella kartvizitiyle birlikte özel kutusunda hazırlanır.
            Kutunun dışını ve içindeki sunumu yakından keşfedin.
          </p>
          <div className="mt-7 border-y border-gold/25 py-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#75603b]">Kutu içeriği</p>
            <p className="mt-2 text-sm text-black/80">Seçtiğiniz ürün + Novella kartviziti</p>
          </div>
          <p className="mt-4 text-xs leading-5 text-black/55">Videolardaki takı örnek sunumdur; kutunuzda sipariş ettiğiniz ürün bulunur.</p>
        </div>
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-5">
          {clips.map((clip, index) => (
            <figure key={clip.id} className={index === 1 ? 'mt-10' : ''}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#e6dfd2] shadow-[0_12px_36px_rgba(66,52,31,0.08)]">
                {activeClip === clip.id ? (
                  <video
                    src={clip.src}
                    poster={clip.poster}
                    controls
                    autoPlay
                    muted
                    playsInline
                    preload="none"
                    width={720}
                    height={900}
                    aria-label={`${clip.title} — Novella kutu videosu`}
                    aria-describedby={`packaging-${clip.id}`}
                    className="h-full w-full object-cover"
                    onError={() => { setFailedClip(clip.id); setActiveClip(null); }}
                  >
                    Videoyu görüntüleyemiyorsanız <a href={clip.src}>kutu videosunu açın</a>.
                  </video>
                ) : (
                  <button
                    type="button"
                    aria-label={`${clip.title}: kutu videosunu oynat`}
                    onClick={() => { setFailedClip(null); setActiveClip(clip.id); }}
                    className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-dark"
                  >
                    <Image
                      src={clip.poster}
                      alt={clip.description}
                      fill
                      loading="eager"
                      fetchPriority={index === 0 ? 'high' : undefined}
                      sizes="(max-width: 639px) 45vw, (max-width: 1023px) 40vw, 25vw"
                      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
                    />
                    <span className="absolute bottom-4 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-black shadow-sm backdrop-blur-sm transition-colors group-hover:bg-white">
                      <Play className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true" />
                    </span>
                  </button>
                )}
              </div>
              <figcaption id={`packaging-${clip.id}`} className="mt-4">
                <p className="font-serif text-xl font-light">{clip.title}</p>
                <p className="mt-1 text-[11px] text-black/55">8 saniyelik sessiz video</p>
                <span className="sr-only">{clip.description}</span>
                {failedClip === clip.id && <p role="status" className="mt-2 text-xs text-black/65">Video yüklenemedi. <a href={clip.src} className="underline">Videoyu açın</a>.</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
