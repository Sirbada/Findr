import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PhoneInput, OTPInput } from '@/components/ui/PhoneInput'

// Mock the translation hook
vi.mock('@/lib/i18n/context', () => ({
  useTranslation: () => ({
    lang: 'fr' as const,
  }),
}))

describe('PhoneInput Component', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render phone input form', () => {
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      expect(screen.getByLabelText(/numéro de téléphone/i)).toBeInTheDocument()
      expect(screen.getByText('+237')).toBeInTheDocument()
      expect(screen.getByText('🇨🇲')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /recevoir le code/i })).toBeInTheDocument()
    })

    it('should show placeholder text', () => {
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      expect(input).toBeInTheDocument()
    })

    it('should show demo notice', () => {
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      expect(screen.getByText(/mode démo/i)).toBeInTheDocument()
      expect(screen.getByText(/console/i)).toBeInTheDocument()
    })
  })

  describe('Phone Number Input', () => {
    it('should accept valid phone number input', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '699123456')
      
      expect(input).toHaveValue('699123456')
    })

    it('should filter non-numeric characters', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '699abc123def456')
      
      expect(input).toHaveValue('699123456')
    })

    it('should limit input to 9 digits', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '69912345678901234')
      
      expect(input).toHaveValue('699123456') // Only first 9 digits
    })

    it('should show character count', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '699123')
      
      expect(screen.getByText('6/9')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should show validation error for empty phone', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const button = screen.getByRole('button', { name: /recevoir le code/i })
      await user.click(button)
      
      expect(screen.getByText(/numéro de téléphone est requis/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show validation error for short phone number', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '699123')
      
      const button = screen.getByRole('button', { name: /recevoir le code/i })
      await user.click(button)
      
      expect(screen.getByText(/doit contenir 9 chiffres/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show validation error for invalid format', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '512345678') // Invalid prefix
      
      const button = screen.getByRole('button', { name: /recevoir le code/i })
      await user.click(button)
      
      expect(screen.getByText(/opérateur non reconnu/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should clear validation error when input changes', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      const button = screen.getByRole('button', { name: /recevoir le code/i })
      
      // Trigger validation error
      await user.click(button)
      expect(screen.getByText(/requis/i)).toBeInTheDocument()
      
      // Start typing to clear error
      await user.type(input, '6')
      
      expect(screen.queryByText(/requis/i)).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid phone number', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '699123456')
      
      const button = screen.getByRole('button', { name: /recevoir le code/i })
      await user.click(button)
      
      expect(mockOnSubmit).toHaveBeenCalledWith('699123456')
    })

    it('should handle submission via Enter key', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '699123456')
      await user.keyboard('{Enter}')
      
      expect(mockOnSubmit).toHaveBeenCalledWith('699123456')
    })
  })

  describe('Loading State', () => {
    it('should show loading state', () => {
      render(<PhoneInput onSubmit={mockOnSubmit} loading={true} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      
      // Should show spinner icon (Loader2)
      const loader = button.querySelector('svg')
      expect(loader).toBeInTheDocument()
    })

    it('should disable input when loading', () => {
      render(<PhoneInput onSubmit={mockOnSubmit} loading={true} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      expect(input).toBeDisabled()
    })
  })

  describe('External Error Display', () => {
    it('should display external error', () => {
      render(<PhoneInput onSubmit={mockOnSubmit} error="Network error" />)
      
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    it('should prioritize external error over local validation', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} error="Network error" />)
      
      const button = screen.getByRole('button', { name: /recevoir le code/i })
      await user.click(button) // This would trigger validation error
      
      // Should still show external error, not validation error
      expect(screen.getByText('Network error')).toBeInTheDocument()
      expect(screen.queryByText(/requis/i)).not.toBeInTheDocument()
    })
  })

  describe('Button State', () => {
    it('should disable button when phone is too short', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '699123')
      
      const button = screen.getByRole('button', { name: /recevoir le code/i })
      expect(button).toBeDisabled()
    })

    it('should enable button when phone is complete', async () => {
      const user = userEvent.setup()
      render(<PhoneInput onSubmit={mockOnSubmit} />)
      
      const input = screen.getByPlaceholderText('699 00 00 00')
      await user.type(input, '699123456')
      
      const button = screen.getByRole('button', { name: /recevoir le code/i })
      expect(button).toBeEnabled()
    })
  })
})

