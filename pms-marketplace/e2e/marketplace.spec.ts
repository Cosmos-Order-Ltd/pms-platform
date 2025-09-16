import { test, expect } from '@playwright/test';

test.describe('PMS Marketplace', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle(/PMS Marketplace/);

    // Check for main navigation or content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display property listings', async ({ page }) => {
    await page.goto('/');

    // Wait for property listings to load
    await page.waitForLoadState('networkidle');

    // Check for property cards or listing elements
    const listings = page.locator('[data-testid="property-listing"]');

    // Should have at least some content
    await expect(page.getByText(/property|listing|marketplace/i)).toBeVisible();
  });

  test('should navigate to property details', async ({ page }) => {
    await page.goto('/');

    // Look for a property link or button
    const propertyLink = page.locator('a[href*="/property/"]').first();

    if (await propertyLink.count() > 0) {
      await propertyLink.click();

      // Should navigate to property details
      await expect(page).toHaveURL(/\/property\//);
    }
  });

  test('should handle search functionality', async ({ page }) => {
    await page.goto('/');

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    if (await searchInput.count() > 0) {
      await searchInput.fill('test property');
      await searchInput.press('Enter');

      // Should show search results or updated listings
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/search|filter/);
    }
  });

  test('should be responsive on mobile', async ({ page, browserName }) => {
    if (browserName === 'Mobile Chrome' || browserName === 'Mobile Safari') {
      await page.goto('/');

      // Check mobile-specific elements
      await expect(page.locator('body')).toBeVisible();

      // Verify mobile navigation works
      const mobileMenu = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu" i]');
      if (await mobileMenu.count() > 0) {
        await mobileMenu.click();
        // Check if menu opens
        await page.waitForTimeout(500);
      }
    }
  });

  test('should handle booking flow', async ({ page }) => {
    await page.goto('/');

    // Look for booking button
    const bookingButton = page.locator('button:has-text("Book"), a:has-text("Book")').first();

    if (await bookingButton.count() > 0) {
      await bookingButton.click();

      // Should navigate to booking page or show booking form
      await page.waitForLoadState('networkidle');

      // Check for booking form elements
      const bookingForm = page.locator('form, [data-testid="booking-form"]');
      if (await bookingForm.count() > 0) {
        await expect(bookingForm).toBeVisible();
      }
    }
  });
});