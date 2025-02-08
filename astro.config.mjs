import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import node from "@astrojs/node";
import icon from "astro-icon";
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://winflowz.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  output: "static",
  build: {
    inlineStylesheets: "auto",
    split: true,
    rollupOptions: {
      output: {
        manualChunks: {
          '@astrojs/data-layer-content': ['@astrojs/data-layer-content'],
          '@astrojs/assets': ['@astrojs/assets'],
          'astro/server': ['astro/server'],
          '@astrojs-ssr-adapter': ['@astrojs/node/server'],
        },
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@scripts': path.resolve(__dirname, './src/scripts')
      }
    },
    optimizeDeps: {
      exclude: ['@resvg/resvg-js']
    },
    build: {
      sourcemap: true
    },
    logLevel: 'info',
    clearScreen: false
  },
  adapter: node({
    mode: "standalone",
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
    compress(),
  ],
});
