import { SignIn } from '@clerk/nextjs';

export default function AdminSignInPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#faf8f5] px-4 py-16">
      <SignIn
        routing="path"
        path="/admin/giris"
        forceRedirectUrl="/admin"
        signUpUrl="/admin/giris"
      />
    </main>
  );
}
