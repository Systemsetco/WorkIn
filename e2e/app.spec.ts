import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SAMPLE_LINKEDIN_URL = 'https://www.linkedin.com/jobs/search/?keywords=developer&currentJobId=123';

test.describe('LinkedIn Job Time Modifier', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct title and heading', async ({ page }) => {
    await expect(page).toHaveTitle(/LinkedIn Job Time Modifier/);
    await expect(page.getByRole('heading', { name: 'LinkedIn Job Time Modifier' })).toBeVisible();
  });

  test('should allow pasting and generating modified URL', async ({ page }) => {
    // Fill in URL
    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await urlInput.fill(SAMPLE_LINKEDIN_URL);

    // Select a preset
    await page.getByRole('button', { name: /Set time to 1h/i }).click();

    // Generate
    await page.getByRole('button', { name: /Generate modified URL/i }).click();

    // Check that modified URL is shown
    await expect(page.getByText(/Modified URL Ready/i)).toBeVisible();
    
    // Verify the modified URL contains f_TPR parameter
    const modifiedUrlCode = page.locator('code').filter({ hasText: /f_TPR=r3600/ });
    await expect(modifiedUrlCode).toBeVisible();
  });

  test('should show error for invalid URL', async ({ page }) => {
    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await urlInput.fill('not a valid url');

    await page.getByRole('button', { name: /Generate modified URL/i }).click();

    await expect(page.getByRole('alert')).toContainText(/Invalid URL/i);
  });

  test('should show error for non-LinkedIn URL', async ({ page }) => {
    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await urlInput.fill('https://www.google.com/search');

    await page.getByRole('button', { name: /Generate modified URL/i }).click();

    await expect(page.getByRole('alert')).toContainText(/Not a LinkedIn URL/i);
  });

  test('should allow selecting different presets', async ({ page }) => {
    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await urlInput.fill(SAMPLE_LINKEDIN_URL);

    // Test different presets
    const presets = ['15m', '30m', '1h', '2h', '6h', '12h', '24h', '3d', '7d'];
    
    for (const preset of presets) {
      await page.getByRole('button', { name: new RegExp(preset) }).click();
      await expect(page.getByRole('button', { name: new RegExp(preset) })).toHaveAttribute('aria-pressed', 'true');
    }
  });

  test('should allow custom time input', async ({ page }) => {
    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await urlInput.fill(SAMPLE_LINKEDIN_URL);

    // Enter custom value
    await page.getByLabel(/Custom time value/i).fill('5');
    
    // Select hours
    await page.getByLabel(/Time unit/i).click();
    await page.getByRole('option', { name: 'Hours' }).click();

    // Apply
    await page.getByRole('button', { name: /Apply custom time/i }).click();

    // Generate
    await page.getByRole('button', { name: /Generate modified URL/i }).click();

    // Verify result contains r18000 (5 hours = 18000 seconds)
    await expect(page.locator('code').filter({ hasText: /f_TPR=r18000/ })).toBeVisible();
  });

  test('should use slider to adjust time', async ({ page }) => {
    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await urlInput.fill(SAMPLE_LINKEDIN_URL);

    // Get slider
    const slider = page.getByRole('slider', { name: /Time slider/i });
    
    // Move slider (set to middle value)
    await slider.fill('86400'); // 1 day

    // Generate
    await page.getByRole('button', { name: /Generate modified URL/i }).click();

    // Verify result
    await expect(page.locator('code').filter({ hasText: /f_TPR=r86400/ })).toBeVisible();
  });

  test('should copy URL to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await urlInput.fill(SAMPLE_LINKEDIN_URL);

    await page.getByRole('button', { name: /Set time to 1h/i }).click();
    await page.getByRole('button', { name: /Generate modified URL/i }).click();

    // Wait for result to appear
    await expect(page.getByText(/Modified URL Ready/i)).toBeVisible();

    // Click copy button
    await page.getByRole('button', { name: /Copy URL to clipboard/i }).click();

    // Check for toast notification
    await expect(page.getByText(/Link copied/i)).toBeVisible();

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('f_TPR=r3600');
  });

  test('should clear input when clear button is clicked', async ({ page }) => {
    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await urlInput.fill(SAMPLE_LINKEDIN_URL);

    await page.getByRole('button', { name: /Clear input/i }).click();

    await expect(urlInput).toHaveValue('');
  });

  test('should toggle theme', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /Toggle theme/i });
    
    await themeToggle.click();
    
    // Check that theme changed (dark mode applied)
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle back
    await themeToggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should toggle open in new tab switch', async ({ page }) => {
    const toggle = page.getByRole('switch', { name: /Open in new tab toggle/i });
    
    await expect(toggle).toBeChecked();
    
    await toggle.click();
    await expect(toggle).not.toBeChecked();
    
    await toggle.click();
    await expect(toggle).toBeChecked();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Theme toggle
    await page.keyboard.press('Tab'); // URL input
    await page.keyboard.press('Tab'); // Paste button
    await page.keyboard.press('Tab'); // Clear button
    
    // Verify focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should show human-readable time on slider', async ({ page }) => {
    await page.getByLabel(/LinkedIn URL input/i).fill(SAMPLE_LINKEDIN_URL);

    // Check initial value
    await expect(page.getByText(/1 hour/i)).toBeVisible();

    // Change slider
    await page.getByRole('slider').fill('172800'); // 2 days
    
    // Verify human-readable format
    await expect(page.getByText(/2 days/i)).toBeVisible();
  });

  test('should preserve all query parameters', async ({ page }) => {
    const complexUrl = 'https://www.linkedin.com/jobs/search/?currentJobId=123&keywords=python%20developer&location=New%20York&f_TPR=r86400&origin=SEARCH';
    
    await page.getByLabel(/LinkedIn URL input/i).fill(complexUrl);
    await page.getByRole('button', { name: /Set time to 1h/i }).click();
    await page.getByRole('button', { name: /Generate modified URL/i }).click();

    const modifiedUrl = await page.locator('code').textContent();
    
    expect(modifiedUrl).toContain('currentJobId=123');
    expect(modifiedUrl).toContain('keywords=python%20developer');
    expect(modifiedUrl).toContain('location=New%20York');
    expect(modifiedUrl).toContain('origin=SEARCH');
    expect(modifiedUrl).toContain('f_TPR=r3600');
    expect(modifiedUrl).not.toContain('f_TPR=r86400');
  });
});

test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByLabel(/LinkedIn URL input/i)).toBeVisible();
    await expect(page.getByLabel(/Time unit/i)).toBeVisible();
    await expect(page.getByLabel(/Time slider/i)).toBeVisible();
    await expect(page.getByLabel(/Open in new tab toggle/i)).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('LinkedIn Job Time Modifier');
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be usable on mobile', async ({ page }) => {
    await page.goto('/');

    const urlInput = page.getByLabel(/LinkedIn URL input/i);
    await expect(urlInput).toBeVisible();

    await urlInput.fill(SAMPLE_LINKEDIN_URL);
    await page.getByRole('button', { name: /Set time to 1h/i }).click();
    await page.getByRole('button', { name: /Generate modified URL/i }).click();

    await expect(page.getByText(/Modified URL Ready/i)).toBeVisible();
  });
});
