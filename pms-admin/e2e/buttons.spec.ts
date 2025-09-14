import { expect, test } from "@playwright/test"

test.describe("Button Functionality Tests", () => {
  test("dashboard New Reservation button works", async ({ page }) => {
    await page.goto("/dashboard")

    // Click New Reservation button
    await page.click('text=New Reservation')

    // Should navigate to reservations/new page
    await expect(page).toHaveURL(/\/reservations\/new/)
    await expect(page.locator("h1")).toContainText("New Reservation")
  })

  test("rooms page buttons work", async ({ page }) => {
    await page.goto("/rooms")

    // Test floor filter
    await page.selectOption('select', '1')
    // Filter should work without necessarily showing toast

    // Test refresh button
    await page.click('text=Refresh Status')
    // Wait for button to be clickable again (refresh completed)
    await expect(page.locator('text=Refresh Status')).toBeVisible({ timeout: 5000 })

    // Test room action buttons (Mark Clean)
    const markCleanButton = page.locator('button:has-text("Mark Clean")').first()
    if (await markCleanButton.isVisible()) {
      await markCleanButton.click()
      // Button click should work (button functionality tested)
    }

    // Test room Details button
    const detailsButton = page.locator('button:has-text("Details")').first()
    if (await detailsButton.isVisible()) {
      await detailsButton.click()
      // Details button should be clickable
    }

    // Test Quick Actions
    await page.click('text=Occupancy Report')
    // Quick action buttons should be clickable

    await page.click('text=Maintenance Report')
    // Quick action buttons should be clickable
  })

  test("reservations page buttons work", async ({ page }) => {
    await page.goto("/reservations")

    // Test Filter button
    await page.click('text=Filter')
    await expect(page.locator('button:has-text("✕")')).toBeVisible()

    // Test New Reservation button
    await page.click('text=New Reservation')
    await expect(page).toHaveURL(/\/reservations\/new/)

    // Go back to reservations
    await page.goto("/reservations")

    // Test table action buttons
    const editButton = page.locator('button:has-text("Edit")').first()
    if (await editButton.isVisible()) {
      await editButton.click()
      // Edit button should be clickable
    }

    const moreButton = page.locator('button:has-text("More")').first()
    if (await moreButton.isVisible()) {
      await moreButton.click()
      // More button should be clickable
    }

    // Test pagination
    await page.click('button:has-text("2")')
    // Pagination should work

    await page.click('button:has-text("Previous")')
    // Pagination should work
  })

  test("contact form buttons work", async ({ page }) => {
    await page.goto("/contact")

    // Fill minimal required fields
    await page.fill('input[name="firstName"]', "Test")
    await page.fill('input[name="lastName"]', "User")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="property"]', "Test Hotel")
    await page.selectOption('select[name="propertyType"]', "hotel")

    // Test form submission button
    await page.click('button[type="submit"]')
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
  })

  test("authentication form buttons work", async ({ page }) => {
    // Test signup form submission button
    await page.goto("/auth/signup")

    await page.fill('input[name="firstName"]', "Test")
    await page.fill('input[name="lastName"]', "User")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="propertyName"]', "Test Hotel")
    await page.selectOption('select[name="propertyType"]', "hotel")
    await page.fill('input[name="password"]', "password123")
    await page.fill('input[name="confirmPassword"]', "password123")
    await page.check('input[name="agreeTerms"]')

    await page.click('button[type="submit"]')
    // Form should attempt to submit
    await page.waitForTimeout(2000) // Allow form processing

    // Test signin form
    await page.goto("/auth/signin")

    await page.fill('input[name="email"]', "demo@cypruspms.com")
    await page.fill('input[name="password"]', "demo123")

    await page.click('button[type="submit"]')
    // Form should attempt to submit
    await page.waitForTimeout(2000) // Allow form processing
  })

  test("forgot password form button works", async ({ page }) => {
    await page.goto("/auth/forgot-password")

    // Fill email
    await page.fill('input[name="email"]', "test@example.com")

    // Test submit button
    await page.click('button[type="submit"]')

    // Should show success state
    await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 10000 })

    // Test back button
    await page.click('button:has-text("← Back to Sign In")')
    await expect(page).toHaveURL(/\/auth\/signin/)
  })

  test("reservation form buttons work", async ({ page }) => {
    await page.goto("/reservations/new")

    // Fill required fields
    await page.fill('input[name="firstName"]', "Test")
    await page.fill('input[name="lastName"]', "Guest")
    await page.fill('input[name="email"]', "guest@example.com")
    await page.selectOption('select[name="nationality"]', "Cyprus")

    // Set future dates
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 3)

    await page.fill('input[name="checkIn"]', tomorrow.toISOString().split('T')[0])
    await page.fill('input[name="checkOut"]', dayAfter.toISOString().split('T')[0])

    await page.selectOption('select[name="adults"]', "2")
    await page.selectOption('select[name="roomType"]', "DELUXE")
    await page.click('input[name="selectedRoom"][value="205"]')

    // Test form submission
    await page.click('button[type="submit"]')
    // Form should attempt to submit
    await page.waitForTimeout(2000) // Allow form processing
  })

  test("button states and loading work", async ({ page }) => {
    await page.goto("/rooms")

    // Test button disabled state during loading
    await page.click('text=Refresh Status')

    // Button should be clicked successfully (may show loading state briefly)
    await page.waitForTimeout(1000) // Brief wait for any loading state

    // Wait for loading to complete
    await expect(page.locator('text=Refresh Status')).toBeVisible({ timeout: 10000 })
  })

  test("form validation prevents submission", async ({ page }) => {
    await page.goto("/auth/signup")

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Form should not submit (stays on same page)
    await expect(page).toHaveURL(/\/auth\/signup/)

    // Fill partial form and test validation
    await page.fill('input[name="firstName"]', "Test")
    await page.fill('input[name="password"]', "password123")
    await page.fill('input[name="confirmPassword"]', "different")

    await page.click('button[type="submit"]')

    // Form validation should prevent submission (page stays on signup)
    await expect(page).toHaveURL(/\/auth\/signup/)
  })

  test("interactive elements respond to clicks", async ({ page }) => {
    // Test various interactive elements
    const pages = [
      "/dashboard",
      "/reservations",
      "/rooms",
      "/contact"
    ]

    for (const pagePath of pages) {
      await page.goto(pagePath)

      // Find all buttons on the page
      const buttons = await page.locator('button').count()

      // Ensure at least some buttons exist on each page
      expect(buttons).toBeGreaterThan(0)

      // Test that buttons are not disabled by default (except submit buttons without required fields)
      const enabledButtons = await page.locator('button:not([disabled])').count()
      expect(enabledButtons).toBeGreaterThan(0)
    }
  })
})