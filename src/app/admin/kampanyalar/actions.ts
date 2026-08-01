'use server';

import { db, dbYok } from '@/db';
import { PRODUCTS } from '@/data/products';
import {
  campaignItems,
  campaignMediaAssets,
  catalogProducts,
  contentCampaigns,
  type CampaignChannel,
  type CampaignContentDraft,
} from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import type { Product } from '@/types/product';
import { and, eq } from 'drizzle-orm';
import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const channelSchema = z.enum([
  'instagram-reels',
  'instagram-carousel',
  'instagram-story',
  'threads',
]);

const stageSchema = z.enum([
  'planned',
  'visual',
  'copy',
  'review',
  'ready',
  'published',
]);

const draftSchema = z.object({
  instagramCaption: z.string().trim().max(2200),
  threadsPost: z.string().trim().max(500),
  cta: z.string().trim().max(200),
  hashtags: z.string().trim().max(500),
  visualDirection: z.string().trim().max(1000),
});

async function requireAdmin() {
  const admin = await getAdminAuth();
  if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
  if (dbYok) throw new Error('Veritabanı bağlantısı yok.');
  return admin;
}

export async function createCampaign(formData: FormData) {
  const admin = await requireAdmin();
  const input = z
    .object({
      name: z.string().trim().min(3).max(100),
      objective: z.string().trim().max(500),
      startsAt: z.string().optional(),
    })
    .parse({
      name: formData.get('name'),
      objective: formData.get('objective'),
      startsAt: formData.get('startsAt') || undefined,
    });

  const [campaign] = await db
    .insert(contentCampaigns)
    .values({
      name: input.name,
      objective: input.objective,
      startsAt: input.startsAt ? new Date(input.startsAt) : null,
    })
    .returning({ id: contentCampaigns.id });

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'campaign.create',
    entityType: 'campaign',
    entityId: campaign.id,
    summary: `${input.name} kampanyası oluşturuldu.`,
  });

  redirect(`/admin/kampanyalar?campaign=${campaign.id}`);
}

export async function addCampaignProduct(formData: FormData) {
  const admin = await requireAdmin();
  const input = z
    .object({
      campaignId: z.string().uuid(),
      productId: z.string().min(1),
      channels: z.array(channelSchema).min(1),
    })
    .parse({
      campaignId: formData.get('campaignId'),
      productId: formData.get('productId'),
      channels: formData.getAll('channels'),
    });

  await db
    .insert(campaignItems)
    .values({
      campaignId: input.campaignId,
      productId: input.productId,
      channels: input.channels as CampaignChannel[],
    })
    .onConflictDoUpdate({
      target: [campaignItems.campaignId, campaignItems.productId],
      set: {
        channels: input.channels as CampaignChannel[],
        updatedAt: new Date(),
      },
    });

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'campaign.product_add',
    entityType: 'campaign',
    entityId: input.campaignId,
    summary: `${input.productId} kampanyaya eklendi.`,
  });

  revalidatePath('/admin/kampanyalar');
}

export async function updateCampaignItem(formData: FormData) {
  const admin = await requireAdmin();
  const input = z
    .object({
      campaignId: z.string().uuid(),
      productId: z.string().min(1),
      stage: stageSchema,
      notes: z.string().trim().max(1000),
      channels: z.array(channelSchema).min(1),
      contentDraft: draftSchema,
    })
    .parse({
      campaignId: formData.get('campaignId'),
      productId: formData.get('productId'),
      stage: formData.get('stage'),
      notes: formData.get('notes'),
      channels: formData.getAll('channels'),
      contentDraft: {
        instagramCaption: formData.get('instagramCaption'),
        threadsPost: formData.get('threadsPost'),
        cta: formData.get('cta'),
        hashtags: formData.get('hashtags'),
        visualDirection: formData.get('visualDirection'),
      },
    });

  await db
    .update(campaignItems)
    .set({
      stage: input.stage,
      notes: input.notes,
      channels: input.channels as CampaignChannel[],
      contentDraft: input.contentDraft,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(campaignItems.campaignId, input.campaignId),
        eq(campaignItems.productId, input.productId)
      )
    );

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'campaign.item_update',
    entityType: 'campaign',
    entityId: input.campaignId,
    summary: `${input.productId} içerik kaydı güncellendi.`,
    metadata: { stage: input.stage },
  });

  revalidatePath('/admin/kampanyalar');
}

