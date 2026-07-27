import { db, dbYok } from '@/db';
import { adminAuditLogs } from '@/db/schema';

type AuditInput = {
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function writeAdminAuditLog(input: AuditInput) {
  if (dbYok) return;
  await db.insert(adminAuditLogs).values({
    actorId: input.actorId,
    actorEmail: input.actorEmail,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    summary: input.summary,
    metadata: input.metadata ?? {},
  });
}
