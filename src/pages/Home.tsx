import { useEffect, useState } from "react";

type Service = {
  title: string;
  img: string;
};

// Define outside the component — stable reference, no re-creation on render
const SERVICE_LABELS = [
  "Bookkeeping",
  "Payroll Services",
  "Tax Planning",
  "Audit & Assurance",
  "Financial Statement",
  "Business Advisory",
  "Tech Consulting",
  "Outsourced CFO",
];

const FALLBACK_ICON = "/icons/default-service.png"; // or a data URI

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ fetch is INSIDE useEffect with empty dep array — runs once only
    const controller = new AbortController();

    fetch(
      "https://my.wordpress.net/scope:default/wp-json/wp/v2/pages/18",
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const acf = data?.acf ?? {};

        const servicesData: Service[] = SERVICE_LABELS.map((title, i) => ({
          title,
          // ✅ fallback to FALLBACK_ICON if ACF field is missing/empty
          img: acf[`icon_${i + 1}`] || FALLBACK_ICON,
        }));

        setServices(servicesData);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load services:", err);
          setError("Could not load services. Please try again.");
          // ✅ Graceful degradation — show labels without icons
          setServices(SERVICE_LABELS.map((title) => ({ title, img: FALLBACK_ICON })));
        }
      })
      .finally(() => setLoading(false));

    // ✅ Cleanup — cancels fetch if component unmounts
    return () => controller.abort();
  }, []); // empty array = run once on mount

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-28 h-28 rounded-full bg-gray-200" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* ✅ Services grid — always renders if services.length > 0 */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-28 h-28 mb-6 rounded-full bg-secondary/50 flex items-center justify-center p-6
                               transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg
                               group-hover:bg-white border border-transparent group-hover:border-border">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-contain"
                    // ✅ Image error fallback
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_ICON;
                      e.currentTarget.onerror = null; // prevent infinite loop
                    }}
                  />
                </div>
                <h4 className="text-lg font-bold text-heading group-hover:text-accent transition-colors">
                  {service.title}
                </h4>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}