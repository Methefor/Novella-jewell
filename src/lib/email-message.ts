/** Immutable wire payload, retained so retries use the exact same idempotency key and content. */
export interface EmailMessage {
  from: string;
  reply_to?: string;
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: string }[];
}
