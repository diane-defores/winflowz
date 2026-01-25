import ogImageSrc from "@/assets/images/WinFlowz.png";

export const SITE = {
  name: 'WinFlowz',
  title: 'WinFlowz - Optimize your Windows workflow',
  description: 'WinFlowz is a Windows toolkit designed to optimize your daily workflow.',
  url: 'https://winflowz.com',
  githubUrl: 'https://github.com/winflowz',
  ogImage: '/images/WinFlowz.png'
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
