import { get, put, deleteApi, postWithToken } from "@/api/client";
import { useMutation, useQuery } from "@tanstack/react-query";

// Create campaign
export const useCreateCampaign = () =>
  useMutation({
    mutationFn: (body: object) =>
      postWithToken({
        url: "api/v1/campaigns",
        body,
      }),
  });

// Update campaign
export const useUpdateCampaign = () =>
  useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) =>
      put({
        url: `api/v1/campaigns/${id}`,
        body,
      }),
  });

// Delete campaign
export const useDeleteCampaign = () =>
  useMutation({
    mutationFn: (id: string) =>
      deleteApi({
        url: `api/v1/campaigns/${id}`,
      }),
  });

// Get list of campaigns
export const useGetAllCampaigns = ({
  page,
  limit,
  search,
  filters,
}: {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, unknown>;
}) => {
  const searchParams = search ? `&search=${encodeURIComponent(search)}` : '';
  const filterParams = filters ? `&filters=${encodeURIComponent(JSON.stringify(filters))}` : '';
  
  return useQuery({
    queryKey: ["campaigns", page, limit, search, filters],
    queryFn: () =>
      get({
        url: `api/v1/campaigns/?page=${page}&limit=${limit}${searchParams}${filterParams}`,
      }),
  });
};

// Get single campaign details
export const useGetSingleCampaignDetails = (id: string) =>
  useQuery({
    queryKey: ["campaigns", id],
    queryFn: () =>
      get({
        url: `api/v1/campaigns/${id}`,
      }),
    enabled: !!id,
  });
