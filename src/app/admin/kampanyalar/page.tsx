import { PRODUCTS } from '@/data/products';
import { db, dbYok } from '@/db';
import {
  campaignItems,
  campaignMediaAssets,
  catalogProducts,
  contentCampaigns,
  type CampaignChannel,
} from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import type { Product } from '@/types/product';
import { asc, desc, eq } from 'drizzle-orm';
import { CalendarDays, CheckCircle2, CircleDashed, Megaphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  addCampaignProduct,
  createCampaign,
  generateCampaignItemDraft,
  updateCampaignItem,
  updateCampaignStatus,
} from './actions';

export const dynamic = 'force-dynamic';

const channels: Array<{ value: CampaignChannel; label: string }> = [
  { value: 'instagram-reels', label: 'Instagram Reels' },
  { value: 'instagram-carousel', label: 'Instagram Carousel' },
  { value: 'instagram-story', label: 'Instagram Story' },
  { value: 'threads', label: 'Threads' },
];

const stages = [
  { value: 'planned', label: 'Planlandı' },
  { value: 'visual', label: 'Görsel hazırlanıyor' },
  { value: 'copy', label: 'Metin hazırlanıyor' },
  { value: 'review', label: 'Onay bekliyor' },
  { value: 'ready', label: 'Yayına hazır' },
  { value: 'published', label: 'Yayınlandı' },
] as const;

