import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Setup code that runs once before all tests
  console.log('🚀 Setting up E2E test environment...')
  
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // Check if the development server is running
    await page.goto('http://localhost:3000', { timeout: 30000 })
    console.log('✅ Development server is running')
    
    // Setup test data if needed
    // You could seed the database, create test users, etc.
    
    // Check if Supabase connection works (optional)
    // This is just checking the homepage loads
    await page.waitForSelector('main', { timeout: 10000 })
    console.log('✅ Main page loads successfully')
    
  } catch (error) {
    console.error('❌ Failed to setup E2E environment:', error)
    throw error
  } finally {
    await browser.close()
  }
  
  console.log('✅ E2E setup complete')
}

export default globalSetup