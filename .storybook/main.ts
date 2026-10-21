import type { StorybookConfig } from '@storybook/react-vite'
import type { PluginOption } from 'vite'

// The Cloudflare plugin runs the Worker dev server; Storybook only needs the React app.
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

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: '@storybook/react-vite',
  viteFinal: (config) => ({
    ...config,
    plugins: withoutCloudflare(config.plugins),
  }),
}
export default config
