import { useQuery } from "@tanstack/react-query";

interface ACFData {
  acf?: Record<string, string>;
}

// 🔥 Convert ID → URL (if needed)
const resolveImage = async (value: string | number, baseUrl: string) => {
  if (!value) return "";

  // ✅ Already URL
  if (typeof value === "string") return value;

  // 🔥 If ID → fetch media
  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/media/${value}`
    );
    const data = await res.json();
    return data?.source_url || "";
  } catch {
    return "";
  }
};

export function useWordPressACF(
  pageId: number | string = 18,
  baseUrl: string = "https://my.wordpress.net/scope:default"
) {
  return useQuery({
    queryKey: ["wp-acf", pageId, baseUrl],

    queryFn: async (): Promise<ACFData> => {
      const cleanBase = baseUrl.replace(/\/$/, "");

      const url = `${cleanBase}/wp-json/wp/v2/pages/${pageId}?_fields=acf`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.acf) {
        throw new Error("ACF data not found");
      }

      const acf = data.acf;

      // 🔥 Normalize all images
      const resolvedACF: Record<string, string> = {};

      for (const key of Object.keys(acf)) {
        resolvedACF[key] = await resolveImage(acf[key], cleanBase);
      }

      return { acf: resolvedACF };
    },

    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: !!pageId,
  });
}