import { db, dbYok } from '@/db';
import { campaignMediaAssets, contentCampaigns } from '@/db/schema';
import { getAdminAuth } from '@/lib/admin-auth';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const payloadSchema = z.object({
  campaignId: z.string().uuid(),
  format: z.enum(['story', 'feed', 'square']),
  filename: z.string().trim().min(1).max(240),
  size: z.number().int().positive().max(60 * 1024 * 1024),
  createdBy: z.string().email(),
  actorId: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  if (dbYok) return NextResponse.json({ error: 'Veritabanı bağlantısı yok.' }, { status: 503 });
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const admin = await getAdminAuth();
        if (admin.state !== 'admin') throw new Error('Yetkisiz işlem.');
        if (!pathname.startsWith('campaigns/') || pathname.includes('..')) throw new Error('Geçersiz dosya yolu.');
        const client = z.object({ campaignId: z.string().uuid(), format: z.enum(['story', 'feed', 'square']), filename: z.string().max(240), size: z.number().int().positive().max(60 * 1024 * 1024) }).parse(JSON.parse(clientPayload ?? '{}'));
        const [campaign] = await db.select({ id: contentCampaigns.id }).from(contentCampaigns).where(eq(contentCampaigns.id, client.campaignId)).limit(1);
        if (!campaign) throw new Error('Kampanya bulunamadı.');
        return {
          allowedContentTypes: ['video/mp4'],
          maximumSizeInBytes: 60 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ ...client, createdBy: admin.email, actorId: admin.userId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = payloadSchema.parse(JSON.parse(tokenPayload ?? '{}'));
        await db.insert(campaignMediaAssets).values({
          campaignId: payload.campaignId,
          url: blob.url,
          pathname: blob.pathname,
          filename: payload.filename,
          format: payload.format,
          size: payload.size,
          createdBy: payload.createdBy,
        });
        await writeAdminAuditLog({
          actorId: payload.actorId,
          actorEmail: payload.createdBy,
          action: 'campaign.media_upload',
          entityType: 'campaign',
          entityId: payload.campaignId,
          summary: `${payload.filename} kampanya medyasına eklendi.`,
          metadata: { format: payload.format },
        });
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[admin/campaign-media/upload]', error);
    const message = error instanceof Error ? error.message : 'Video yüklenemedi.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
