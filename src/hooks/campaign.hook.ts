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
  campaignType,
  isActive,
  search,
}: {
  page: number;
  limit: number;
  campaignType?: string;
  isActive?: boolean;
  search?: string;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (campaignType) params.append('campaignType', campaignType);
  if (isActive !== undefined) params.append('isActive', isActive.toString());
  if (search) params.append('search', search);

  return useQuery({
    queryKey: ["campaigns", page, limit, campaignType, isActive, search],
    queryFn: () =>
      get({
        url: `api/v1/campaigns/?${params.toString()}`,
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
