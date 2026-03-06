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
        // Remove old slides (re-query each time — querySelectorAll is static)
        let remaining = container.querySelectorAll('.nc-slide');
        while (remaining.length > 2) {
          container.removeChild(remaining[0]);
          remaining = container.querySelectorAll('.nc-slide');
        }
        isAnimatingRef.current = false;
      },
    });

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
        <div class="nc-slide-img nc-slide-img-2">
          <img src="${initial.img2}" alt="${initial.title}" style="top:50%" />
        </div>
      </div>
    `;

    // Auto-advance every 2 seconds
    timerRef.current = setInterval(() => {
      advanceSlide();
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advanceSlide]);

  return (
    <>
      <style>{`
        .nc-slider {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: transparent;
          border-radius: 1rem;
        }
        .nc-slide {
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
          background: transparent;
        }
        .nc-slide--dark,
        .nc-slide--light {
          background: transparent;
        }
        .nc-slide-img {
          position: absolute;
          width: 38%;
          height: 160%;
          overflow: hidden;
        }
        .nc-slide-img img {
          position: absolute;
          left: 0;
          width: 100%;
          height: 65%;
          object-fit: cover;
          transform: translateY(-50%);
          border-radius: 0.5rem;
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
      `}</style>
      <div className="nc-slider" ref={containerRef} />
    </>
  );
}
