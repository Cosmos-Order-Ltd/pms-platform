# Test info

- Name: Navigation Tests >> main application pages load
- Location: C:\Users\User\Desktop\pms\e2e\navigation.spec.ts:55:7

# Error details

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://127.0.0.1:3005/housekeeping", waiting until "load"

    at C:\Users\User\Desktop\pms\e2e\navigation.spec.ts:70:18
```

# Test source

```ts
   1 | import { expect, test } from "@playwright/test"
   2 |
   3 | test.describe("Navigation Tests", () => {
   4 |   test("homepage loads correctly", async ({ page }) => {
   5 |     await page.goto("/")
   6 |     await expect(page).toHaveTitle(/Cyprus PMS/)
   7 |     await expect(page.locator("h1")).toContainText("Property Management System")
   8 |   })
   9 |
   10 |   test("main navigation links work", async ({ page }) => {
   11 |     await page.goto("/")
   12 |
   13 |     // Test "Get Started" button
   14 |     await page.click("text=Get Started")
   15 |     await expect(page).toHaveURL(/\/auth\/signup/)
   16 |
   17 |     // Test "Schedule Demo" link
   18 |     await page.goto("/")
   19 |     await page.click("text=Schedule Demo")
   20 |     await expect(page).toHaveURL(/\/contact/)
   21 |
   22 |     // Test "Sign In" link
   23 |     await page.goto("/")
   24 |     await page.click("text=Sign In")
   25 |     await expect(page).toHaveURL(/\/auth\/signin/)
   26 |   })
   27 |
   28 |   test("authentication pages navigation", async ({ page }) => {
   29 |     // Test signup page
   30 |     await page.goto("/auth/signup")
   31 |     await expect(page).toHaveTitle(/Cyprus PMS/)
   32 |     await expect(page.locator("h2")).toContainText("Start your free trial")
   33 |
   34 |     // Navigate to sign in from signup
   35 |     await page.click("text=Sign in")
   36 |     await expect(page).toHaveURL(/\/auth\/signin/)
   37 |
   38 |     // Test sign in page
   39 |     await expect(page.locator("h2")).toContainText("Sign in to your account")
   40 |
   41 |     // Navigate back to signup
   42 |     await page.click("text=Start your free trial")
   43 |     await expect(page).toHaveURL(/\/auth\/signup/)
   44 |
   45 |     // Test forgot password link
   46 |     await page.goto("/auth/signin")
   47 |     await page.click("text=Forgot your password?")
   48 |     await expect(page).toHaveURL(/\/auth\/forgot-password/)
   49 |
   50 |     // Test back to homepage links
   51 |     await page.click("text=← Back to homepage")
   52 |     await expect(page).toHaveURL(/\/$/)
   53 |   })
   54 |
   55 |   test("main application pages load", async ({ page }) => {
   56 |     const pages = [
   57 |       { path: "/dashboard", title: "Dashboard" },
   58 |       { path: "/reservations", title: "Reservations" },
   59 |       { path: "/reservations/new", title: "New Reservation" },
   60 |       { path: "/rooms", title: "Room Management" },
   61 |       { path: "/guests", title: "Guest Management" },
   62 |       { path: "/housekeeping", title: "Housekeeping" },
   63 |       { path: "/maintenance", title: "Maintenance" },
   64 |       { path: "/analytics", title: "Analytics" },
   65 |       { path: "/business-intelligence", title: "Business Intelligence" },
   66 |       { path: "/contact", title: "Contact Cyprus PMS" },
   67 |     ]
   68 |
   69 |     for (const pageInfo of pages) {
>  70 |       await page.goto(pageInfo.path)
      |                  ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
   71 |       await expect(page.locator("h1")).toContainText(pageInfo.title)
   72 |     }
   73 |   })
   74 |
   75 |   test("legal pages load correctly", async ({ page }) => {
   76 |     // Test terms page
   77 |     await page.goto("/terms")
   78 |     await expect(page).toHaveTitle(/Terms/)
   79 |     await expect(page.locator("h1")).toContainText("Terms of Service")
   80 |
   81 |     // Test privacy page
   82 |     await page.goto("/privacy")
   83 |     await expect(page).toHaveTitle(/Privacy/)
   84 |     await expect(page.locator("h1")).toContainText("Privacy Policy")
   85 |
   86 |     // Test cross-navigation
   87 |     await page.click("text=Terms of Service")
   88 |     await expect(page).toHaveURL(/\/terms/)
   89 |
   90 |     await page.goto("/privacy")
   91 |     await page.click("text=Contact Us")
   92 |     await expect(page).toHaveURL(/\/contact/)
   93 |   })
   94 |
   95 |   test("responsive navigation works on mobile", async ({ page }) => {
   96 |     // Set mobile viewport
   97 |     await page.setViewportSize({ width: 375, height: 667 })
   98 |
   99 |     await page.goto("/")
  100 |     await expect(page.locator("h1")).toContainText("Property Management System")
  101 |
  102 |     // Test mobile-specific elements work
  103 |     await page.goto("/contact")
  104 |     await expect(page.locator("h1")).toContainText("Contact Cyprus PMS")
  105 |
  106 |     // Reset viewport
  107 |     await page.setViewportSize({ width: 1280, height: 720 })
  108 |   })
  109 | })
```