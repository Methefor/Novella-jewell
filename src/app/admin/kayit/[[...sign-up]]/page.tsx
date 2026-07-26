import { SignUp } from '@clerk/nextjs';

export default function AdminSignUpPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#faf8f5] px-4 py-16">
      <SignUp
        routing="path"
        path="/admin/kayit"
        forceRedirectUrl="/admin"
        signInUrl="/admin/giris"
      />
    </main>
  );
}
