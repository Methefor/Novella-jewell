import { ClerkProvider } from '@clerk/nextjs';

// Clerk UI is only used by the admin area; public shopping does not require it.
// Server-side authorization remains in clerkMiddleware and getAdminAuth.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
