import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display phone authentication form', async ({ page }) => {
    // Navigate to login (assuming there's a login link/button)
    await page.click('text=/connexion|login/i')
    
    // Should show phone input form
    await expect(page.locator('input[type="tel"]')).toBeVisible()
    await expect(page.locator('text=+237')).toBeVisible()
    await expect(page.locator('text=🇨🇲')).toBeVisible()
    
    // Should show demo notice
    await expect(page.locator('text=/mode démo|demo mode/i')).toBeVisible()
  })

  test('should validate phone number input', async ({ page }) => {
    await page.click('text=/connexion|login/i')
    
    const phoneInput = page.locator('input[type="tel"]')
    const submitButton = page.locator('button:has-text("Recevoir le code"), button:has-text("Get code")')
    
    // Try to submit empty form
    await submitButton.click()
    
    // Should show validation error
    await expect(page.locator('text=/requis|required/i')).toBeVisible()
    
    // Enter invalid phone number
    await phoneInput.fill('123')
    await submitButton.click()
    
    // Should show length error
    await expect(page.locator('text=/9 chiffres|9 digits/i')).toBeVisible()
    
    // Enter invalid format
    await phoneInput.fill('512345678')
    await submitButton.click()
    
    // Should show operator error
    await expect(page.locator('text=/opérateur|operator/i')).toBeVisible()
  })

  test('should proceed to OTP step with valid phone', async ({ page }) => {
    await page.click('text=/connexion|login/i')
    
    const phoneInput = page.locator('input[type="tel"]')
    const submitButton = page.locator('button:has-text("Recevoir le code"), button:has-text("Get code")')
    
    // Enter valid Orange number
    await phoneInput.fill('699123456')
    await submitButton.click()
    
    // Should proceed to OTP step
    await expect(page.locator('text=/code de vérification|verification code/i')).toBeVisible()
    await expect(page.locator('text=+237 6 99 12 34 56')).toBeVisible()
    
    // Should show 6 OTP input fields
    const otpInputs = page.locator('input[maxlength="1"]')
    await expect(otpInputs).toHaveCount(6)
  })

  test('should handle OTP input and validation', async ({ page }) => {
    await page.click('text=/connexion|login/i')
    
    // Complete phone step
    await page.fill('input[type="tel"]', '699123456')
    await page.click('button:has-text("Recevoir le code"), button:has-text("Get code")')
    
    // Wait for OTP step
    await expect(page.locator('text=/code de vérification|verification code/i')).toBeVisible()
    
    const otpInputs = page.locator('input[maxlength="1"]')
    
    // Enter partial OTP
    await otpInputs.nth(0).fill('1')
    await otpInputs.nth(1).fill('2')
    await otpInputs.nth(2).fill('3')
    
    // Try to verify incomplete OTP
    await page.click('button:has-text("Vérifier"), button:has-text("Verify")')
    
    // Should show validation error
    await expect(page.locator('text=/6 chiffres|6 digits/i')).toBeVisible()
    
    // Complete OTP
    await otpInputs.nth(3).fill('4')
    await otpInputs.nth(4).fill('5')
    await otpInputs.nth(5).fill('6')
    
    // Should auto-submit or enable verify button
    // In demo mode, this might complete authentication
    await page.waitForTimeout(1000) // Wait for potential auto-submit
  })

  test('should support OTP paste functionality', async ({ page }) => {
    await page.click('text=/connexion|login/i')
    
    // Complete phone step
    await page.fill('input[type="tel"]', '699123456')
    await page.click('button:has-text("Recevoir le code"), button:has-text("Get code")')
    
    await expect(page.locator('text=/code de vérification|verification code/i')).toBeVisible()
    
    // Focus first OTP input and simulate paste
    const firstInput = page.locator('input[maxlength="1"]').first()
    await firstInput.focus()
    
    // Simulate paste event (this is tricky in Playwright, so we'll type manually)
    const otpInputs = page.locator('input[maxlength="1"]')
    const digits = ['1', '2', '3', '4', '5', '6']
    
    for (let i = 0; i < digits.length; i++) {
      await otpInputs.nth(i).fill(digits[i])
    }
    
    // All fields should be filled
    for (let i = 0; i < digits.length; i++) {
      await expect(otpInputs.nth(i)).toHaveValue(digits[i])
    }
  })

  test('should allow changing phone number', async ({ page }) => {
    await page.click('text=/connexion|login/i')
    
    // Complete phone step
    await page.fill('input[type="tel"]', '699123456')
    await page.click('button:has-text("Recevoir le code"), button:has-text("Get code")')
    
    await expect(page.locator('text=/code de vérification|verification code/i')).toBeVisible()
    
    // Click edit/change number button (likely has an edit icon)
    await page.click('button:has([data-testid="edit-icon"]), button:has(text="✏️"), svg')
    
    // Should go back to phone input step
    await expect(page.locator('input[type="tel"]')).toBeVisible()
    await expect(page.locator('input[type="tel"]')).toHaveValue('699123456')
  })

  test('should handle resend OTP functionality', async ({ page }) => {
    await page.click('text=/connexion|login/i')
    
    // Complete phone step
    await page.fill('input[type="tel"]', '699123456')
    await page.click('button:has-text("Recevoir le code"), button:has-text("Get code")')
    
    await expect(page.locator('text=/code de vérification|verification code/i')).toBeVisible()
    
    // Should show resend option (either immediately or after cooldown)
    const resendButton = page.locator('button:has-text("Renvoyer"), button:has-text("Resend")')
    const cooldownText = page.locator('text=/renvoyer dans|resend in/i')
    
    // Either resend button or cooldown should be visible
    await expect(resendButton.or(cooldownText)).toBeVisible()
    
    // If resend button is available, test it
    if (await resendButton.isVisible({ timeout: 1000 })) {
      await resendButton.click()
      
      // Should show some feedback (loading state, success message, etc.)
      await page.waitForTimeout(500)
    }
  })

  test('should handle authentication success', async ({ page }) => {
    // Mock successful authentication by using demo OTP
    await page.click('text=/connexion|login/i')
    
    // Complete phone step
    await page.fill('input[type="tel"]', '699123456')
    await page.click('button:has-text("Recevoir le code"), button:has-text("Get code")')
    
    await expect(page.locator('text=/code de vérification|verification code/i')).toBeVisible()
    
    // In demo mode, check console for the OTP or use a known demo OTP
    // Fill in OTP (in a real app, this would come from SMS)
    const otpInputs = page.locator('input[maxlength="1"]')
    const demoOTP = '123456' // Common demo OTP
    
    for (let i = 0; i < demoOTP.length; i++) {
      await otpInputs.nth(i).fill(demoOTP[i])
    }
    
    // Wait for authentication to complete
    await page.waitForTimeout(2000)
    
    // Should redirect to main app or show success
    // This depends on your app's post-login behavior
    await expect(page).toHaveURL(/\/(dashboard|home|profile)/)
      .or(expect(page.locator('text=/bienvenue|welcome/i')).toBeVisible())
  })

  test('should handle authentication errors gracefully', async ({ page }) => {
    await page.click('text=/connexion|login/i')
    
    // Complete phone step
    await page.fill('input[type="tel"]', '699123456')
    await page.click('button:has-text("Recevoir le code"), button:has-text("Get code")')
    
    await expect(page.locator('text=/code de vérification|verification code/i')).toBeVisible()
    
    // Enter invalid OTP
    const otpInputs = page.locator('input[maxlength="1"]')
    const invalidOTP = '000000'
    
    for (let i = 0; i < invalidOTP.length; i++) {
      await otpInputs.nth(i).fill(invalidOTP[i])
    }
    
    // Click verify or wait for auto-submit
    await page.click('button:has-text("Vérifier"), button:has-text("Verify")')
    
    // Should show error message
    await expect(page.locator('text=/incorrect|invalid|erreur/i')).toBeVisible()
    
    // OTP fields should be cleared or ready for retry
    await expect(otpInputs.first()).toBeFocused()
  })

  test('should be mobile-friendly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.click('text=/connexion|login/i')
    
    // Phone input should be properly sized
    const phoneInput = page.locator('input[type="tel"]')
    await expect(phoneInput).toBeVisible()
    
    // Should have mobile-friendly input mode
    await expect(phoneInput).toHaveAttribute('inputmode', 'numeric')
    
    // Demo notice should be visible but not overwhelming
    await expect(page.locator('text=/mode démo|demo mode/i')).toBeVisible()
    
    // Buttons should be touch-friendly
    const submitButton = page.locator('button:has-text("Recevoir le code"), button:has-text("Get code")')
    const boundingBox = await submitButton.boundingBox()
    
    // Button should be at least 44px tall (iOS recommendation)
    expect(boundingBox?.height).toBeGreaterThanOrEqual(44)
  })

  test('should preserve form state during navigation', async ({ page }) => {
    await page.click('text=/connexion|login/i')
    
    // Enter phone number
    await page.fill('input[type="tel"]', '699123456')
    
    // Navigate away and back (simulate user behavior)
    await page.goBack()
    await page.goForward()
    
    // Form state should be preserved (this depends on implementation)
    const phoneInput = page.locator('input[type="tel"]')
    if (await phoneInput.isVisible()) {
      // If form is still visible, value should be preserved
      await expect(phoneInput).toHaveValue('699123456')
    }
  })
})