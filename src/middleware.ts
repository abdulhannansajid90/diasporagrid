import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
const intlMiddleware = createMiddleware(routing);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function middleware(req: any) {
  return intlMiddleware(req);
}
 
export const config = {
  matcher: [
    '/',
    '/(ur|en|pa|ps|sd|ar)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
