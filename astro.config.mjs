import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import starlight from "@astrojs/starlight";
import vercel from "@astrojs/vercel/serverless";
import icon from "astro-icon";

export default defineConfig({
  site: "https://winflowz.com",
  image: {
    domains: ["images.unsplash.com"],
  },
  prefetch: true,
  adapter: vercel(),
  output: "server",
  integrations: [
    icon({
      include: {
        heroicons: ["*"],
        "phosphor-icons": ["*"]
      }
    }),
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          fr: "fr",
        },
        routing: {
          prefixDefaultLocale: false,
          redirectDefaultLocale: true,
          strategy: "pathname",
          paths: {
            fr: {
              "products": "produits",
              "produits": "products",
              "contact": "contact",
              "blog": "blog",
              "insights": "perspectives",
              "perspectives": "insights",
              "services": "services",
              "roadmap": "roadmap",
              "disclaimer": "non-responsabilite",
              "non-responsabilite": "disclaimer",
              "privacy": "confidentialite",
              "confidentialite": "privacy",
              "copyright": "droits",
              "droits": "copyright",
              "terms": "cgu",
              "cgu": "terms",
              "legal": "mentions-legales",
              "mentions-legales": "legal"
            }
          }
        }
      },
    }),
    starlight({
      title: "WinFlowz",
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        fr: { 
          label: "Français", 
          lang: "fr" 
        },
      },
      sidebar: [
        {
          label: "Quick Start Guides",
          translations: {
            de: "Schnellstartanleitungen",
            es: "Guías de Inicio Rápido",
            fa: "راهنمای شروع سریع",
            fr: "Guides de Démarrage Rapide",
            ja: "クイックスタートガイド",
            "zh-cn": "快速入门指南",
          },
          autogenerate: { directory: "guides" },
        },
        {
          label: "Tools & Equipment",
          items: [
            { label: "Tool Guides", link: "tools/tool-guides/" },
            { label: "Equipment Care", link: "tools/equipment-care/" },
          ],
        },
        {
          label: "Construction Services",
          autogenerate: { directory: "construction" },
        },
        {
          label: "Advanced Topics",
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
            content: "https://screwfast.uk" + "/social.webp",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "twitter:image",
            content: "https://screwfast.uk" + "/social.webp",
          },
        },
      ],
    }),
    compressor({
      gzip: false,
      brotli: true,
    }),
  ],
  experimental: {
    clientPrerender: true,
    directRenderScript: true,
  },
});
