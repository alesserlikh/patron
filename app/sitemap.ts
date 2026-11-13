import type { MetadataRoute } from "next";
import { seo } from "@/content/patron/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${seo.origin}/` }];
}
