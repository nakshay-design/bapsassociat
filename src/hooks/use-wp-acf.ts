import { useQuery } from "@tanstack/react-query";

interface ACFData {
  acf: {
    [key: string]: string | undefined;
  };
}

/**
 * Hook to fetch ACF data from a WordPress page endpoint
 * @param pageId The ID of the page to fetch
 * @param baseUrl The base URL of the WordPress installation
 */
export function useWordPressACF(pageId: number | string = 18, baseUrl: string = "https://my.wordpress.net") {
  return useQuery({
    queryKey: ["wp-acf", pageId],
    queryFn: async (): Promise<ACFData> => {
      // Use the standard WP REST API endpoint for pages with _fields=acf to optimize the payload
      const response = await fetch(`${baseUrl}/wp-json/wp/v2/pages/${pageId}?_fields=acf`);
      
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