export async function generateCampaignItemDraft(formData: FormData) {
  const admin = await requireAdmin();
  const input = z
    .object({
      campaignId: z.string().uuid(),
      productId: z.string().min(1),
    })
    .parse({
      campaignId: formData.get('campaignId'),
      productId: formData.get('productId'),
    });

  const [catalogProduct] = await db
    .select({ data: catalogProducts.data })
    .from(catalogProducts)
    .where(eq(catalogProducts.id, input.productId))
    .limit(1);
  const product: Product | undefined = catalogProduct?.data
    ? {
        ...catalogProduct.data,
        createdAt: new Date(catalogProduct.data.createdAt),
        updatedAt: new Date(catalogProduct.data.updatedAt),
      }
    : PRODUCTS.find((item) => item.id === input.productId);

  if (!product) throw new Error('Ürün bulunamadı.');

  await db
    .update(campaignItems)
    .set({
      contentDraft: buildContentDraft(product),
      stage: 'copy',
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(campaignItems.campaignId, input.campaignId),
        eq(campaignItems.productId, input.productId)
      )
    );

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'campaign.draft_generate',
    entityType: 'campaign',
    entityId: input.campaignId,
    summary: `${input.productId} için kanal taslakları oluşturuldu.`,
  });

  revalidatePath('/admin/kampanyalar');
}

function buildContentDraft(product: Product): CampaignContentDraft {
  const categoryLabels = {
    bilezik: 'bilezik',
    kupe: 'küpe',
    yuzuk: 'yüzük',
  } as const;
  const category = categoryLabels[product.category];
  const feature = product.features.find(Boolean);
  const detail = feature ? ` ${feature}.` : '';

  return {
    instagramCaption:
      `${product.name}, günün her anına eşlik eden modern bir ${category}.` +
      `${detail}\n\n` +
      `316L paslanmaz çelik yapısı suya dayanıklı ve kararmaya karşı dirençlidir. ` +
      `Sade görünümü tek başına da farklı parçalarla birlikte de kolayca tamamlanır.`,
    threadsPost:
      `Takı seçerken ilk baktığınız şey hangisi: zamansız görünüm mü, günlük kullanım rahatlığı mı? ` +
      `${product.name} ikisini bir araya getirmek için tasarlandı.`,
    cta: `${product.name} detaylarını novellajewell.com’da keşfedin.`,
    hashtags: `#NovellaJewell #ÇelikTakı #${categoryLabels[product.category]
      .replace('ü', 'u')
      .replace('ı', 'i')} #TakıStili #316LPaslanmazÇelik`,
    visualDirection:
      `Gerçek ürün formunu ve rengini değiştirmeden; açık taş veya sıcak nötr fonda ana ürün yakın planı. ` +
      `İkinci karede kullanım ölçeği, üçüncü karede yüzey ve işçilik detayı. Yumuşak doğal ışık, düşük kontrast ve metinsiz premium kompozisyon.`,
  };
}

export async function updateCampaignStatus(formData: FormData) {
  const admin = await requireAdmin();
  const input = z
    .object({
      campaignId: z.string().uuid(),
      status: z.enum(['draft', 'active', 'completed']),
    })
    .parse({
      campaignId: formData.get('campaignId'),
      status: formData.get('status'),
    });

  await db
    .update(contentCampaigns)
    .set({ status: input.status, updatedAt: new Date() })
    .where(eq(contentCampaigns.id, input.campaignId));

  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'campaign.status_update',
    entityType: 'campaign',
    entityId: input.campaignId,
    summary: `Kampanya durumu ${input.status} olarak güncellendi.`,
  });

  revalidatePath('/admin/kampanyalar');
}

const mediaStatusSchema = z.enum(['review', 'approved', 'rejected', 'ready']);

export async function updateCampaignMedia(formData: FormData) {
  const admin = await requireAdmin();
  const input = z.object({
    mediaId: z.string().uuid(),
    campaignId: z.string().uuid(),
    status: mediaStatusSchema,
    instagramCaption: z.string().trim().max(2200),
    threadsPost: z.string().trim().max(500),
    cta: z.string().trim().max(200),
    hashtags: z.string().trim().max(500),
    reviewNote: z.string().trim().max(600),
    scheduledAt: z.string().optional(),
    scheduledChannels: z.array(channelSchema).max(4),
  }).parse({
    mediaId: formData.get('mediaId'),
    campaignId: formData.get('campaignId'),
    status: formData.get('status'),
    instagramCaption: formData.get('instagramCaption'),
    threadsPost: formData.get('threadsPost'),
    cta: formData.get('cta'),
    hashtags: formData.get('hashtags'),
    reviewNote: formData.get('reviewNote'),
    scheduledAt: (formData.get('scheduledAt') as string) || undefined,
    scheduledChannels: formData.getAll('scheduledChannels'),
  });
  if (input.status === 'ready' && (!input.instagramCaption || !input.threadsPost)) {
    throw new Error('Yayına hazır için Instagram ve Threads metinleri zorunludur.');
  }
  if (input.scheduledAt && input.scheduledChannels.length === 0) {
    throw new Error('Yayın tarihi seçildiğinde en az bir kanal seçilmelidir.');
  }
  await db.update(campaignMediaAssets).set({
    status: input.status,
    instagramCaption: input.instagramCaption,
    threadsPost: input.threadsPost,
    cta: input.cta,
    hashtags: input.hashtags,
    reviewNote: input.reviewNote,
    scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
    scheduledChannels: input.scheduledChannels as CampaignChannel[],
  }).where(and(eq(campaignMediaAssets.id, input.mediaId), eq(campaignMediaAssets.campaignId, input.campaignId)));
  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'campaign.media_update',
    entityType: 'campaign-media',
    entityId: input.mediaId,
    summary: `Kampanya medyası ${input.status} durumuna alındı.`,
    metadata: { campaignId: input.campaignId, status: input.status },
  });
  revalidatePath('/admin/kampanyalar');
}

