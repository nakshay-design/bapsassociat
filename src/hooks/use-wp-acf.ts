import { useQuery } from "@tanstack/react-query";

interface ACFData {
  acf?: Record<string, string>;
}

export function useWordPressACF(
  pageId: number | string = 18,
  baseUrl: string = "https://my.wordpress.net/scope:default"
) {
  return useQuery({
    queryKey: ["wp-acf", pageId, baseUrl],

    queryFn: async (): Promise<ACFData> => {
      const cleanBase = baseUrl.replace(/\/$/, "");

      const response = await fetch(
        `${cleanBase}/wp-json/wp/v2/pages/${pageId}?_fields=acf`
      );

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.acf) {
        throw new Error("ACF data not found");
      }

      return data;
    },

    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!pageId,
  });
}