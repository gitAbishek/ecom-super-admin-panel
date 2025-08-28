import axios from "axios";
import { getCookie } from "@/utils/cookie";
import { parseApiError } from "@/helper/error";
import { AUTH_COOKIE_CONFIG, BASE_URL } from "@/constants/common";

const getToken = () => getCookie(AUTH_COOKIE_CONFIG.userAccessToken);
const getTenantId = () => {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) return null;
  
  // Remove quotes if the value is stored with quotes
  try {
    // Try to parse as JSON first (in case it's stored as a JSON string)
    return JSON.parse(tenantId);
  } catch {
    // If parsing fails, just remove surrounding quotes if they exist
    return tenantId.replace(/^"(.*)"$/, '$1');
  }
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // This ensures cookies are not sent with requests
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie(AUTH_COOKIE_CONFIG.userAccessToken);
    const tenantId = getTenantId();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId && config.headers) {
      config.headers["x-tenant-id"] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = parseApiError(error);
    return Promise.reject(new Error(errorMessage));
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

interface ApiRequestParams {
  url: string;
  params?: Record<string, unknown>;
  body?: unknown;
  contentType?: string;
}

const get = async ({ url, params }: ApiRequestParams) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
    "x-tenant-id": getTenantId() || "",
  };

  const requestParams = {
    ...params,
  };

  const fullUrl = `${BASE_URL}/${url}`;

  return axios
    .get(fullUrl, {
      headers,
      params: requestParams,
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      const errorMessage = parseApiError(error);
      throw Error(errorMessage);
    });
};

const getWithoutTenantId = async ({ url, params }: ApiRequestParams) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
    // "x-tenant-id": getTenantId() || "",
  };

  const requestParams = {
    ...params,
  };

  const fullUrl = `${BASE_URL}/${url}`;

  return axios
    .get(fullUrl, {
      headers,
      params: requestParams,
      withCredentials: false,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      const errorMessage = parseApiError(error);
      throw Error(errorMessage);
    });
};

const post = async ({
  url,
  body,
  contentType = "application/json",
}: ApiRequestParams) => {
  const fullUrl = `${BASE_URL}/${url}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    // Authorization: `Bearer ${getToken()}`,
    "x-tenant-id": getTenantId() || "",
  };

  return axios
    .post(fullUrl, body, { headers, withCredentials: false })
    .then((response) => response.data)
    .catch((error) => {
      throw Error(parseApiError(error));
    });
};

const postWithToken = async ({
  url,
  body,
  contentType = "application/json",
}: ApiRequestParams) => {
  const fullUrl = `${BASE_URL}/${url}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
    "x-tenant-id": getTenantId() || "",
  };

  // For FormData, don't set Content-Type header - let browser set it automatically with boundary
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  return axios
    .post(fullUrl, body, { headers, withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      throw Error(parseApiError(error));
    });
};

const deleteApi = async ({ url }: ApiRequestParams) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
    "x-tenant-id": getTenantId() || "",
  };

  const fullUrl = `${BASE_URL}/${url}`;

  return axios
    .delete(fullUrl, { headers, withCredentials: true })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw Error(parseApiError(error));
    });
};

const put = async ({
  url,
  body,
  contentType = "application/json",
}: ApiRequestParams) => {
  const fullUrl = `${BASE_URL}/${url}`;
  
  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
    "x-tenant-id": getTenantId() || "",
  };

  // For FormData, don't set Content-Type header - let browser set it automatically with boundary
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  return axios
    .put(fullUrl, body, { headers, withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      throw Error(parseApiError(error));
    });
};

const patch = async ({
  url,
  body,
  contentType = "application/json",
}: ApiRequestParams) => {
  const fullUrl = `${BASE_URL}/${url}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    Authorization: `Bearer ${getToken()}`,
    "x-tenant-id": getTenantId() || "",
  };
  return axios
    .patch(fullUrl, body, { headers, withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      throw Error(parseApiError(error));
    });
};

const getWithToken = async ({ url, params }: ApiRequestParams) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
    "x-tenant-id": getTenantId() || "",
  };

  const requestParams = {
    ...params,
  };

  const fullUrl = `${BASE_URL}/${url}`;

  return axios
    .get(fullUrl, {
      headers,
      params: requestParams,
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      const errorMessage = parseApiError(error);
      throw Error(errorMessage);
    });
};

const patchWithToken = async ({
  url,
  body,
  contentType = "application/json",
}: ApiRequestParams) => {
  const fullUrl = `${BASE_URL}/${url}`;
  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    Authorization: `Bearer ${getToken()}`,
  };
  return axios
    .patch(fullUrl, body, { headers, withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      throw Error(parseApiError(error));
    });
};

const postAuth = async ({
  url,
  body,
  contentType = "application/json",
}: ApiRequestParams) => {
  const fullUrl = `${BASE_URL}/${url}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": contentType,
    // Authorization: `Bearer ${getToken()}`,
  };

  return axios
    .post(fullUrl, body, { headers, withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      throw Error(parseApiError(error));
    });
};

export {
  get,
  post,
  put,
  deleteApi,
  patch,
  getWithToken,
  patchWithToken,
  postWithToken,
  postAuth,
  getWithoutTenantId,
};
