import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/vote", "/bukti/", "/live", "/panitia/", "/api/", "/auth/"] }],
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined
  };
}
