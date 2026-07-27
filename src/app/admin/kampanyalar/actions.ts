'use server';

import { db, dbYok } from '@/db';
import {
  campaignItems,
  contentCampaigns,
  type CampaignChannel,
} from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
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
    })
    .parse({
      campaignId: formData.get('campaignId'),
      productId: formData.get('productId'),
      stage: formData.get('stage'),
      notes: formData.get('notes'),
      channels: formData.getAll('channels'),
    });

  await db
    .update(campaignItems)
    .set({
      stage: input.stage,
      notes: input.notes,
      channels: input.channels as CampaignChannel[],
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
