import type { Metadata, Viewport } from "next";
import { seo, structuredData } from "@/content/patron/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(seo.origin),
  title: seo.title,
  description: seo.description,
  applicationName: seo.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: seo.name,
    url: "/",
    title: seo.shareTitle,
    description: seo.shareDescription,
    images: [
      {
        url: seo.image,
        width: seo.imageWidth,
        height: seo.imageHeight,
        type: "image/jpeg",
        alt: seo.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.shareTitle,
    description: seo.shareDescription,
    images: [{ url: seo.image, alt: seo.imageAlt }],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = { themeColor: seo.themeColor };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <script
          id="patron-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
