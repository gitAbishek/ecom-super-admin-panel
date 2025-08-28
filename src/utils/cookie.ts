import Cookies from 'js-cookie';

export const setCookie = (
  params: {
    cookieName: string;
    value: string;
    expiresIn: number;
  }
) => {
  const { cookieName, value, expiresIn } = params;
  Cookies.set(cookieName, value, { expires: expiresIn });
};

export const removeCookie = (cookieName: string) => Cookies.remove(cookieName);

export const getCookie = (cookieName: string) => Cookies.get(cookieName);
