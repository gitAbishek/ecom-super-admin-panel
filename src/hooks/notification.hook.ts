import { get } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

// Get list of notifications
export const useGetAllNotifications = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () =>
      get({
        url: `api/v1/notifications/?${params.toString()}`,
      }),
  });
};

// Get single notification details
export const useGetSingleNotificationDetails = (id: string) =>
  useQuery({
    queryKey: ["notifications", id],
    queryFn: () =>
      get({
        url: `api/v1/notifications/${id}`,
      }),
    enabled: !!id,
  });
