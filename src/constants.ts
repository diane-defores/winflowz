import ogImageSrc from "@images/social.png";

export const SITE = {
  title: "WinFlowz",
  tagline: "Software & Courses",
  description: "WinFlowz offers top-tier software and courses to meet all your project needs. Start exploring and contact our sales team for superior quality and reliability.",
  description_short: "WinFlowz offers top-tier software and courses to meet all your project needs.",
  url: "https://winflowz.com",
  author: "Emil Gulamov",
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "en-US",
    "@id": SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      "@type": "WebSite",
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: "en_US",
  type: "website",
  url: SITE.url,
  title: `${SITE.title}: Software & Courses`,
  description: "Equip your projects with WinFlowz's top-quality software and courses. Trusted by industry leaders, WinFlowz offers simplicity, affordability, and reliability. Experience the difference with user-centric design and cutting-edge tools. Start exploring now!",
  image: ogImageSrc,
};
