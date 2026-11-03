import { createRef } from 'react'
import { Button } from './Button'
import styles from './styles.module.scss'
import { queryByTestId, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Button', () => {
  const getButtonElement = () => screen.getByRole('button')

  it('renders children as the accessible name', () => {
    render(<Button>Test</Button>)

    expect(getButtonElement()).toHaveAccessibleName('Test')
  })

  it('has type="button" by default', () => {
    render(<Button>Test</Button>)

    expect(getButtonElement()).toHaveAttribute('type', 'button')
  })

  it('lets type="submit" override the default type', () => {
    render(<Button type='submit'>Test</Button>)

    expect(getButtonElement()).toHaveAttribute('type', 'submit')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Test</Button>)

    const buttonEl = getButtonElement()

    await user.click(buttonEl)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('calls onClick on Enter', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Test</Button>)

    await user.tab()
    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('calls onClick on Space', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Test</Button>)

    await user.tab()
    await user.keyboard(' ')

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled and does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <Button disabled onClick={onClick}>
        Test
      </Button>,
    )

    const buttonEl = getButtonElement()

    expect(buttonEl).toBeDisabled()

    await user.click(buttonEl)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not pass leadingicon and trailingicon to the DOM', () => {
    render(
      <Button leadingIcon={<span>L</span>} trailingIcon={<span>R</span>}>
        Test
      </Button>,
    )

    expect(getButtonElement()).not.toHaveAttribute('leadingicon')
    expect(getButtonElement()).not.toHaveAttribute('trailingicon')
  })

  it('does not pass icon and icon-only to the DOM', () => {
    render(<Button icon={<span>I</span>} iconOnly aria-label='Test button' />)

    expect(getButtonElement()).not.toHaveAttribute('icon')
  })

  describe('native props', () => {
    it('adds className to its own class instead of replacing it', () => {
      render(<Button className='test'>Test</Button>)

      expect(getButtonElement()).toHaveClass(styles.root, 'test')
    })

    it('passes aria-* and other attributes to the button', () => {
      render(
        <Button
          aria-label='test button'
          aria-description='test button'
          data-name='button'
        >
          Test
        </Button>,
      )

      expect(getButtonElement()).toHaveAttribute('aria-label', 'test button')
      expect(getButtonElement()).toHaveAttribute(
        'aria-description',
        'test button',
      )
      expect(getButtonElement()).toHaveAttribute('data-name', 'button')
    })

    it('forwards ref to the button element', () => {
      const ref = createRef<HTMLButtonElement>()

      render(<Button ref={ref}>Test</Button>)

      expect(ref.current).toBe(getButtonElement())
    })
  })

  describe('icons', () => {
    it('renders without icons', () => {
      render(<Button>Test</Button>)

      expect(
        queryByTestId(getButtonElement(), 'leading-icon'),
      ).not.toBeInTheDocument()
      expect(
        queryByTestId(getButtonElement(), 'trailing-icon'),
      ).not.toBeInTheDocument()
    })

    it('renders only the leading icon', () => {
      render(<Button leadingIcon={<span>Leading icon</span>}>Test</Button>)

      expect(
        queryByTestId(getButtonElement(), 'leading-icon'),
      ).toBeInTheDocument()
      expect(
        queryByTestId(getButtonElement(), 'trailing-icon'),
      ).not.toBeInTheDocument()
    })

    it('renders only the trailing icon', () => {
      render(<Button trailingIcon={<span>Trailing icon</span>}>Test</Button>)

      expect(
        queryByTestId(getButtonElement(), 'trailing-icon'),
      ).toBeInTheDocument()
      expect(
        queryByTestId(getButtonElement(), 'leading-icon'),
      ).not.toBeInTheDocument()
    })

    it('renders leading icon, text and trailing icon in that order', () => {
      render(
        <Button leadingIcon={<span>L</span>} trailingIcon={<span>R</span>}>
          Center
        </Button>,
      )

      expect(getButtonElement()).toHaveTextContent('LCenterR')
    })

    it('hides icons from assistive technology', () => {
      render(
        <Button leadingIcon={<span>L</span>} trailingIcon={<span>R</span>}>
          Content
        </Button>,
      )

      expect(queryByTestId(getButtonElement(), 'leading-icon')).toHaveAttribute(
        'aria-hidden',
      )
      expect(
        queryByTestId(getButtonElement(), 'trailing-icon'),
      ).toHaveAttribute('aria-hidden')
    })
  })

  it('uses the default variant and size', () => {
    render(<Button>Test</Button>)

    expect(getButtonElement()).toHaveAttribute('data-variant', 'primary')
    expect(getButtonElement()).toHaveAttribute('data-size', 'md')
  })

  it('passes variant and size to the styling hooks', () => {
    render(
      <Button variant='secondary' size='lg'>
        Test
      </Button>,
    )

    expect(getButtonElement()).toHaveAttribute('data-variant', 'secondary')
    expect(getButtonElement()).toHaveAttribute('data-size', 'lg')
  })

  describe('icon-only', () => {
    it('renders only the icon when iconOnly is set', () => {
      render(
        <Button
          iconOnly
          aria-label='Test button'
          icon={<span data-testid='icon'>Icon</span>}
        />,
      )

      expect(
        queryByTestId(getButtonElement(), 'leading-icon'),
      ).not.toBeInTheDocument()
      expect(
        queryByTestId(getButtonElement(), 'trailing-icon'),
      ).not.toBeInTheDocument()
      expect(queryByTestId(getButtonElement(), 'icon')).toBeInTheDocument()
    })

    it('is named by aria-label', () => {
      render(
        <Button
          iconOnly
          aria-label='Test button'
          icon={<span data-testid='icon'>Icon</span>}
        />,
      )

      expect(getButtonElement()).toHaveAccessibleName('Test button')
    })

    it('exposes the icon-only look to the styling hooks', () => {
      render(
        <Button
          iconOnly
          aria-label='Test button'
          icon={<span data-testid='icon'>Icon</span>}
        />,
      )

      expect(getButtonElement()).toHaveAttribute('data-icon-only', 'true')
    })
  })

  it('renders the given element with the styling hooks', () => {
    render(
      <Button render={<a href='/' />} variant='secondary' size='lg'>
        Test
      </Button>,
    )

    const element = screen.getByRole('link', { name: 'Test' })

    expect(element).toHaveAttribute('data-variant', 'secondary')
    expect(element).toHaveAttribute('data-size', 'lg')
    expect(element).not.toHaveAttribute('type', 'button')
  })

  it('marks a disabled link with aria-disabled and blocks clicks', () => {
    const onClick = vi.fn()

    render(
      <Button render={<a href='/' />} onClick={onClick} disabled>
        Test
      </Button>,
    )

    const element = screen.getByRole('link', {
      name: 'Test',
    })

    expect(element).toHaveAttribute('aria-disabled', 'true')
    expect(element).not.toHaveAttribute('disabled')
    expect(onClick).not.toHaveBeenCalled()
  })
})
