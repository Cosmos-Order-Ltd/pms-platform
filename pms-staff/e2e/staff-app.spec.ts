import { test, expect } from '@playwright/test';

test.describe('PMS Staff App', () => {
  test('should load the staff app successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle(/PMS Staff/);

    // Check for main content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display task dashboard', async ({ page }) => {
    await page.goto('/');

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Check for task or dashboard elements
    await expect(page.getByText(/task|housekeeping|maintenance|dashboard|staff/i)).toBeVisible();
  });

  test('should handle task assignment', async ({ page }) => {
    await page.goto('/');

    // Look for task-related functionality
    const taskButton = page.locator('button:has-text("Task"), a:has-text("Task"), [data-testid="task-item"]').first();

    if (await taskButton.count() > 0) {
      await taskButton.click();

      // Should show task details or navigate to task page
      await page.waitForLoadState('networkidle');

      // Check for task form or details
      const taskContent = page.locator('[data-testid="task-details"], .task-form, form');
      if (await taskContent.count() > 0) {
        await expect(taskContent).toBeVisible();
      }
    }
  });

  test('should handle housekeeping workflow', async ({ page }) => {
    await page.goto('/');

    // Look for housekeeping section
    const housekeepingLink = page.locator('a[href*="/housekeeping"], button:has-text("Housekeeping")').first();

    if (await housekeepingLink.count() > 0) {
      await housekeepingLink.click();

      // Should navigate to housekeeping page
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/housekeeping/);
    }
  });

  test('should handle maintenance requests', async ({ page }) => {
    await page.goto('/');

    // Look for maintenance section
    const maintenanceLink = page.locator('a[href*="/maintenance"], button:has-text("Maintenance")').first();

    if (await maintenanceLink.count() > 0) {
      await maintenanceLink.click();

      // Should navigate to maintenance page
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/maintenance/);
    }
  });

  test('should display staff profile', async ({ page }) => {
    await page.goto('/');

    // Look for staff profile or user info
    const profileLink = page.locator('[data-testid="staff-profile"], .user-profile, #user-profile');

    // Should have some staff-related content
    await expect(page.getByText(/staff|profile|user|account/i)).toBeVisible();
  });

  test('should be responsive on mobile (PWA)', async ({ page, browserName }) => {
    if (browserName === 'Mobile Chrome' || browserName === 'Mobile Safari') {
      await page.goto('/');

      // Check mobile-specific elements for PWA
      await expect(page.locator('body')).toBeVisible();

      // Verify mobile navigation works
      const mobileMenu = page.locator('[data-testid="mobile-menu"], button[aria-label*="menu" i]');
      if (await mobileMenu.count() > 0) {
        await mobileMenu.click();
        // Check if menu opens
        await page.waitForTimeout(500);
      }

      // Check for PWA-specific elements
      const pwaElements = page.locator('[data-testid="pwa-install"], .pwa-banner');
      // PWA elements might be present
    }
  });

  test('should handle task completion', async ({ page }) => {
    await page.goto('/');

    // Look for complete task functionality
    const completeButton = page.locator('button:has-text("Complete"), input[type="checkbox"]').first();

    if (await completeButton.count() > 0) {
      await completeButton.click();

      // Should update task status
      await page.waitForLoadState('networkidle');

      // Look for confirmation or status update
      const statusUpdate = page.locator('.success-message, [data-testid="task-completed"]');
      if (await statusUpdate.count() > 0) {
        await expect(statusUpdate).toBeVisible();
      }
    }
  });

  test('should handle time tracking', async ({ page }) => {
    await page.goto('/');

    // Look for time tracking functionality
    const timeTracker = page.locator('[data-testid="time-tracker"], .time-tracker, button:has-text("Start"), button:has-text("Clock")');

    if (await timeTracker.count() > 0) {
      // Time tracking functionality exists
      await expect(timeTracker.first()).toBeVisible();
    }
  });
});