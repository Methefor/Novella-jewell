import { auth, currentUser } from '@clerk/nextjs/server';

export const ADMIN_EMAIL = 'novella.jewellery.tr@gmail.com';

export async function getAdminAuth() {
  const { userId } = await auth();
  if (!userId) return { state: 'signed-out' as const };

  const user = await currentUser();
  const allowed = user?.emailAddresses.some(
    ({ emailAddress, verification }) =>
      emailAddress.toLowerCase() === ADMIN_EMAIL &&
      verification?.status === 'verified'
  );

  return allowed
    ? { state: 'admin' as const, userId, email: ADMIN_EMAIL }
    : { state: 'forbidden' as const };
}
