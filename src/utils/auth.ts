import { AUTH_COOKIE_CONFIG } from '@/constants/common';
import { setCookie } from '@/utils/cookie';

export function signOut() {
  // Remove auth cookies
  setCookie({
    cookieName: AUTH_COOKIE_CONFIG.userAccessToken,
    value: '',
    expiresIn: -1,
  });
  setCookie({
    cookieName: AUTH_COOKIE_CONFIG.loggedInCookie,
    value: '',
    expiresIn: -1,
  });
  // Optionally clear other user/session cookies here
  // Redirect to login
  window.location.href = '/login';
}
