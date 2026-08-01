import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware((_auth, request) => {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = (forwardedHost ?? request.headers.get('host') ?? '')
    .split(':')[0]
    .toLowerCase();

  if (host === 'www.novellajewell.com') {
    const destination = request.nextUrl.clone();
    destination.protocol = 'https:';
    destination.hostname = 'novellajewell.com';
    destination.port = '';
    return NextResponse.redirect(destination, 308);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
};
