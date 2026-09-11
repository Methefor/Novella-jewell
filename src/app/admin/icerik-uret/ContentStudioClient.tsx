'use client';

import { upload } from '@vercel/blob/client';
import {
  Check,
  Clipboard,
  Download,
  ExternalLink,
  Film,
  LoaderCircle,
  Search,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  buildCreativePrompt,
  CREATIVE_PRESETS,
  type CreativePresetId,
} from '@/lib/creative-studio';

export type MotionProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  material: string;
  description: string;
  story: string;
  features: string[];
  images: string[];
};

type CampaignOption = { id: string; name: string };
type SelectedAsset = {
  key: string;
  productId: string;
  productName: string;
  image: string;
};
type OperationState = {
  status: 'idle' | 'working' | 'success' | 'error';
  message: string;
};

const formats = [
  {
    id: 'story',
    label: 'Story · 9:16',
    composition: 'Novella-YuzukLansmani-Story',
    output: 'story',
  },
  {
    id: 'feed',
    label: 'Akış · 4:5',
    composition: 'Novella-YuzukLansmani-Feed',
    output: 'feed',
  },
  {
    id: 'square',
    label: 'Kare · 1:1',
    composition: 'Novella-YuzukLansmani-Square',
    output: 'square',
  },
] as const;

const remotionPath = (src: string) =>
  src.startsWith('/') ? src.slice(1) : src;

const initialOperationState: OperationState = { status: 'idle', message: '' };

