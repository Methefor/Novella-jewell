import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F]">
      <LoadingSpinner size="lg" />
    </div>
  );
}

