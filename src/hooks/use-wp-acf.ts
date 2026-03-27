import { useQuery } from "@tanstack/react-query";

interface ACFData {
  acf?: Record<string, string>;
}

/**
 * Hook to fetch ACF data from WordPress page
 */
export function useWordPressACF(
  pageId: number | string = 18,
  baseUrl: string = "https://my.wordpress.net/scope:default"
) {
  return useQuery({
    queryKey: ["wp-acf", pageId, baseUrl],

    queryFn: async (): Promise<ACFData> => {
      const cleanBase = baseUrl.replace(/\/$/, "");

      const url = `${cleanBase}/wp-json/wp/v2/pages/${pageId}?_fields=acf`;

      console.log("Fetching:", url); 

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const data = await response.json();

      console.log("ACF DATA:", data); 

      if (!data?.acf) {
        throw new Error("ACF data not found");
      }

      return data;
    },

    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 2,
    enabled: !!pageId,
  });
}