export default function ContentStudioClient({
  products,
  campaigns,
  siteUrl,
}: {
  products: MotionProduct[];
  campaigns: CampaignOption[];
  siteUrl: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SelectedAsset[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(
    formats.map((format) => format.id)
  );
  const [headline, setHeadline] = useState('Özgün parçalar.');
  const [subheadline, setSubheadline] = useState('Ulaşılabilir bir lüks.');
  const [cta, setCta] = useState('Yeni koleksiyonu keşfet');
  const [copied, setCopied] = useState(false);
  const [creativeCopied, setCreativeCopied] = useState(false);
  const [selectedPreset, setSelectedPreset] =
    useState<CreativePresetId>('product-hero');
  const [creativeFiles, setCreativeFiles] = useState<File[]>([]);
  const [renderState, setRenderState] =
    useState<OperationState>(initialOperationState);
  const [creativeUploadState, setCreativeUploadState] =
    useState<OperationState>(initialOperationState);
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id ?? '');
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] =
    useState<OperationState>(initialOperationState);

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    return normalized
      ? products.filter((product) =>
          `${product.name} ${product.category}`
            .toLocaleLowerCase('tr-TR')
            .includes(normalized)
        )
      : products;
  }, [products, query]);

  const props = useMemo(
    () => ({
      gorseller: selected.map((asset) => remotionPath(asset.image)),
      baslik: headline.trim(),
      altBaslik: subheadline.trim(),
      cta: cta.trim(),
    }),
    [selected, headline, subheadline, cta]
  );
  const videoReady =
    selected.length === 3 &&
    selectedFormats.length > 0 &&
    Boolean(headline.trim());
  const commands = formats
    .filter((format) => selectedFormats.includes(format.id))
    .map(
      (format) =>
        `npm run studio:render -- ${format.composition} out/novella-yuzuk-lansmani-${format.output}.mp4 --props=out/novella-yuzuk-lansmani-props.json`
    )
    .join('\n');

  const selectedProductIds = useMemo(
    () => Array.from(new Set(selected.map((asset) => asset.productId))),
    [selected]
  );
  const primaryProduct = products.find(
    (product) => product.id === selected[0]?.productId
  );
  const creativePrompt = useMemo(() => {
    if (!primaryProduct) return '';
    return buildCreativePrompt({
      product: primaryProduct,
      imageUrls: selected.map((asset) => asset.image),
      presetId: selectedPreset,
      formats: selectedFormats,
      headline,
      subheadline,
      cta,
      siteUrl,
    });
  }, [
    primaryProduct,
    selected,
    selectedPreset,
    selectedFormats,
    headline,
    subheadline,
    cta,
    siteUrl,
  ]);
  const selectedPresetDefinition = CREATIVE_PRESETS.find(
    (preset) => preset.id === selectedPreset
  )!;
  const singleProductSelected = selectedProductIds.length === 1;

  function toggleAsset(product: MotionProduct, image: string) {
    const key = `${product.id}:${image}`;
    if (selected.some((asset) => asset.key === key)) {
      setSelected((current) =>
        current.filter((asset) => asset.key !== key)
      );
      return;
    }
    if (selected.length >= 3) return;
    setSelected((current) => [
      ...current,
      {
        key,
        productId: product.id,
        productName: product.name,
        image,
      },
    ]);
  }

  function toggleFormat(id: string) {
    setSelectedFormats((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function downloadProps() {
    if (!videoReady) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(props, null, 2)], { type: 'application/json' })
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'novella-yuzuk-lansmani-props.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyCommands() {
    if (!videoReady) return;
    await navigator.clipboard.writeText(commands);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function copyCreativePrompt(openChatGpt = false) {
    if (!creativePrompt) return;
    if (openChatGpt) {
      window.open('https://chatgpt.com/', '_blank', 'noopener,noreferrer');
    }
    await navigator.clipboard.writeText(creativePrompt);
    setCreativeCopied(true);
    window.setTimeout(() => setCreativeCopied(false), 1800);
  }

  async function renderOnComputer() {
    if (!videoReady || renderState.status === 'working') return;
    setRenderState({
      status: 'working',
      message:
        'Videolar bilgisayarında hazırlanıyor. Bu işlem birkaç dakika sürebilir.',
    });
    try {
      const response = await fetch('http://127.0.0.1:4317/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ props, formats: selectedFormats }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        outputs?: string[];
      } | null;
      if (!response.ok) {
        throw new Error(result?.error || 'Render işlemi tamamlanamadı.');
      }
      setRenderState({
        status: 'success',
        message: `${result?.outputs?.length ?? selectedFormats.length} video studio/out klasörüne kaydedildi.`,
      });
    } catch (error) {
      const message =
        error instanceof TypeError
          ? 'Render Köprüsü kapalı. Proje klasöründe npm run studio:bridge komutunu çalıştırıp tekrar deneyin.'
          : error instanceof Error
            ? error.message
            : 'Render işlemi tamamlanamadı.';
      setRenderState({ status: 'error', message });
    }
  }

  async function uploadCreativeImages() {
    if (
      !singleProductSelected ||
      !primaryProduct ||
      creativeFiles.length === 0 ||
      creativeUploadState.status === 'working'
    ) {
      return;
    }
    setCreativeUploadState({
      status: 'working',
      message: `${creativeFiles.length} AI görseli ürün kütüphanesine ekleniyor.`,
    });

    try {
      for (const file of creativeFiles) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error(`${file.name} JPG, PNG veya WebP biçiminde değil.`);
        }
        if (file.size > 20 * 1024 * 1024) {
          throw new Error(`${file.name} 20 MB sınırını aşıyor.`);
        }
        const safeName = file.name
          .toLocaleLowerCase('tr-TR')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9.-]+/g, '-');
        await upload(
          `products/${primaryProduct.id}/creative/${selectedPreset}-${safeName}`,
          file,
          {
            access: 'public',
            handleUploadUrl: '/api/admin/media-assets/upload',
            clientPayload: JSON.stringify({
              productId: primaryProduct.id,
              presetId: selectedPreset,
              filename: file.name,
              size: file.size,
            }),
          }
        );
      }
      const uploadedCount = creativeFiles.length;
      setCreativeFiles([]);
      setCreativeUploadState({
        status: 'success',
        message: `${uploadedCount} görsel kaydedildi. Artık aynı ürün kartından tekrar seçilebilir.`,
      });
      router.refresh();
    } catch (error) {
      setCreativeUploadState({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Görseller yüklenemedi.',
      });
    }
  }

  async function uploadVideos() {
    if (
      !campaignId ||
      videoFiles.length === 0 ||
      uploadState.status === 'working'
    ) {
      return;
    }
    setUploadState({
      status: 'working',
      message: `${videoFiles.length} video medya kütüphanesine yükleniyor.`,
    });
    try {
      for (const file of videoFiles) {
        if (file.type !== 'video/mp4') {
          throw new Error(`${file.name} MP4 biçiminde değil.`);
        }
        if (file.size > 60 * 1024 * 1024) {
          throw new Error(`${file.name} 60 MB sınırını aşıyor.`);
        }
        const lower = file.name.toLocaleLowerCase('tr-TR');
        const format = lower.includes('story')
          ? 'story'
          : lower.includes('square')
            ? 'square'
            : 'feed';
        const safeName = lower
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9.-]+/g, '-');
        await upload(`campaigns/${campaignId}/${safeName}`, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/campaign-media/upload',
          clientPayload: JSON.stringify({
            campaignId,
            format,
            filename: file.name,
            size: file.size,
            productIds: selectedProductIds,
          }),
        });
      }
      setUploadState({
        status: 'success',
        message: `${videoFiles.length} video kampanya medya kütüphanesine eklendi. Yayınlanmadı.`,
      });
      setVideoFiles([]);
    } catch (error) {
      setUploadState({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Videolar yüklenemedi.',
      });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
      <section className="rounded-3xl border border-[#ded3c3] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#947d4e]">
              01 · Tek ürün kütüphanesi
            </p>
            <h2 className="mt-2 font-heading text-3xl">
              Görseli bir kez seç, her yerde kullan
            </h2>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              selected.length === 3
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-[#eee7db] text-neutral-700'
            }`}
          >
            {selected.length} / 3 seçildi
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((slot) => {
            const asset = selected[slot];
            return (
              <div
                key={slot}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eee9e1]"
              >
                {asset ? (
                  <>
                    <Image
                      src={asset.image}
                      alt={asset.productName}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSelected((current) =>
                          current.filter((item) => item.key !== asset.key)
                        )
                      }
                      aria-label={`${asset.productName} görselini kaldır`}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/65 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                      {asset.productName}
                    </span>
                  </>
                ) : (
                  <div className="grid h-full place-items-center text-center text-xs text-neutral-400">
                    Referans {slot + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <label className="mt-7 flex items-center gap-3 rounded-xl border border-[#ded3c3] bg-[#faf8f4] px-4 py-3">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ürün veya kategori ara"
            className="w-full border-0 bg-transparent p-0 text-sm outline-none ring-0 focus:ring-0"
          />
        </label>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-[#e7ded1] bg-[#fbfaf7]"
            >
              <div className="grid grid-cols-2 gap-px bg-[#e7ded1]">
                {product.images.slice(0, 4).map((image, imageIndex) => {
                  const key = `${product.id}:${image}`;
                  const isSelected = selected.some(
                    (asset) => asset.key === key
                  );
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleAsset(product, image)}
                      aria-pressed={isSelected}
                      disabled={!isSelected && selected.length >= 3}
                      className="group relative aspect-square overflow-hidden bg-[#eee9e1] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${imageIndex + 1}. görsel`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="180px"
                      />
                      {isSelected && (
                        <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-semibold">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  {product.price.toLocaleString('tr-TR')} ₺ ·{' '}
                  {product.images.length} görsel
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
        <section className="overflow-hidden rounded-3xl bg-[#171713] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c7ad70]">
            Canlı taslak
          </p>
          <div className="relative mx-auto mt-5 aspect-[9/16] max-h-[510px] overflow-hidden rounded-[2rem] bg-[#302d27]">
            <div className="absolute inset-0 grid grid-cols-3">
              {selected.map((asset) => (
                <div key={asset.key} className="relative">
                  <Image
                    src={asset.image}
                    alt=""
                    fill
                    className="object-cover opacity-75"
                    sizes="180px"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-heading text-3xl leading-none">
                {headline || 'Başlık'}
              </p>
              <p className="mt-2 text-sm text-white/75">
                {subheadline || 'Alt başlık'}
              </p>
              <span className="mt-5 inline-flex rounded-full border border-white/50 px-4 py-2 text-[10px] uppercase tracking-[0.16em]">
                {cta || 'CTA'}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#ded3c3] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#947d4e]">
            02 · Metin ve format
          </p>
          <div className="mt-4 space-y-3">
            <TextField label="Başlık" value={headline} onChange={setHeadline} />
            <TextField
              label="Alt başlık"
              value={subheadline}
              onChange={setSubheadline}
            />
            <TextField label="CTA" value={cta} onChange={setCta} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {formats.map((format) => {
              const active = selectedFormats.includes(format.id);
              return (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => toggleFormat(format.id)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold ${
                    active
                      ? 'bg-black text-white'
                      : 'bg-[#eee9e1] text-neutral-600'
                  }`}
                >
                  {format.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-[#d6c59f] bg-[#fffaf0] p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#90743e]" />
            <h2 className="font-heading text-2xl">AI Ürün Laboratuvarı</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-600">
            Ürün fotoğrafları siteden gelir. Brief; referans bağlantılarını,
            ürün kimliği kilidini ve video storyboard&apos;unu tek seferde
            ChatGPT&apos;ye taşır.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {CREATIVE_PRESETS.map((preset) => {
              const active = preset.id === selectedPreset;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? 'border-black bg-black text-white'
                      : 'border-[#ded3c3] bg-white text-neutral-700'
                  }`}
                >
                  <span className="block text-xs font-semibold">
                    {preset.label}
                  </span>
                  <span
                    className={`mt-1 block text-[10px] ${
                      active ? 'text-white/65' : 'text-neutral-500'
                    }`}
                  >
                    {preset.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {!creativePrompt && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              Başlamak için soldan en az bir ürün görseli seçin.
            </p>
          )}
          {selectedProductIds.length > 1 && (
            <p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs text-blue-800">
              Birden fazla ürün seçildi. Brief ilk ürünü ana ürün kabul eder;
              çıktıyı kütüphaneye kaydetmek için tek üründen görsel seçin.
            </p>
          )}

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              disabled={!creativePrompt}
              onClick={() => copyCreativePrompt(false)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-black px-4 text-xs font-semibold text-white disabled:opacity-35"
            >
              {creativeCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
              {creativeCopied
                ? 'AI brief kopyalandı'
                : `${selectedPresetDefinition.label} briefini kopyala`}
            </button>
            <button
              type="button"
              disabled={!creativePrompt}
              onClick={() => copyCreativePrompt(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#bba97e] bg-white px-4 text-xs font-semibold disabled:opacity-35"
            >
              <ExternalLink className="h-4 w-4" />
              Kopyala ve ChatGPT&apos;yi aç
            </button>
          </div>

          <details className="mt-4 rounded-xl border border-[#ded3c3] bg-white p-3">
            <summary className="cursor-pointer text-xs font-semibold text-neutral-700">
              Oluşan briefi önizle
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-[#f6f2eb] p-3 text-[10px] leading-relaxed text-neutral-600">
              {creativePrompt || 'Önce bir referans görsel seçin.'}
            </pre>
          </details>

          <div className="mt-5 border-t border-[#ded3c3] pt-5">
            <p className="text-xs font-semibold">AI çıktısını ürüne geri bağla</p>
            <p className="mt-1 text-[10px] leading-relaxed text-neutral-500">
              ChatGPT&apos;den indirdiğiniz JPG, PNG veya WebP dosyaları Vercel
              Blob&apos;a kaydedilir; mağazada otomatik yayınlanmaz.
            </p>
            <label className="mt-3 grid cursor-pointer place-items-center rounded-xl border border-dashed border-[#bcae96] bg-white px-4 py-4 text-center text-xs text-neutral-600">
              <span>
                {creativeFiles.length
                  ? `${creativeFiles.length} AI görseli seçildi`
                  : 'AI görsellerini seç'}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(event) =>
                  setCreativeFiles(Array.from(event.target.files ?? []))
                }
              />
            </label>
            {creativeUploadState.message && (
              <StatusMessage state={creativeUploadState} />
            )}
            <button
              type="button"
              onClick={uploadCreativeImages}
              disabled={
                !singleProductSelected ||
                creativeFiles.length === 0 ||
                creativeUploadState.status === 'working'
              }
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#90743e] px-4 text-xs font-semibold text-white disabled:opacity-35"
            >
              {creativeUploadState.status === 'working' ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {creativeUploadState.status === 'working'
                ? 'Kütüphaneye ekleniyor'
                : 'Ürün kütüphanesine kaydet'}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-[#ded3c3] bg-white p-6">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            <h2 className="font-heading text-2xl">Video üretimi</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            Bilgisayarında bir kez <strong>npm run studio:bridge</strong>{' '}
            komutunu çalıştır. Seçili formatların tamamı yerel Remotion ile
            oluşur. Bu işlem paylaşım yapmaz.
          </p>
          {!videoReady && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              Remotion için tam 3 görsel, en az 1 format ve bir başlık seçin.
            </p>
          )}
          {renderState.message && <StatusMessage state={renderState} />}
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              disabled={!videoReady || renderState.status === 'working'}
              onClick={renderOnComputer}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-semibold text-white disabled:opacity-35"
            >
              {renderState.status === 'working' ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Film className="h-4 w-4" />
              )}
              {renderState.status === 'working'
                ? 'Videolar hazırlanıyor'
                : 'Videoları bilgisayarımda oluştur'}
            </button>
            <details className="rounded-xl border border-[#e2d8c8] p-3">
              <summary className="cursor-pointer text-xs font-semibold text-neutral-600">
                Manuel üretim seçenekleri
              </summary>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  disabled={!videoReady}
                  onClick={downloadProps}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#eee9e1] px-4 text-xs font-semibold disabled:opacity-35"
                >
                  <Download className="h-4 w-4" />
                  JSON paketini indir
                </button>
                <button
                  type="button"
                  disabled={!videoReady}
                  onClick={copyCommands}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d6cab8] px-4 text-xs font-semibold disabled:opacity-35"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                  {copied ? 'Komutlar kopyalandı' : 'Render komutlarını kopyala'}
                </button>
              </div>
            </details>
          </div>
        </section>

        <section className="rounded-3xl border border-[#ded3c3] bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#947d4e]">
            03 · Kampanya medyası
          </p>
          <h2 className="mt-2 font-heading text-2xl">Videoları taslağa aktar</h2>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            <strong>studio/out</strong> klasöründeki MP4 dosyaları yalnızca
            inceleme kuyruğuna alınır.
          </p>
          <div className="mt-4 grid gap-3">
            <select
              value={campaignId}
              onChange={(event) => setCampaignId(event.target.value)}
              className="w-full rounded-xl border-[#d6cab8] bg-[#faf8f4] text-sm"
            >
              <option value="">Kampanya seçin</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
            <label className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-[#bcae96] bg-[#faf8f4] px-4 py-5 text-center text-xs text-neutral-600">
              <span>
                {videoFiles.length
                  ? `${videoFiles.length} MP4 seçildi`
                  : 'MP4 dosyalarını seç'}
              </span>
              <input
                type="file"
                accept="video/mp4"
                multiple
                className="sr-only"
                onChange={(event) =>
                  setVideoFiles(Array.from(event.target.files ?? []))
                }
              />
            </label>
            {uploadState.message && <StatusMessage state={uploadState} />}
            <button
              type="button"
              onClick={uploadVideos}
              disabled={
                !campaignId ||
                videoFiles.length === 0 ||
                uploadState.status === 'working'
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#9b8352] px-4 text-sm font-semibold text-white disabled:opacity-35"
            >
              {uploadState.status === 'working' ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4 rotate-180" />
              )}
              {uploadState.status === 'working'
                ? 'Medya yükleniyor'
                : 'Kampanya taslağına aktar'}
            </button>
            {!campaigns.length && (
              <p className="text-xs text-amber-700">
                Önce Kampanya Panosu&apos;nda bir kampanya oluşturun.
              </p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-600">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border-[#d6cab8] bg-[#faf8f4] text-sm focus:border-black focus:ring-black"
      />
    </label>
  );
}

function StatusMessage({ state }: { state: OperationState }) {
  return (
    <p
      className={`mt-3 rounded-xl p-3 text-xs ${
        state.status === 'success'
          ? 'bg-emerald-50 text-emerald-800'
          : state.status === 'error'
            ? 'bg-rose-50 text-rose-800'
            : 'bg-blue-50 text-blue-800'
      }`}
    >
      {state.message}
    </p>
  );
}
