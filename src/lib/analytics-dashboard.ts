import type { FunnelEvent } from './analytics-funnel';

export type DatedEvent = FunnelEvent & { occurredAt: Date };

export type DayPoint = { key: string; label: string; visitors: number; checkouts: number };

const DAY_MS = 86_400_000;
const TZ = 'Europe/Istanbul';

function dayKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

/** Son `days` günün her günü için benzersiz ziyaretçi ve ödemeye geçen oturum sayısı (boş günler 0). */
export function dailySeries(events: readonly DatedEvent[], days: number, now: Date = new Date()): DayPoint[] {
  const visitors = new Map<string, Set<string>>();
  const checkouts = new Map<string, Set<string>>();
  for (const event of events) {
    const key = dayKey(event.occurredAt);
    if (!visitors.has(key)) visitors.set(key, new Set());
    visitors.get(key)!.add(event.sessionId);
    if (event.eventName === 'begin_checkout') {
      if (!checkouts.has(key)) checkouts.set(key, new Set());
      checkouts.get(key)!.add(event.sessionId);
    }
  }
  const points: DayPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const key = dayKey(new Date(now.getTime() - i * DAY_MS));
    points.push({ key, label: key.slice(5).replace('-', '.'), visitors: visitors.get(key)?.size ?? 0, checkouts: checkouts.get(key)?.size ?? 0 });
  }
  return points;
}

const INSTAGRAM_HOSTS = ['ig', 'instagram', 'instagram.com', 'l.instagram.com', 'www.instagram.com'];
const FACEBOOK_HOSTS = ['facebook', 'facebook.com', 'l.facebook.com', 'lm.facebook.com', 'm.facebook.com', 'www.facebook.com', 'fb'];

export function sourceLabel(source: string): string {
  const s = source.toLowerCase();
  if (INSTAGRAM_HOSTS.includes(s)) return 'Instagram';
  if (FACEBOOK_HOSTS.includes(s)) return 'Facebook';
  if (s === 'direct') return 'Direkt';
  if (s.includes('google')) return 'Google';
  if (s.includes('chatgpt') || s.includes('openai')) return 'ChatGPT';
  return source;
}

export function sourceRows(events: readonly FunnelEvent[]): { label: string; sessions: number }[] {
  const map = new Map<string, Set<string>>();
  for (const event of events) {
    const label = sourceLabel(event.source);
    if (!map.has(label)) map.set(label, new Set());
    map.get(label)!.add(event.sessionId);
  }
  return [...map.entries()].map(([label, set]) => ({ label, sessions: set.size })).sort((a, b) => b.sessions - a.sessions);
}

export type Delta = { pct: number | null; direction: 'up' | 'down' | 'flat' | 'none' };

/** Önceki dönem 0 ise yüzde hesaplanamaz ('none'); aksi halde yüzde değişim. */
export function periodDelta(current: number, previous: number): Delta {
  if (previous === 0) return { pct: null, direction: current === 0 ? 'flat' : 'none' };
  const pct = ((current - previous) / previous) * 100;
  return { pct, direction: pct > 0.5 ? 'up' : pct < -0.5 ? 'down' : 'flat' };
}

export function averagePerDay(points: readonly DayPoint[]): number {
  if (!points.length) return 0;
  return points.reduce((sum, p) => sum + p.visitors, 0) / points.length;
}
