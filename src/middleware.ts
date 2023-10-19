export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/leaves', '/leaves/apply', '/logout'],
};
