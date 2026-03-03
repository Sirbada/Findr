import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-blue-600', 'text-white') // primary variant
      expect(button).toHaveClass('px-4', 'py-2') // md size
    })

    it('should render with custom text', () => {
      render(<Button>Custom Text</Button>)
      
      expect(screen.getByRole('button', { name: /custom text/i })).toBeInTheDocument()
    })

    it('should render children correctly', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )
      
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Text')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should apply primary variant styles', () => {
      render(<Button variant="primary">Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600', 'text-white', 'hover:bg-blue-700')
    })

    it('should apply secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-100', 'text-gray-900', 'hover:bg-gray-200')
    })

    it('should apply outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border-2', 'border-blue-600', 'text-blue-600')
    })

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-gray-600', 'hover:bg-gray-100')
    })
  })

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
    })

    it('should apply medium size styles (default)', () => {
      render(<Button size="md">Medium</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-base')
    })

    it('should apply large size styles', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
    })
  })

  describe('States', () => {
    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    })

    it('should not trigger onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Interactions', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      
      render(<Button onClick={handleClick}>Clickable</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle keyboard events', () => {
      const handleKeyDown = vi.fn()
      
      render(<Button onKeyDown={handleKeyDown}>Keyboard</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter' })
      
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })

    it('should handle focus events', () => {
      const handleFocus = vi.fn()
      
      render(<Button onFocus={handleFocus}>Focusable</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.focus(button)
      
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })
  })

  describe('HTML Attributes', () => {
    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should merge classNames correctly', () => {
      render(<Button className="custom-class" variant="secondary">Merged</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class', 'bg-gray-100', 'text-gray-900')
    })

    it('should accept custom attributes', () => {
      render(<Button data-testid="custom-button" aria-label="Custom aria label">Test</Button>)
      
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('aria-label', 'Custom aria label')
    })

    it('should accept type attribute', () => {
      render(<Button type="submit">Submit</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should accept form attribute', () => {
      render(<Button form="test-form">Form Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('form', 'test-form')
    })
  })

  describe('Focus Management', () => {
    it('should have proper focus styles', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2')
    })

    it('should be focusable by default', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
    })

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).not.toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('should have button role', () => {
      render(<Button>Accessible</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      render(<Button aria-describedby="description">Described</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })

    it('should support aria-expanded for dropdown buttons', () => {
      render(<Button aria-expanded={false}>Dropdown</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should support aria-pressed for toggle buttons', () => {
      render(<Button aria-pressed={true}>Toggle</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Loading State', () => {
    // This would require adding loading prop to the Button component
    it('should handle loading state if implemented', () => {
      // Mock test for potential loading state
      render(<Button disabled>Loading...</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Icon Support', () => {
    it('should render icons alongside text', () => {
      const MockIcon = () => <span data-testid="mock-icon">🔄</span>
      
      render(
        <Button>
          <MockIcon />
          With Icon
        </Button>
      )
      
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })
  })

  describe('Event Propagation', () => {
    it('should not propagate click events when disabled', async () => {
      const user = userEvent.setup()
      const parentClick = vi.fn()
      const buttonClick = vi.fn()
      
      render(
        <div onClick={parentClick}>
          <Button disabled onClick={buttonClick}>
            Disabled
          </Button>
        </div>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(buttonClick).not.toHaveBeenCalled()
      expect(parentClick).not.toHaveBeenCalled()
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = { current: null as HTMLButtonElement | null }
      
      render(<Button ref={ref}>Ref Button</Button>)
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current?.textContent).toBe('Ref Button')
    })
  })

  describe('Responsive Design', () => {
    it('should maintain proper spacing on different screen sizes', () => {
      render(<Button size="lg">Large Button</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3') // Large padding
    })
  })
})