import { expect, test } from "@playwright/test"

test.describe("Navigation Tests", () => {
  test("homepage loads correctly", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Cyprus PMS/)
    await expect(page.locator("h1")).toContainText("Property Management System")
  })

  test("main navigation links work", async ({ page }) => {
    await page.goto("/")

    // Test "Get Started" button
    await page.click("text=Get Started")
    await expect(page).toHaveURL(/\/auth\/signup/)

    // Test "Schedule Demo" link
    await page.goto("/")
    await page.click("text=Schedule Demo")
    await expect(page).toHaveURL(/\/contact/)

    // Test "Sign In" link
    await page.goto("/")
    await page.click("text=Sign In")
    await expect(page).toHaveURL(/\/auth\/signin/)
  })

  test("authentication pages navigation", async ({ page }) => {
    // Test signup page
    await page.goto("/auth/signup")
    await expect(page).toHaveTitle(/Cyprus PMS/)
    await expect(page.locator("h2")).toContainText("Start your free trial")

    // Navigate to sign in from signup
    await page.click("text=Sign in")
    await expect(page).toHaveURL(/\/auth\/signin/)

    // Test sign in page
    await expect(page.locator("h2")).toContainText("Sign in to your account")

    // Navigate back to signup
    await page.click("text=Start your free trial")
    await expect(page).toHaveURL(/\/auth\/signup/)

    // Test forgot password link
    await page.goto("/auth/signin")
    await page.click("text=Forgot your password?")
    await expect(page).toHaveURL(/\/auth\/forgot-password/)

    // Test back to homepage links
    await page.click("text=← Back to homepage")
    await expect(page).toHaveURL(/\/$/)
  })

  test("main application pages load", async ({ page }) => {
    const pages = [
      { path: "/dashboard", title: "Dashboard" },
      { path: "/reservations", title: "Reservations" },
      { path: "/reservations/new", title: "New Reservation" },
      { path: "/rooms", title: "Room Management" },
      { path: "/guests", title: "Guest Management" },
      { path: "/housekeeping", title: "Housekeeping" },
      { path: "/maintenance", title: "Maintenance" },
      { path: "/analytics", title: "Analytics" },
      { path: "/business-intelligence", title: "Business Intelligence" },
      { path: "/contact", title: "Contact Cyprus PMS" },
    ]

    for (const pageInfo of pages) {
      await page.goto(pageInfo.path)
      await expect(page.locator("h1")).toContainText(pageInfo.title)
    }
  })

  test("legal pages load correctly", async ({ page }) => {
    // Test terms page
    await page.goto("/terms")
    await expect(page).toHaveTitle(/Terms/)
    await expect(page.locator("h1")).toContainText("Terms of Service")

    // Test privacy page
    await page.goto("/privacy")
    await expect(page).toHaveTitle(/Privacy/)
    await expect(page.locator("h1")).toContainText("Privacy Policy")

    // Test cross-navigation
    await page.click("text=Terms of Service")
    await expect(page).toHaveURL(/\/terms/)

    await page.goto("/privacy")
    await page.click("text=Contact Us")
    await expect(page).toHaveURL(/\/contact/)
  })

  test("responsive navigation works on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto("/")
    await expect(page.locator("h1")).toContainText("Property Management System")

    // Test mobile-specific elements work
    await page.goto("/contact")
    await expect(page.locator("h1")).toContainText("Contact Cyprus PMS")

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 })
  })
})