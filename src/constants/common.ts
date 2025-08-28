const PRODUCTION_ENV = 'production';
const STAGING_ENV = 'staging';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const BASE_URL = ((env) => {
  switch (env) {
    case PRODUCTION_ENV:
      return 'https://api-ecommerce.rentalhubnepal.com';
    case STAGING_ENV:
      return 'http://139.59.91.129:3000';
    default:
      return API_URL || 'https://api-ecommerce.rentalhubnepal.com';
  }
})(import.meta.env.VITE_ENV);

export const AUTH_COOKIE_CONFIG = {
  userAccessToken: 'e-commerce-user-access-token',
  userRefreshToken: 'e-commerce-user-refresh-token',
  loggedInCookie: 'isLoggedIn',
};
