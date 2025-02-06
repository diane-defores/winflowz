import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import node from "@astrojs/node";
import icon from "astro-icon";
import { fileURLToPath } from 'url';

export default defineConfig({
  site: "https://winflowz.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: "manual"
  },
  output: "server",
  build: {
    inlineStylesheets: "auto",
    split: true,
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@scripts': fileURLToPath(new URL('./src/scripts', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
        '@images': fileURLToPath(new URL('./public/images', import.meta.url)),
      }
    }
  },
  adapter: node({
    mode: "standalone"
  }),
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
    remotePatterns: [{ protocol: "https" }],
    domains: ["dynapictures.com", "i.pinimg.com", "images.unsplash.com", "www.squirrly.co"],
    assets: true,
    publicDir: true
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
