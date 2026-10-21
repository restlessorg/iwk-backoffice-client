import type { Preview } from '@storybook/react-vite'
import '@fontsource-variable/manrope'
import '@/locales/i18n'
import '@/styles/global.scss'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      options: {
        canvas: { name: 'Canvas', value: '#f1f1f4' },
        surface: { name: 'Surface', value: '#ffffff' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'canvas' },
  },
}

export default preview
