import type { PluginOption } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// The Cloudflare plugin starts its own Workers dev server, which clashes with
// Vitest's server ("There is already a server associated with the config").
// Tests only need the React plugin and the aliases.
const withoutCloudflare = (plugins: PluginOption[] = []): PluginOption[] =>
  plugins
    .flat(Infinity as 1)
    .filter(
      (p) =>
        !(
          p &&
          typeof p === 'object' &&
          'name' in p &&
          p.name.startsWith('vite-plugin-cloudflare')
        ),
    )

export default mergeConfig(
  { ...viteConfig, plugins: withoutCloudflare(viteConfig.plugins) },
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/**/*.stories.{ts,tsx}',
          'src/test/**',
          'src/main.tsx',
        ],
      },
    },
  }),
)
