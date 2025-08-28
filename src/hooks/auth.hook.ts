import { useMutation, useQuery } from "@tanstack/react-query";
import { post, getWithoutTenantId } from "../api/client";

export const useCreateAccount = () =>
  useMutation({
    mutationFn: (body: object) => post({ url: "api/v1/user/create", body }),
  });

export const useLoginAccount = () =>
  useMutation({
    mutationFn: (body: object) => post({ url: "api/v1/user/auth/login", body }),
  });

export const useValidateTenantAdmin = (
  domain: string,
  type: string = "admin"
) =>
  useQuery({
    queryKey: ["validateTenantAdmin", domain, type],
    queryFn: () =>
      getWithoutTenantId({
        url: `api/v1/user/tenant/validate/${domain}?type=${type}`,
      }),
    enabled: !!domain, // Only run query if domain is provided
  });
