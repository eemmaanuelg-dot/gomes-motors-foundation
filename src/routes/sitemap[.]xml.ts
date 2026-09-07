import { createFileRoute } from "@tanstack/react-router";

import { publicVehicleCatalog } from "@/application/vehicles/public-catalog";

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const vehicles = await publicVehicleCatalog.listar();
        const urls = [
          `${origin}/`,
          `${origin}/estoque`,
          `${origin}/servicos`,
          `${origin}/sobre`,
          `${origin}/contato`,
          ...vehicles.map((vehicle) => `${origin}/estoque/${encodeURIComponent(vehicle.id)}`),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${xmlEscape(url)}</loc></url>`).join("")}</urlset>`;
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
