'use server';

import { db, dbYok } from '@/db';
import { PRODUCTS } from '@/data/products';
import {
  campaignItems,
  catalogProducts,
  contentCampaigns,
  type CampaignChannel,
  type CampaignContentDraft,
} from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import type { Product } from '@/types/product';
import { and, eq } from 'drizzle-orm';
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
}

export async function createCampaign(formData: FormData) {
  await requireAdmin();
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

  redirect(`/admin/kampanyalar?campaign=${campaign.id}`);
}

export async function addCampaignProduct(formData: FormData) {
  await requireAdmin();
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

  revalidatePath('/admin/kampanyalar');
}

export async function updateCampaignItem(formData: FormData) {
  await requireAdmin();
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

  revalidatePath('/admin/kampanyalar');
}

export async function generateCampaignItemDraft(formData: FormData) {
  await requireAdmin();
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
  await requireAdmin();
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

  revalidatePath('/admin/kampanyalar');
}
