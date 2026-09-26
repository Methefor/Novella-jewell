'use client';

import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DayPoint, Delta } from '@/lib/analytics-dashboard';

const EASE = [0.16, 1, 0.3, 1] as const;

export function GlassCard({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      whileHover={reduce ? undefined : { y: -5 }}
      className={`rounded-[22px] border border-white/80 bg-white/60 p-5 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_40px_-22px_rgba(90,70,30,0.35)] backdrop-blur-xl sm:p-6 ${className}`}
    >
      {children}
    </motion.article>
  );
}

export function CountUp({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    if (reduce) {
      node.textContent = value.toLocaleString('tr-TR');
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => { node.textContent = Math.round(v).toLocaleString('tr-TR'); },
    });
    return () => controls.stop();
  }, [inView, value, reduce]);
  return <span ref={ref} className={`tabular-nums ${className}`}>{value.toLocaleString('tr-TR')}</span>;
}

const DELTA_STYLE = {
  up: 'bg-[#e3f1e3] text-[#2f6b3a]',
  down: 'bg-[#f6e0da] text-[#9a3a26]',
  flat: 'bg-[#ece7dc] text-[#7b7466]',
  none: 'bg-[#ece7dc] text-[#7b7466]',
} as const;

export function DeltaBadge({ delta, note }: { delta?: Delta; note?: string }) {
  if (!delta && !note) return null;
  const direction = delta?.direction ?? 'none';
  const text = note
    ?? (delta?.pct == null
      ? direction === 'none' ? 'önceki dönem yok' : 'değişim yok'
      : `${delta.pct > 0 ? '▲' : delta.pct < 0 ? '▼' : ''} %${Math.abs(delta.pct).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} önceki döneme göre`);
  return <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${DELTA_STYLE[direction]}`}>{text}</span>;
}

export function StatCard({ label, value, icon, delta, note, dark = false, delay = 0 }: {
  label: string; value: number; icon: ReactNode; delta?: Delta; note?: string; dark?: boolean; delay?: number;
}) {
  return (
    <GlassCard delay={delay}>
      <div className={`grid h-10 w-10 place-items-center rounded-[13px] text-white ${dark ? 'bg-gradient-to-br from-[#3a3a30] to-[#171713]' : 'bg-gradient-to-br from-[#e7d3a4] to-[#c5a46d]'}`}>{icon}</div>
      <p className="mt-4 text-xs text-[#7b7466]">{label}</p>
      <p className="mt-0.5 text-4xl font-semibold tracking-tight"><CountUp value={value} /></p>
      <DeltaBadge delta={delta} note={note} />
    </GlassCard>
  );
}

const W = 700;
const H = 230;
const PAD = 18;

function curve(values: number[], x: (i: number) => number, y: (v: number) => number): string {
  if (!values.length) return '';
  let d = `M${x(0)},${y(values[0])}`;
  for (let i = 1; i < values.length; i += 1) {
    const cx = (x(i - 1) + x(i)) / 2;
    d += ` C${cx},${y(values[i - 1])} ${cx},${y(values[i])} ${x(i)},${y(values[i])}`;
  }
  return d;
}

export function TrendChart({ points }: { points: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const geometry = useMemo(() => {
    const max = Math.max(...points.map((p) => p.visitors), 3) + 1;
    const step = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : 0;
    const x = (i: number) => PAD + i * step;
    const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
    const visitors = points.map((p) => p.visitors);
    const line = curve(visitors, x, y);
    return { x, y, step, line, checkoutLine: curve(points.map((p) => p.checkouts), x, y), area: line ? `${line} L${x(points.length - 1)},${H - PAD} L${x(0)},${H - PAD}Z` : '' };
  }, [points]);
  const active = hover == null ? null : points[hover];

  return (
    <div className="relative mt-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-[230px] w-full overflow-visible"
        role="img"
        aria-label="Günlük ziyaretçi ve ödemeye geçen oturum grafiği"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const index = Math.round(((event.clientX - rect.left) / rect.width * W - PAD) / (geometry.step || 1));
          setHover(Math.max(0, Math.min(points.length - 1, index)));
        }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c5a46d" stopOpacity="0.35" />
            <stop offset="1" stopColor="#c5a46d" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((f) => <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - PAD * 2)} y2={PAD + f * (H - PAD * 2)} stroke="rgba(158,142,99,0.2)" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />)}
        <path d={geometry.area} fill="url(#trend-fill)" />
        <motion.path d={geometry.line} fill="none" stroke="#c5a46d" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE }} />
        <motion.path d={geometry.checkoutLine} fill="none" stroke="#171713" strokeWidth={2.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }} />
        {hover != null && <line x1={geometry.x(hover)} x2={geometry.x(hover)} y1={PAD} y2={H - PAD} stroke="rgba(23,23,19,0.18)" vectorEffect="non-scaling-stroke" />}
      </svg>
      {active && hover != null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-[#171713] px-3 py-2 text-xs text-white"
          style={{ left: `${(geometry.x(hover) / W) * 100}%`, top: `${(geometry.y(active.visitors) / H) * 100}%`, transform: 'translate(-50%, -125%)' }}
        >
          <b>{active.label}</b> · {active.visitors} ziyaretçi · {active.checkouts} ödemeye geçen
        </div>
      )}
    </div>
  );
}

export type FunnelStep = { label: string; value: number };

export function FunnelBars({ steps }: { steps: FunnelStep[] }) {
  const reduce = useReducedMotion();
  const max = Math.max(steps[0]?.value ?? 0, 1);
  return (
    <div className="mt-4 grid gap-3.5">
      {steps.map((step, index) => {
        const prev = steps[index - 1]?.value ?? 0;
        const rate = index && prev ? `%${((step.value / prev) * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}` : index ? '%0' : '';
        const leak = index === steps.length - 1 && step.value === 0;
        return (
          <div key={step.label}>
            <div className="flex justify-between text-[13px]"><span>{step.label}</span><b>{step.value.toLocaleString('tr-TR')}</b></div>
            <div className="mt-1.5 h-[30px] overflow-hidden rounded-[10px] bg-[#efe9dc]">
              <motion.div
                className={`flex h-full min-w-[34px] items-center rounded-[10px] px-2.5 text-[11.5px] font-semibold text-white ${leak ? 'bg-gradient-to-r from-[#b5533a] to-[#e0906f]' : 'bg-gradient-to-r from-[#9e8e63] to-[#d9c38f]'}`}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${Math.max((step.value / max) * 100, step.value ? 6 : 0)}%` }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.3 + index * 0.08 }}
              >
                {rate}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
