import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import vercel from "@astrojs/vercel/serverless";
import icon from "astro-icon";

export default defineConfig({
  site: "https://winflowz.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: "manual"
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
    compressor({
      gzip: false,
      brotli: true,
    }),
  ],
});
