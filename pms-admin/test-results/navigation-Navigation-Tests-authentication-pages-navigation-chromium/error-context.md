# Test info

- Name: Navigation Tests >> authentication pages navigation
- Location: C:\Users\User\Desktop\pms\e2e\navigation.spec.ts:28:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)

Locator: locator(':root')
Expected pattern: /Cyprus PMS/
Received string:  ""
Call log:
  - expect.toHaveTitle with timeout 5000ms
  - waiting for locator(':root')
    8 × locator resolved to <html lang="en">…</html>
      - unexpected value ""

    at C:\Users\User\Desktop\pms\e2e\navigation.spec.ts:31:24
```

# Page snapshot

```yaml
- navigation:
  - link "🇨🇾 Cyprus PMS":
    - /url: /
  - link "Dashboard":
    - /url: /dashboard
  - link "Reservations":
    - /url: /reservations
  - button
  - link "Rooms":
    - /url: /rooms
  - link "Guests":
    - /url: /guests
  - button
  - link "Operations":
    - /url: /operations
  - button
  - link "Analytics & Reports":
    - /url: /analytics
  - button
  - link "Payments":
    - /url: /payments
  - link "Communications":
    - /url: /communications
  - link "Services":
    - /url: /services
  - link "Staff":
    - /url: /staff
  - link "Integrations":
    - /url: /integrations/channels
  - button
  - link "Compliance":
    - /url: /compliance
  - link "Mobile":
    - /url: /mobile
  - link "Admin":
    - /url: /admin
  - text: Cyprus PMS Property Management System v2.0.0
- main:
  - text: 🇨🇾
  - heading "Cyprus PMS" [level=1]
  - heading "Start your free trial" [level=2]
  - paragraph: Get 14 days of full access, no credit card required
  - text: First Name *
  - textbox "First Name *"
  - text: Last Name *
  - textbox "Last Name *"
  - text: Email address *
  - textbox "Email address *"
  - text: Property Name *
  - textbox "Property Name *"
  - text: Property Type *
  - combobox "Property Type *":
    - option "Select property type" [selected]
    - option "Hotel"
    - option "Resort"
    - option "Apartment Complex"
    - option "Villa Rental"
    - option "Boutique Hotel"
    - option "Other"
  - text: Password *
  - textbox "Password *"
  - text: Confirm Password *
  - textbox "Confirm Password *"
  - checkbox "I agree to the Terms of Service and Privacy Policy"
  - text: I agree to the
  - link "Terms of Service":
    - /url: /terms
  - text: and
  - link "Privacy Policy":
    - /url: /privacy
  - button "Start Free Trial"
  - paragraph:
    - text: Already have an account?
    - link "Sign in":
      - /url: /auth/signin
  - link "← Back to homepage":
    - /url: /
  - heading "Why 200+ Cyprus properties choose us" [level=3]
  - text: ⚡
  - heading "Quick Setup" [level=4]
  - paragraph: Live in 24 hours
  - text: 🇨🇾
  - heading "Cyprus Expert" [level=4]
  - paragraph: Local compliance built-in
  - text: 📞
  - heading "Local Support" [level=4]
  - paragraph: Cyprus-based team
  - text: 💰
  - heading "Free Trial" [level=4]
  - paragraph: No risk, full features
- alert
- button "Open Next.js Dev Tools":
  - img
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
>  31 |     await expect(page).toHaveTitle(/Cyprus PMS/)
      |                        ^ Error: Timed out 5000ms waiting for expect(locator).toHaveTitle(expected)
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
   70 |       await page.goto(pageInfo.path)
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