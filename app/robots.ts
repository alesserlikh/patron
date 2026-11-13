import type { MetadataRoute } from "next";
import { seo } from "@/content/patron/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${seo.origin}/sitemap.xml`,
  };
}