describe('OTPInput Component', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
  const mockOnResend = vi.fn().mockResolvedValue(undefined)
  const mockOnChangeNumber = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultProps = {
    phone: '699123456',
    onSubmit: mockOnSubmit,
    onResend: mockOnResend,
    onChangeNumber: mockOnChangeNumber,
  }

  describe('Rendering', () => {
    it('should render OTP input form', () => {
      render(<OTPInput {...defaultProps} />)
      
      expect(screen.getByText(/code envoyé au/i)).toBeInTheDocument()
      expect(screen.getByText('+237 6 99 12 34 56')).toBeInTheDocument()
      
      // Should render 6 OTP input fields
      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(6)
    })

    it('should show formatted phone number', () => {
      render(<OTPInput {...defaultProps} />)
      
      expect(screen.getByText('+237 6 99 12 34 56')).toBeInTheDocument()
    })

    it('should show change number button', () => {
      render(<OTPInput {...defaultProps} />)
      
      const changeButton = screen.getByRole('button')
      // The edit icon button should be present
      expect(changeButton).toBeInTheDocument()
    })
  })

  describe('OTP Input Fields', () => {
    it('should accept single digit in each field', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], '1')
      
      expect(inputs[0]).toHaveValue('1')
    })

    it('should move focus to next field after entering digit', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], '1')
      
      // Focus should move to second input
      expect(inputs[1]).toHaveFocus()
    })

    it('should handle backspace to move to previous field', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      
      // Type in first field, focus moves to second
      await user.type(inputs[0], '1')
      expect(inputs[1]).toHaveFocus()
      
      // Backspace in empty second field should focus first field
      await user.keyboard('{Backspace}')
      expect(inputs[0]).toHaveFocus()
    })

    it('should handle paste operation', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      
      // Focus first input and paste 6 digits
      inputs[0].focus()
      await user.paste('123456')
      
      // All fields should be filled
      expect(inputs[0]).toHaveValue('1')
      expect(inputs[1]).toHaveValue('2')
      expect(inputs[2]).toHaveValue('3')
      expect(inputs[3]).toHaveValue('4')
      expect(inputs[4]).toHaveValue('5')
      expect(inputs[5]).toHaveValue('6')
    })

    it('should filter non-numeric characters', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], 'a1b2c')
      
      expect(inputs[0]).toHaveValue('1')
      expect(inputs[1]).toHaveFocus()
    })
  })

  describe('Auto Submission', () => {
    it('should auto-submit when all 6 digits are entered', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      
      // Type 6 digits
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], String(i + 1))
      }
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('123456')
      })
    })

    it('should not auto-submit when loading', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} loading={true} />)
      
      const inputs = screen.getAllByRole('textbox')
      
      // Type 6 digits while loading
      await user.paste('123456')
      
      // Should not submit while loading
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Manual Submission', () => {
    it('should submit via verify button', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      
      // Type 6 digits
      await user.type(inputs[0], '123456')
      
      const verifyButton = screen.getByRole('button', { name: /vérifier/i })
      await user.click(verifyButton)
      
      expect(mockOnSubmit).toHaveBeenCalledWith('123456')
    })

    it('should disable verify button when OTP is incomplete', () => {
      render(<OTPInput {...defaultProps} />)
      
      const verifyButton = screen.getByRole('button', { name: /vérifier/i })
      expect(verifyButton).toBeDisabled()
    })

    it('should enable verify button when OTP is complete', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      await user.paste('123456')
      
      const verifyButton = screen.getByRole('button', { name: /vérifier/i })
      expect(verifyButton).toBeEnabled()
    })
  })

  describe('OTP Validation', () => {
    it('should show validation error for incomplete OTP', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      await user.type(inputs[0], '12345') // Only 5 digits
      
      const verifyButton = screen.getByRole('button', { name: /vérifier/i })
      await user.click(verifyButton)
      
      expect(screen.getByText(/6 chiffres/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Resend Functionality', () => {
    it('should show resend button when no cooldown', () => {
      render(<OTPInput {...defaultProps} cooldown={0} />)
      
      const resendButton = screen.getByRole('button', { name: /renvoyer le code/i })
      expect(resendButton).toBeInTheDocument()
      expect(resendButton).toBeEnabled()
    })

    it('should show cooldown timer when cooling down', () => {
      render(<OTPInput {...defaultProps} cooldown={30} />)
      
      expect(screen.getByText(/renvoyer dans/i)).toBeInTheDocument()
      expect(screen.getByText('30s')).toBeInTheDocument()
      
      const resendButton = screen.queryByRole('button', { name: /renvoyer le code/i })
      expect(resendButton).not.toBeInTheDocument()
    })

    it('should call onResend when resend button is clicked', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} cooldown={0} />)
      
      const resendButton = screen.getByRole('button', { name: /renvoyer le code/i })
      await user.click(resendButton)
      
      expect(mockOnResend).toHaveBeenCalledTimes(1)
    })
  })

  describe('Change Number Functionality', () => {
    it('should call onChangeNumber when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<OTPInput {...defaultProps} />)
      
      const editButton = screen.getByRole('button')
      await user.click(editButton)
      
      expect(mockOnChangeNumber).toHaveBeenCalledTimes(1)
    })
  })

  describe('Loading State', () => {
    it('should disable all inputs when loading', () => {
      render(<OTPInput {...defaultProps} loading={true} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toBeDisabled()
      })
    })

    it('should show loading in verify button', () => {
      render(<OTPInput {...defaultProps} loading={true} />)
      
      const verifyButton = screen.getByRole('button', { name: /vérifier/i })
      expect(verifyButton).toBeDisabled()
      
      // Should show spinner
      const loader = verifyButton.querySelector('svg')
      expect(loader).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display external error', () => {
      render(<OTPInput {...defaultProps} error="Invalid OTP" />)
      
      expect(screen.getByText('Invalid OTP')).toBeInTheDocument()
    })

    it('should style inputs with error state', () => {
      render(<OTPInput {...defaultProps} error="Invalid OTP" />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveClass('border-red-300')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<OTPInput {...defaultProps} />)
      
      const inputs = screen.getAllByRole('textbox')
      inputs.forEach(input => {
        expect(input).toHaveAttribute('inputMode', 'numeric')
        expect(input).toHaveAttribute('autoComplete', 'one-time-code')
      })
    })
  })
})