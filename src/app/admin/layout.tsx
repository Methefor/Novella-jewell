import AdminLayout from '@/components/AdminLayout';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated (except for login page)
  if (!session) {
    redirect('/admin/login');
  }

  return <AdminLayout>{children}</AdminLayout>;
}