const campaignStatusLabels: Record<string, string> = {
  draft: 'Taslak',
  active: 'Aktif',
  completed: 'Tamamlandı',
};

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string }>;
}) {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') redirect('/admin/giris');
  const params = await searchParams;

  const [campaignRows, catalogRows] = dbYok
    ? [[], []]
    : await Promise.all([
        db.select().from(contentCampaigns).orderBy(desc(contentCampaigns.updatedAt)),
        db.select().from(catalogProducts),
      ]);
  const selectedCampaign =
    campaignRows.find((campaign) => campaign.id === params.campaign) ??
    campaignRows[0];
  const selectedItems =
    !dbYok && selectedCampaign
      ? await db
          .select()
          .from(campaignItems)
          .where(eq(campaignItems.campaignId, selectedCampaign.id))
          .orderBy(asc(campaignItems.createdAt))
      : [];
  const selectedMedia =
    !dbYok && selectedCampaign
      ? await db
          .select()
          .from(campaignMediaAssets)
          .where(eq(campaignMediaAssets.campaignId, selectedCampaign.id))
          .orderBy(desc(campaignMediaAssets.createdAt))
      : [];

  const catalogById = new Map(catalogRows.map((row) => [row.id, row]));
  const products: Product[] = [
    ...catalogRows.map((row) => ({
      ...row.data,
      createdAt: new Date(row.data.createdAt),
      updatedAt: new Date(row.data.updatedAt),
    })),
    ...PRODUCTS.filter((product) => !catalogById.has(product.id)),
  ];
  const productById = new Map(products.map((product) => [product.id, product]));
  const selectedProductIds = new Set(selectedItems.map((item) => item.productId));
  const availableProducts = products
    .filter((product) => !selectedProductIds.has(product.id))
    .sort((a, b) => {
      if (Boolean(a.isNew) !== Boolean(b.isNew)) return a.isNew ? -1 : 1;
      return a.name.localeCompare(b.name, 'tr');
    });
  const completedCount = selectedItems.filter((item) =>
    ['ready', 'published'].includes(item.stage)
  ).length;
  const progress = selectedItems.length
    ? Math.round((completedCount / selectedItems.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#f6f2eb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Link href="/admin" className="text-sm text-neutral-600">
              ← Dashboard
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#9e8e63]">
              Sosyal medya operasyonu
            </p>
            <h1 className="mt-2 font-heading text-4xl sm:text-5xl">
              Kampanya ve İçerik Panosu
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Ürünleri Instagram ve Threads içeriklerine atayın; görsel, metin,
              onay ve yayın aşamalarını tek yerde takip edin.
            </p>
          </div>
          <Link
            href="/admin/reklam-hazirlik"
            className="rounded-xl border border-[#d8cdbb] bg-white px-5 py-3 text-sm font-medium"
          >
            Reklam hazırlık merkezine dön
          </Link>
        </header>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1fr_1.7fr]">
          <div className="space-y-5">
            <details
              open={!campaignRows.length}
              className="rounded-2xl border border-[#e3d9c8] bg-white p-5"
            >
              <summary className="cursor-pointer font-semibold">
                Yeni kampanya oluştur
              </summary>
              <form action={createCampaign} className="mt-5 grid gap-4">
                <label className="grid gap-2 text-sm">
                  Kampanya adı
                  <input
                    required
                    name="name"
                    placeholder="Yeni Yüzükler Lansmanı"
                    className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  Hedef
                  <textarea
                    name="objective"
                    rows={3}
                    placeholder="Yeni yüzük koleksiyonuna erişim ve ürün sayfası trafiği"
                    className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  Başlangıç tarihi
                  <input
                    name="startsAt"
                    type="date"
                    className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                  />
                </label>
                <button className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white">
                  Kampanyayı oluştur
                </button>
              </form>
            </details>

            <section className="rounded-2xl border border-[#e3d9c8] bg-white p-4">
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Kampanyalar
              </p>
              <div className="mt-3 grid gap-2">
                {campaignRows.map((campaign) => {
                  const active = campaign.id === selectedCampaign?.id;
                  return (
                    <Link
                      key={campaign.id}
                      href={`/admin/kampanyalar?campaign=${campaign.id}`}
                      className={`rounded-xl border p-4 transition-colors ${
                        active
                          ? 'border-black bg-black text-white'
                          : 'border-[#e8e0d2] hover:border-[#b9a679]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-medium">{campaign.name}</span>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] ${
                            active
                              ? 'bg-white/15 text-white'
                              : 'bg-[#f4efe6] text-neutral-600'
                          }`}
                        >
                          {campaignStatusLabels[campaign.status] ?? campaign.status}
                        </span>
                      </div>
                      {campaign.startsAt && (
                        <span
                          className={`mt-2 flex items-center gap-1 text-xs ${
                            active ? 'text-white/60' : 'text-neutral-500'
                          }`}
                        >
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(campaign.startsAt).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                    </Link>
                  );
                })}
                {!campaignRows.length && (
                  <p className="rounded-xl bg-[#f8f5ef] p-5 text-sm text-neutral-500">
                    İlk kampanyanızı oluşturarak içerik planlamaya başlayın.
                  </p>
                )}
              </div>
            </section>
          </div>

          <div>
            {selectedCampaign ? (
              <div className="space-y-5">
                <section className="rounded-2xl border border-[#e3d9c8] bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9e8e63]">
                        Seçili kampanya
                      </p>
                      <h2 className="mt-2 font-heading text-3xl">
                        {selectedCampaign.name}
                      </h2>
                      {selectedCampaign.objective && (
                        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
                          {selectedCampaign.objective}
                        </p>
                      )}
                    </div>
                    <form action={updateCampaignStatus}>
                      <input
                        type="hidden"
                        name="campaignId"
                        value={selectedCampaign.id}
                      />
                      <label className="grid gap-1 text-xs text-neutral-500">
                        Kampanya durumu
                        <select
                          name="status"
                          defaultValue={selectedCampaign.status}
                          className="rounded-lg border border-[#d8cdbb] px-3 py-2 text-sm text-black"
                        >
                          <option value="draft">Taslak</option>
                          <option value="active">Aktif</option>
                          <option value="completed">Tamamlandı</option>
                        </select>
                      </label>
                      <button className="mt-2 w-full rounded-lg bg-black px-3 py-2 text-xs font-medium text-white">
                        Durumu kaydet
                      </button>
                    </form>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eee9e0]">
                      <div
                        className="h-full rounded-full bg-[#a99158]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">%{progress}</span>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    {completedCount}/{selectedItems.length} içerik yayına hazır
                    veya yayınlandı
                  </p>
                </section>

                <section className="rounded-2xl border border-[#e3d9c8] bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9e8e63]">Medya kütüphanesi</p>
                      <h2 className="mt-1 font-heading text-2xl">Kampanya videoları</h2>
                    </div>
                    <Link href="/admin/icerik-uret" className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white">Video üret ve aktar</Link>
                  </div>
                  {selectedMedia.length ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {selectedMedia.map((media) => (
                        <article key={media.id} className="overflow-hidden rounded-xl border border-[#e7ded1] bg-[#faf8f4]">
                          <video src={media.url} controls preload="metadata" playsInline className="aspect-[4/5] w-full bg-black object-contain" />
                          <div className="p-3">
                            <p className="truncate text-xs font-semibold" title={media.filename}>{media.filename}</p>
                            <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-neutral-500">
                              <span className="rounded-full bg-[#eee7db] px-2 py-1 uppercase">{media.format}</span>
                              <span>{(media.size / 1024 / 1024).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB · İncelemede</span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-xl bg-[#f8f5ef] p-5 text-sm text-neutral-500">Bu kampanyaya henüz video aktarılmadı.</p>
                  )}
                </section>

                <details className="rounded-2xl border border-[#e3d9c8] bg-white p-5">
                  <summary className="cursor-pointer font-semibold">
                    Kampanyaya ürün ekle
                  </summary>
                  <form action={addCampaignProduct} className="mt-5 grid gap-4">
                    <input
                      type="hidden"
                      name="campaignId"
                      value={selectedCampaign.id}
                    />
                    <label className="grid gap-2 text-sm">
                      Ürün
                      <select
                        required
                        name="productId"
                        className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                      >
                        <option value="">Ürün seçin</option>
                        {availableProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.isNew ? 'Yeni · ' : ''}
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <ChannelChecks />
                    <button className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white">
                      Ürünü kampanyaya ekle
                    </button>
                  </form>
                </details>

                <section className="grid gap-4">
                  {selectedItems.map((item) => {
                    const product = productById.get(item.productId);
                    if (!product) return null;
                    const images = product.images?.length
                      ? product.images
                      : product.variants.flatMap((variant) => variant.images);
                    const stage = stages.find(
                      (option) => option.value === item.stage
                    );
                    return (
                      <article
                        key={item.productId}
                        className="overflow-hidden rounded-2xl border border-[#e3d9c8] bg-white"
                      >
                        <div className="grid sm:grid-cols-[150px_1fr]">
                          <div className="relative aspect-square bg-[#eee9e0] sm:aspect-auto">
                            {images[0] && (
                              <Image
                                src={images[0]}
                                alt={`${product.name} ana görseli`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 150px"
                              />
                            )}
                          </div>
                          <div className="p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h3 className="font-heading text-2xl">
                                  {product.name}
                                </h3>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {item.channels.map((channel) => (
                                    <span
                                      key={channel}
                                      className="rounded-full bg-[#f2ede3] px-2.5 py-1 text-[10px] font-medium text-neutral-600"
                                    >
                                      {channels.find(
                                        (option) => option.value === channel
                                      )?.label ?? channel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                  ['ready', 'published'].includes(item.stage)
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {['ready', 'published'].includes(item.stage) ? (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : (
                                  <CircleDashed className="h-3.5 w-3.5" />
                                )}
                                {stage?.label ?? item.stage}
                              </span>
                            </div>

                            <form
                              action={updateCampaignItem}
                              className="mt-5 grid gap-4 border-t border-[#eee7db] pt-5"
                            >
                              <input
                                type="hidden"
                                name="campaignId"
                                value={selectedCampaign.id}
                              />
                              <input
                                type="hidden"
                                name="productId"
                                value={product.id}
                              />
                              <div className="grid gap-4 lg:grid-cols-2">
                                <label className="grid gap-2 text-sm">
                                  İçerik aşaması
                                  <select
                                    name="stage"
                                    defaultValue={item.stage}
                                    className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                                  >
                                    {stages.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="grid gap-2 text-sm">
                                  İçerik notu
                                  <input
                                    name="notes"
                                    defaultValue={item.notes}
                                    placeholder="Yakın plan ürün çekimi, sıcak ışık…"
                                    className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                                  />
                                </label>
                              </div>
                              <ChannelChecks selected={item.channels} compact />
                              <div className="grid gap-4 border-t border-[#eee7db] pt-5">
                                <div>
                                  <p className="text-sm font-semibold">
                                    Kanal bazlı içerik taslağı
                                  </p>
                                  <p className="mt-1 text-xs text-neutral-500">
                                    Instagram ve Threads metinleri ayrı tutulur;
                                    kaydetmek yayınlama işlemi yapmaz.
                                  </p>
                                </div>
                                <label className="grid gap-2 text-sm">
                                  Instagram açıklaması
                                  <textarea
                                    name="instagramCaption"
                                    rows={5}
                                    defaultValue={
                                      item.contentDraft.instagramCaption
                                    }
                                    className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                                  />
                                </label>
                                <label className="grid gap-2 text-sm">
                                  Threads metni
                                  <textarea
                                    name="threadsPost"
                                    rows={3}
                                    defaultValue={item.contentDraft.threadsPost}
                                    className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                                  />
                                </label>
                                <div className="grid gap-4 lg:grid-cols-2">
                                  <label className="grid gap-2 text-sm">
                                    CTA
                                    <input
                                      name="cta"
                                      defaultValue={item.contentDraft.cta}
                                      className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                                    />
                                  </label>
                                  <label className="grid gap-2 text-sm">
                                    Hashtag / SEO
                                    <input
                                      name="hashtags"
                                      defaultValue={item.contentDraft.hashtags}
                                      className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                                    />
                                  </label>
                                </div>
                                <label className="grid gap-2 text-sm">
                                  Görsel yönlendirmesi
                                  <textarea
                                    name="visualDirection"
                                    rows={3}
                                    defaultValue={
                                      item.contentDraft.visualDirection
                                    }
                                    className="rounded-xl border border-[#d8cdbb] px-4 py-3"
                                  />
                                </label>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white">
                                  İçeriği güncelle
                                </button>
                                <Link
                                  href={`/admin/urunler/${encodeURIComponent(product.id)}`}
                                  className="rounded-lg border border-[#d8cdbb] px-4 py-2.5 text-sm font-medium"
                                >
                                  Ürünü düzenle
                                </Link>
                              </div>
                            </form>
                            <form
                              action={generateCampaignItemDraft}
                              className="mt-3"
                            >
                              <input
                                type="hidden"
                                name="campaignId"
                                value={selectedCampaign.id}
                              />
                              <input
                                type="hidden"
                                name="productId"
                                value={product.id}
                              />
                              <button className="rounded-lg border border-[#b9a679] bg-[#faf7f1] px-4 py-2.5 text-sm font-medium text-[#6f5d36]">
                                Üründen taslak oluştur
                              </button>
                            </form>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                  {!selectedItems.length && (
                    <div className="rounded-2xl border border-dashed border-[#cfc2aa] bg-white p-10 text-center">
                      <Megaphone className="mx-auto h-9 w-9 text-[#9e8e63]" />
                      <h3 className="mt-4 font-heading text-2xl">
                        Kampanya henüz boş
                      </h3>
                      <p className="mt-2 text-sm text-neutral-500">
                        İlk ürünü ve yayınlanacağı kanalları seçerek başlayın.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#cfc2aa] bg-white p-12 text-center">
                <Megaphone className="mx-auto h-10 w-10 text-[#9e8e63]" />
                <h2 className="mt-4 font-heading text-3xl">
                  İlk kampanyanızı oluşturun
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Kampanya oluşturulduğunda ürün ve kanal planı burada görünecek.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ChannelChecks({
  selected = [],
  compact = false,
}: {
  selected?: CampaignChannel[];
  compact?: boolean;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Yayın kanalları</legend>
      <div
        className={`mt-2 grid gap-2 ${
          compact ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2'
        }`}
      >
        {channels.map((channel) => (
          <label
            key={channel.value}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#e1d8c8] bg-white px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              name="channels"
              value={channel.value}
              defaultChecked={selected.includes(channel.value)}
              className="rounded border-neutral-300 text-black"
            />
            {channel.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