export async function generateCampaignMediaDraft(formData: FormData) {
  const admin = await requireAdmin();
  const input = z.object({ mediaId: z.string().uuid(), campaignId: z.string().uuid() }).parse({
    mediaId: formData.get('mediaId'),
    campaignId: formData.get('campaignId'),
  });
  const [media] = await db.select().from(campaignMediaAssets).where(and(eq(campaignMediaAssets.id, input.mediaId), eq(campaignMediaAssets.campaignId, input.campaignId))).limit(1);
  if (!media) throw new Error('Medya bulunamadı.');
  if (!media.productIds.length) throw new Error('Bu videoya bağlı ürün bulunmuyor. Videoyu İçerik Üret merkezinden yeniden aktarın.');
  const rows = await db.select({ id: catalogProducts.id, data: catalogProducts.data }).from(catalogProducts);
  const rowById = new Map(rows.map((row) => [row.id, row.data]));
  const products = media.productIds.map((id) => rowById.get(id) ?? PRODUCTS.find((product) => product.id === id)).filter((product): product is NonNullable<typeof product> => Boolean(product));
  if (!products.length) throw new Error('Bağlı ürünler katalogda bulunamadı.');
  const names = products.map((product) => product.name);
  const nameText = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} ve ${names.at(-1)}`;
  const features = Array.from(new Set(products.flatMap((product) => product.features).filter(Boolean))).slice(0, 2);
  const detail = features.length ? ` ${features.join(' · ')}.` : '';
  await db.update(campaignMediaAssets).set({
    instagramCaption: `${nameText}: günlük stile zarif ama kendine özgü bir dokunuş.${detail}\n\n316L paslanmaz çelik yapısı suya dayanıklı, kararmaya karşı dirençli ve gün boyu kullanıma uygundur. Novella’nın yeni yüzüklerini keşfedin.`,
    threadsPost: `Bir yüzüğü vazgeçilmez yapan sizce nedir: güçlü bir form mu, her stile uyum sağlaması mı? ${nameText}, ikisini aynı hikâyede buluşturuyor.`,
    cta: 'Yeni yüzükleri novellajewell.com’da keşfedin.',
    hashtags: '#NovellaJewell #ÇelikTakı #Yüzük #316LÇelik #TakıStili',
    status: media.status === 'rejected' ? 'review' : media.status,
  }).where(eq(campaignMediaAssets.id, media.id));
  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'campaign.media_copy_generate',
    entityType: 'campaign-media',
    entityId: media.id,
    summary: `${products.length} üründen Instagram ve Threads taslağı üretildi.`,
    metadata: { campaignId: input.campaignId, productCount: products.length },
  });
  revalidatePath('/admin/kampanyalar');
}

export async function deleteCampaignMedia(formData: FormData) {
  const admin = await requireAdmin();
  const input = z.object({
    mediaId: z.string().uuid(),
    campaignId: z.string().uuid(),
    confirmation: z.literal('SİL'),
  }).parse({
    mediaId: formData.get('mediaId'),
    campaignId: formData.get('campaignId'),
    confirmation: formData.get('confirmation'),
  });
  const [media] = await db.select().from(campaignMediaAssets).where(and(eq(campaignMediaAssets.id, input.mediaId), eq(campaignMediaAssets.campaignId, input.campaignId))).limit(1);
  if (!media) throw new Error('Medya bulunamadı.');
  await del(media.url);
  await db.delete(campaignMediaAssets).where(eq(campaignMediaAssets.id, media.id));
  await writeAdminAuditLog({
    actorId: admin.userId,
    actorEmail: admin.email,
    action: 'campaign.media_delete',
    entityType: 'campaign-media',
    entityId: media.id,
    summary: `${media.filename} kalıcı olarak silindi.`,
    metadata: { campaignId: input.campaignId },
  });
  revalidatePath('/admin/kampanyalar');
}
