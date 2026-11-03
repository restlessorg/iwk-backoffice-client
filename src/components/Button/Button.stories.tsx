import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Globe, Download } from 'lucide-react'
import type { ButtonSize, ButtonVariant } from './Button.types'

const sizes: ButtonSize[] = ['lg', 'md']
const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'link']

const meta = {
  component: Button,
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
    },
    variant: {
      control: 'select',
      options: variants,
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Import CSV',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Import CSV',
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Import CSV',
    variant: 'ghost',
  },
}

export const Link: Story = {
  args: {
    children: 'Import CSV',
    variant: 'link',
  },
}

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    icon: <Download />,
    'aria-label': 'Import orders',
  },
}

export const WithLeadingIcon: Story = {
  args: {
    children: 'Import CSV',
    leadingIcon: <Download />,
  },
}

export const WithTrailingIcon: Story = {
  args: {
    children: 'Import CSV',
    trailingIcon: <Globe />,
  },
}
