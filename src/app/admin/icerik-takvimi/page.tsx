import { db, dbYok } from '@/db';
import { campaignMediaAssets, contentCampaigns, type CampaignChannel } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { asc, eq, isNotNull } from 'drizzle-orm';
import { CalendarDays, Clock3 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const channelLabels: Record<CampaignChannel, string> = {
  'instagram-reels': 'Instagram Reels',
  'instagram-carousel': 'Instagram Carousel',
  'instagram-story': 'Instagram Story',
  threads: 'Threads',
};

export default async function ContentCalendarPage() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const entries = dbYok ? [] : await db
    .select({ media: campaignMediaAssets, campaignName: contentCampaigns.name })
    .from(campaignMediaAssets)
    .innerJoin(contentCampaigns, eq(campaignMediaAssets.campaignId, contentCampaigns.id))
    .where(isNotNull(campaignMediaAssets.scheduledAt))
    .orderBy(asc(campaignMediaAssets.scheduledAt));
  const now = new Date();
  const upcoming = entries.filter(({ media }) => media.scheduledAt && media.scheduledAt >= now);
  const past = entries.filter(({ media }) => media.scheduledAt && media.scheduledAt < now).reverse();

  return (
    <main className="min-h-screen bg-[#f4efe7] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div><Link href="/admin" className="text-sm text-neutral-600">← Dashboard</Link><p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#947d4e]">Sosyal medya operasyonu</p><h1 className="mt-2 font-heading text-4xl sm:text-5xl">İçerik Takvimi</h1><p className="mt-3 max-w-2xl text-sm text-neutral-600">Instagram ve Threads taslaklarını tarih, saat ve kanal bazında tek sırada yönetin. Takvime eklemek paylaşım yapmaz.</p></div>
          <Link href="/admin/kampanyalar" className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white">Kampanya panosuna dön</Link>
        </header>
        <section className="mt-8 grid gap-3 sm:grid-cols-3"><Metric label="Planlanmış içerik" value={upcoming.length} /><Metric label="Yayına hazır" value={upcoming.filter(({ media }) => media.status === 'ready').length} positive /><Metric label="Geçmiş plan" value={past.length} /></section>
        <CalendarSection title="Yaklaşan yayınlar" entries={upcoming} empty="Henüz planlanmış bir içerik yok." />
        <CalendarSection title="Geçmiş planlar" entries={past.slice(0, 20)} empty="Geçmiş plan bulunmuyor." muted />
      </div>
    </main>
  );
}

type Entry = { media: typeof campaignMediaAssets.$inferSelect; campaignName: string };

function CalendarSection({ title, entries, empty, muted = false }: { title: string; entries: Entry[]; empty: string; muted?: boolean }) {
  return <section className="mt-8"><h2 className="font-heading text-3xl">{title}</h2><div className="mt-4 grid gap-4">{entries.map(({ media, campaignName }) => <article key={media.id} className={`overflow-hidden rounded-2xl border border-[#e1d6c5] bg-white ${muted ? 'opacity-70' : ''}`}><div className="grid sm:grid-cols-[120px_1fr_auto]"><video src={media.url} preload="metadata" muted playsInline className="aspect-square h-full w-full bg-black object-cover" /><div className="p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#947d4e]">{campaignName}</p><h3 className="mt-1 text-sm font-semibold">{media.filename}</h3><div className="mt-3 flex flex-wrap gap-1.5">{media.scheduledChannels.map((channel) => <span key={channel} className="rounded-full bg-[#f1ece3] px-2.5 py-1 text-[10px] text-neutral-600">{channelLabels[channel]}</span>)}</div><p className="mt-3 line-clamp-2 text-xs text-neutral-500">{media.instagramCaption || media.threadsPost || 'Metin taslağı bekleniyor.'}</p></div><div className="flex min-w-44 flex-col justify-center border-t border-[#eee7dc] p-4 sm:border-l sm:border-t-0"><span className="inline-flex items-center gap-2 text-sm font-semibold"><CalendarDays className="h-4 w-4" />{media.scheduledAt?.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</span><span className="mt-2 inline-flex items-center gap-2 text-xs text-neutral-500"><Clock3 className="h-4 w-4" />{media.scheduledAt?.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span><span className={`mt-3 w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${media.status === 'ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{media.status === 'ready' ? 'Yayına hazır' : 'Hazırlanıyor'}</span></div></div></article>)}{!entries.length && <p className="rounded-2xl border border-dashed border-[#d6cab8] bg-white/60 p-8 text-center text-sm text-neutral-500">{empty}</p>}</div></section>;
}

function Metric({ label, value, positive = false }: { label: string; value: number; positive?: boolean }) {
  return <div className={`rounded-2xl border p-5 ${positive ? 'border-emerald-200 bg-emerald-50' : 'border-[#e1d6c5] bg-white'}`}><p className="text-xs text-neutral-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>;
}
