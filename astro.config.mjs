import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import starlight from "@astrojs/starlight";
import vercel from "@astrojs/vercel/serverless";
import icon from "astro-icon";

export default defineConfig({
  site: "https://winflowz.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: false,
      redirectDefaultLocale: true,
      strategy: "pathname",
      paths: {
        fr: {
          "products": "produits",
          "contact": "contact",
          "blog": "blog",
          "insights": "perspectives",
          "services": "services",
          "roadmap": "roadmap",
          "disclaimer": "non-responsabilite",
          "privacy": "confidentialite",
          "copyright": "droits",
          "terms": "cgu",
          "legal": "mentions-legales"
        }
      }
    }
  },
  output: "hybrid",
  build: {
    inlineStylesheets: "auto",
    split: true,
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    speedInsights: {
      enabled: true,
    },
    imageService: true,
    imagesConfig: {
      sizes: [640, 750, 828, 1080, 1200],
      formats: ["image/webp"],
    },
  }),
  image: {
    domains: ["images.unsplash.com"],
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  integrations: [
    icon({
      include: {
        heroicons: ["*"],
        "phosphor-icons": ["*"]
      },
      svgoOptions: {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          fr: "fr"
        }
      }
    }),
    starlight({
      title: "WinFlowz",
      defaultLocale: "en",
      sidebar: [
        {
          label: "Quick Start Guides",
          translations: {
            fr: "Guides de Démarrage Rapide",
          },
          autogenerate: { directory: "guides" },
        },
        {
          label: "Tools & Equipment",
          translations: {
            fr: "Outils & Équipements",
          },
          items: [
            { 
              label: "Tool Guides", 
              link: "tools/tool-guides/",
              translations: {
                fr: "Guides d'Outils",
              },
            },
            { 
              label: "Equipment Care", 
              link: "tools/equipment-care/",
              translations: {
                fr: "Entretien du Matériel",
              },
            },
          ],
        },
        {
          label: "Construction Services",
          translations: {
            fr: "Services de Construction",
          },
          autogenerate: { directory: "construction" },
        },
        {
          label: "Advanced Topics",
          translations: {
            fr: "Sujets Avancés",
          },
          autogenerate: { directory: "advanced" },
        },
      ],
      social: {
        github: "https://github.com/dianedef",
      },
      disable404Route: true,
      customCss: ["./src/assets/styles/starlight.css"],
      favicon: "/favicon.ico",
      components: {
        SiteTitle: "./src/components/ui/starlight/SiteTitle.astro",
        Head: "./src/components/ui/starlight/Head.astro",
        MobileMenuFooter: "./src/components/ui/starlight/MobileMenuFooter.astro",
        ThemeSelect: "./src/components/ui/starlight/ThemeSelect.astro",
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://winflowz.com/social.webp",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "twitter:image",
            content: "https://winflowz.com/social.webp",
          },
        },
      ],
    }),
    compressor({
      gzip: false,
      brotli: true,
    }),
  ],
});
