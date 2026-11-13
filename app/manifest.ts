import type { MetadataRoute } from "next";
import { seo } from "@/content/patron/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.name,
    short_name: seo.name,
    description: seo.description,
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: "ru",
    background_color: seo.themeColor,
    theme_color: seo.themeColor,
    icons: [
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
