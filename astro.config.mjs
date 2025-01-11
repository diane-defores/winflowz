import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import vercel from "@astrojs/vercel/serverless";
import icon from "astro-icon";
import { fileURLToPath } from 'url';

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
  vite: {
    resolve: {
      alias: {
        '@scripts': fileURLToPath(new URL('./src/scripts', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
      }
    }
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
    domains: [
      'dynapictures.com',
      'i.pinimg.com',
      'images.unsplash.com',
      'www.squirrly.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.dynapictures.com'
      },
      {
        protocol: 'https',
        hostname: '**.pinimg.com'
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: '**.squirrly.co'
      }
    ]
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
    })
  ],
});
