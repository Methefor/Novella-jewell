import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, dbYok } from '@/db';
import { productMediaAssets } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { getCatalogProducts } from '@/lib/catalog';
import {
  CREATIVE_PRESET_IDS,
  getCreativePreset,
} from '@/lib/creative-studio';

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

const clientPayloadSchema = z.object({
  productId: z.string().trim().min(1).max(180),
  presetId: z.enum(CREATIVE_PRESET_IDS),
  filename: z.string().trim().min(1).max(240),
  size: z.number().int().positive().max(MAX_IMAGE_SIZE),
});

const tokenPayloadSchema = clientPayloadSchema.extend({
  createdBy: z.string().email(),
  actorId: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  if (dbYok) {
    return NextResponse.json(
      { error: 'Veritabanı bağlantısı yok.' },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const admin = await getAdminAuth();
        if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');

        const client = clientPayloadSchema.parse(
          JSON.parse(clientPayload ?? '{}')
        );
        const expectedPrefix = `products/${client.productId}/creative/`;
        if (!pathname.startsWith(expectedPrefix) || pathname.includes('..')) {
          throw new Error('Geçersiz dosya yolu.');
        }

        const product = (await getCatalogProducts()).find(
          (candidate) => candidate.id === client.productId
        );
        if (!product) throw new Error('Ürün bulunamadı.');

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: MAX_IMAGE_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            ...client,
            createdBy: admin.email,
            actorId: admin.userId,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = tokenPayloadSchema.parse(
          JSON.parse(tokenPayload ?? '{}')
        );
        const preset = getCreativePreset(payload.presetId);

        await db.insert(productMediaAssets).values({
          productId: payload.productId,
          url: blob.url,
          source: 'chatgpt',
          kind: preset.kind,
          status: 'review',
          notes: `${preset.label} · ${payload.filename}`,
          createdBy: payload.createdBy,
        });

        await writeAdminAuditLog({
          actorId: payload.actorId,
          actorEmail: payload.createdBy,
          action: 'product.media_upload',
          entityType: 'product',
          entityId: payload.productId,
          summary: `${payload.filename} AI ürün kütüphanesine eklendi.`,
          metadata: {
            preset: payload.presetId,
            size: payload.size,
          },
        });
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[admin/media-assets/upload]', error);
    const message =
      error instanceof Error ? error.message : 'Görsel yüklenemedi.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
