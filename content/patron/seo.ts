import { hero } from "./hero";
import { contacts, ui } from "./ui";

// SEO uses the current page copy; these are plain strings, without layout NBSPs.
export const seo = {
  origin: "https://ptrn.pro",
  name: ui.brand,
  title: `${ui.brand} — ${hero.eyebrow.toLocaleLowerCase("ru-RU")}`,
  description: hero.description,
  shareTitle: `${ui.brand}: ${hero.event} — ${hero.part} ${hero.word}`,
  shareDescription:
    "Конференции, фестивали и запуски — от первого вопроса о задаче до бизнес-метрик.",
  image: "/og-image.jpg",
  imageAlt: `${ui.brand}. ${hero.event} — ${hero.part} ${hero.word}. ${hero.eyebrow}.`,
  imageWidth: 1200,
  imageHeight: 630,
  themeColor: "#000000",
};

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${seo.origin}/#organization`,
      name: seo.name,
      url: `${seo.origin}/`,
      logo: {
        "@type": "ImageObject",
        url: `${seo.origin}/icon-512.png`,
        width: 512,
        height: 512,
      },
      description: seo.description,
      email: contacts.email,
      ...(contacts.phone ? { telephone: contacts.phone } : {}),
      sameAs: [contacts.telegramUrl],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Москва",
        addressCountry: "RU",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${seo.origin}/#website`,
      name: seo.name,
      url: `${seo.origin}/`,
      description: seo.description,
      inLanguage: "ru-RU",
      publisher: { "@id": `${seo.origin}/#organization` },
    },
  ],
};
