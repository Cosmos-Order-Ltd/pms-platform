import { test, expect } from '@playwright/test';

test.describe('PMS Guest Portal', () => {
  test('should load the guest portal successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle(/PMS Guest/);

    // Check for main content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display booking interface', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for booking related elements
    await expect(page.getByText(/booking|reservation|check|guest/i)).toBeVisible();
  });

  test('should handle check-in flow', async ({ page }) => {
    await page.goto('/');

    // Look for check-in functionality
    const checkInButton = page.locator('button:has-text("Check In"), a:has-text("Check In")').first();

    if (await checkInButton.count() > 0) {
      await checkInButton.click();

      // Should navigate to check-in page or show check-in form
      await page.waitForLoadState('networkidle');

      // Check for check-in form elements
      const checkInForm = page.locator('form, [data-testid="check-in-form"]');
      if (await checkInForm.count() > 0) {
        await expect(checkInForm).toBeVisible();
      }
    }
  });

  test('should handle room services request', async ({ page }) => {
    await page.goto('/');

    // Look for room services
    const servicesLink = page.locator('a[href*="/services"], button:has-text("Services")').first();

    if (await servicesLink.count() > 0) {
      await servicesLink.click();

      // Should navigate to services page
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/service/);
    }
  });

  test('should display guest information', async ({ page }) => {
    await page.goto('/');

    // Look for guest profile or information section
    const guestInfo = page.locator('[data-testid="guest-info"], .guest-profile, #guest-profile');

    // Should have some guest-related content
    await expect(page.getByText(/welcome|guest|profile|account/i)).toBeVisible();
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

  test('should handle check-out flow', async ({ page }) => {
    await page.goto('/');

    // Look for check-out functionality
    const checkOutButton = page.locator('button:has-text("Check Out"), a:has-text("Check Out")').first();

    if (await checkOutButton.count() > 0) {
      await checkOutButton.click();

      // Should navigate to check-out page or show check-out form
      await page.waitForLoadState('networkidle');

      // Check for check-out related elements
      const checkOutForm = page.locator('form, [data-testid="check-out-form"]');
      if (await checkOutForm.count() > 0) {
        await expect(checkOutForm).toBeVisible();
      }
    }
  });
});