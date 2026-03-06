'use client';

import { useEffect, useRef, useCallback } from 'react';

const slides = [
  {
    title: 'Bilezik',
    img1: '/products/bileklik/bileklik-1.jpg',
    img2: '/products/bileklik/bileklik-6.jpg',
    dark: true,
  },
  {
    title: 'Küpe',
    img1: '/products/kupe/kupe-2.jpg',
    img2: '/products/kupe/kupe-5.jpg',
    dark: false,
  },
  {
    title: 'Yüzük',
    img1: '/products/yuzuk/yuzuk-3.jpg',
    img2: '/products/yuzuk/yuzuk-7.jpg',
    dark: true,
  },
  {
    title: 'Bilezik',
    img1: '/products/bileklik/bileklik-10.jpg',
    img2: '/products/bileklik/bileklik-15.jpg',
    dark: false,
  },
  {
    title: 'Küpe',
    img1: '/products/kupe/kupe-6.jpg',
    img2: '/products/kupe/kupe-9.jpg',
    dark: true,
  },
  {
    title: 'Yüzük',
    img1: '/products/yuzuk/yuzuk-10.jpg',
    img2: '/products/yuzuk/yuzuk-14.jpg',
    dark: false,
  },
];

export default function GsapCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSlideRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advanceSlide = useCallback(async () => {
    if (isAnimatingRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const { gsap } = await import('gsap');

    isAnimatingRef.current = true;
    const currentSlide = container.querySelector<HTMLElement>('.nc-slide:not(.nc-exiting)');
    const nextIndex = (activeSlideRef.current + 1) % slides.length;
    const slideTheme = slides[nextIndex].dark ? 'dark' : 'light';
    activeSlideRef.current = nextIndex;
    const slideData = slides[nextIndex];

    if (currentSlide) {
      const existingImgs = currentSlide.querySelectorAll('img');
      gsap.to(existingImgs, { top: '0%', duration: 1.5, ease: 'power4.inOut' });
      currentSlide.classList.add('nc-exiting');
    }

    const newSlide = document.createElement('div');
    newSlide.className = `nc-slide nc-slide--${slideTheme}`;
    newSlide.style.clipPath = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';

    // Img 1 (left diagonal)
    const imgWrap1 = document.createElement('div');
    imgWrap1.className = 'nc-slide-img nc-slide-img-1';
    const img1 = document.createElement('img');
    img1.src = slideData.img1;
    img1.alt = slideData.title;
    img1.style.top = '100%';
    imgWrap1.appendChild(img1);
    newSlide.appendChild(imgWrap1);

    // Title
    const content = document.createElement('div');
    content.className = 'nc-slide-content';
    content.innerHTML = `<h2 style="transform:scale(1.5)">${slideData.title}</h2>`;
    newSlide.appendChild(content);

    // Img 2 (right diagonal)
    const imgWrap2 = document.createElement('div');
    imgWrap2.className = 'nc-slide-img nc-slide-img-2';
    const img2 = document.createElement('img');
    img2.src = slideData.img2;
    img2.alt = slideData.title;
    img2.style.top = '100%';
    imgWrap2.appendChild(img2);
    newSlide.appendChild(imgWrap2);

    container.appendChild(newSlide);

    gsap.to(newSlide, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1.5,
      ease: 'power4.inOut',
      onStart: () => {
        gsap.to([img1, img2], { top: '50%', duration: 1.5, ease: 'power4.inOut' });
      },
      onComplete: () => {
        // Remove old slides
        const all = container.querySelectorAll('.nc-slide');
        while (all.length > 3) {
          container.removeChild(container.firstChild as Node);
        }
        isAnimatingRef.current = false;
      },
    });

    gsap.to('.nc-slide-content h2', { scale: 1, duration: 1.5, ease: 'power4.inOut' });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Build initial slide
    const initial = slides[0];
    container.innerHTML = `
      <div class="nc-slide nc-slide--${initial.dark ? 'dark' : 'light'}">
        <div class="nc-slide-img nc-slide-img-1">
          <img src="${initial.img1}" alt="${initial.title}" style="top:50%" />
        </div>
        <div class="nc-slide-content">
          <h2>${initial.title}</h2>
        </div>
        <div class="nc-slide-img nc-slide-img-2">
          <img src="${initial.img2}" alt="${initial.title}" style="top:50%" />
        </div>
      </div>
    `;

    // Auto-advance every 4 seconds
    timerRef.current = setInterval(() => {
      advanceSlide();
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advanceSlide]);

  const handleClick = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    advanceSlide();
    timerRef.current = setInterval(() => advanceSlide(), 4000);
  };

  return (
    <>
      <style>{`
        .nc-slider {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          cursor: pointer;
          background: #000;
          border-radius: 1rem;
        }
        .nc-slide {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          background: #1a1a1a;
        }
        .nc-slide--dark {
          background: #000;
        }
        .nc-slide--light {
          background: #1a1a1a;
        }
        .nc-slide-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          pointer-events: none;
        }
        .nc-slide-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 6rem);
          text-transform: uppercase;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: rgba(201, 168, 106, 0.85);
          white-space: nowrap;
        }
        .nc-slide--light .nc-slide-content h2 {
          color: rgba(201, 168, 106, 0.9);
        }
        .nc-slide-img {
          position: absolute;
          width: 38%;
          height: 160%;
          filter: saturate(0.3) brightness(0.75);
          overflow: hidden;
        }
        .nc-slide-img img {
          position: absolute;
          left: 0;
          width: 100%;
          height: 65%;
          object-fit: cover;
          transform: translateY(-50%);
        }
        .nc-slide-img-1 {
          top: 50%;
          left: 50%;
          transform: translate(-70%, -50%) rotate(-20deg);
        }
        .nc-slide-img-2 {
          top: 50%;
          left: 50%;
          transform: translate(-30%, -50%) rotate(20deg);
        }
        .nc-hint {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          z-index: 20;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: rgba(201,168,106,0.4);
          text-transform: uppercase;
          pointer-events: none;
        }
      `}</style>
      <div
        className="nc-slider"
        ref={containerRef}
        onClick={handleClick}
        title="Koleksiyonlar arasında geçiş yapmak için tıklayın"
      />
      <p className="nc-hint" style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 20, fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(201,168,106,0.4)', textTransform: 'uppercase', pointerEvents: 'none' }}>
        tıkla / geçiş yap
      </p>
    </>
  );
}
