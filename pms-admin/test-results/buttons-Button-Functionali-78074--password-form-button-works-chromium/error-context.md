# Test info

- Name: Button Functionality Tests >> forgot password form button works
- Location: C:\Users\User\Desktop\pms\e2e\buttons.spec.ts:127:7

# Error details

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("← Back to Sign In")')

    at C:\Users\User\Desktop\pms\e2e\buttons.spec.ts:140:16
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
  - heading "Check Your Email" [level=2]
  - paragraph: We've sent a password reset link to test@example.com
  - text: 📧
  - paragraph: If an account with this email exists, you will receive a password reset link shortly.
  - paragraph: Didn't receive an email?
  - list:
    - listitem: • Check your spam folder
    - listitem: • Make sure you entered the correct email
    - listitem: • Try again in a few minutes
  - button "Try a different email"
  - link "Back to sign in":
    - /url: /auth/signin
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   40 |
   41 |     // Test Quick Actions
   42 |     await page.click('text=Occupancy Report')
   43 |     // Quick action buttons should be clickable
   44 |
   45 |     await page.click('text=Maintenance Report')
   46 |     // Quick action buttons should be clickable
   47 |   })
   48 |
   49 |   test("reservations page buttons work", async ({ page }) => {
   50 |     await page.goto("/reservations")
   51 |
   52 |     // Test Filter button
   53 |     await page.click('text=Filter')
   54 |     await expect(page.locator('button:has-text("✕")')).toBeVisible()
   55 |
   56 |     // Test New Reservation button
   57 |     await page.click('text=New Reservation')
   58 |     await expect(page).toHaveURL(/\/reservations\/new/)
   59 |
   60 |     // Go back to reservations
   61 |     await page.goto("/reservations")
   62 |
   63 |     // Test table action buttons
   64 |     const editButton = page.locator('button:has-text("Edit")').first()
   65 |     if (await editButton.isVisible()) {
   66 |       await editButton.click()
   67 |       // Edit button should be clickable
   68 |     }
   69 |
   70 |     const moreButton = page.locator('button:has-text("More")').first()
   71 |     if (await moreButton.isVisible()) {
   72 |       await moreButton.click()
   73 |       // More button should be clickable
   74 |     }
   75 |
   76 |     // Test pagination
   77 |     await page.click('button:has-text("2")')
   78 |     // Pagination should work
   79 |
   80 |     await page.click('button:has-text("Previous")')
   81 |     // Pagination should work
   82 |   })
   83 |
   84 |   test("contact form buttons work", async ({ page }) => {
   85 |     await page.goto("/contact")
   86 |
   87 |     // Fill minimal required fields
   88 |     await page.fill('input[name="firstName"]', "Test")
   89 |     await page.fill('input[name="lastName"]', "User")
   90 |     await page.fill('input[name="email"]', "test@example.com")
   91 |     await page.fill('input[name="property"]', "Test Hotel")
   92 |     await page.selectOption('select[name="propertyType"]', "hotel")
   93 |
   94 |     // Test form submission button
   95 |     await page.click('button[type="submit"]')
   96 |     await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
   97 |   })
   98 |
   99 |   test("authentication form buttons work", async ({ page }) => {
  100 |     // Test signup form submission button
  101 |     await page.goto("/auth/signup")
  102 |
  103 |     await page.fill('input[name="firstName"]', "Test")
  104 |     await page.fill('input[name="lastName"]', "User")
  105 |     await page.fill('input[name="email"]', "test@example.com")
  106 |     await page.fill('input[name="propertyName"]', "Test Hotel")
  107 |     await page.selectOption('select[name="propertyType"]', "hotel")
  108 |     await page.fill('input[name="password"]', "password123")
  109 |     await page.fill('input[name="confirmPassword"]', "password123")
  110 |     await page.check('input[name="agreeTerms"]')
  111 |
  112 |     await page.click('button[type="submit"]')
  113 |     // Form should attempt to submit
  114 |     await page.waitForTimeout(2000) // Allow form processing
  115 |
  116 |     // Test signin form
  117 |     await page.goto("/auth/signin")
  118 |
  119 |     await page.fill('input[name="email"]', "demo@cypruspms.com")
  120 |     await page.fill('input[name="password"]', "demo123")
  121 |
  122 |     await page.click('button[type="submit"]')
  123 |     // Form should attempt to submit
  124 |     await page.waitForTimeout(2000) // Allow form processing
  125 |   })
  126 |
  127 |   test("forgot password form button works", async ({ page }) => {
  128 |     await page.goto("/auth/forgot-password")
  129 |
  130 |     // Fill email
  131 |     await page.fill('input[name="email"]', "test@example.com")
  132 |
  133 |     // Test submit button
  134 |     await page.click('button[type="submit"]')
  135 |
  136 |     // Should show success state
  137 |     await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 10000 })
  138 |
  139 |     // Test back button
> 140 |     await page.click('button:has-text("← Back to Sign In")')
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  141 |     await expect(page).toHaveURL(/\/auth\/signin/)
  142 |   })
  143 |
  144 |   test("reservation form buttons work", async ({ page }) => {
  145 |     await page.goto("/reservations/new")
  146 |
  147 |     // Fill required fields
  148 |     await page.fill('input[name="firstName"]', "Test")
  149 |     await page.fill('input[name="lastName"]', "Guest")
  150 |     await page.fill('input[name="email"]', "guest@example.com")
  151 |     await page.selectOption('select[name="nationality"]', "Cyprus")
  152 |
  153 |     // Set future dates
  154 |     const tomorrow = new Date()
  155 |     tomorrow.setDate(tomorrow.getDate() + 1)
  156 |     const dayAfter = new Date()
  157 |     dayAfter.setDate(dayAfter.getDate() + 3)
  158 |
  159 |     await page.fill('input[name="checkIn"]', tomorrow.toISOString().split('T')[0])
  160 |     await page.fill('input[name="checkOut"]', dayAfter.toISOString().split('T')[0])
  161 |
  162 |     await page.selectOption('select[name="adults"]', "2")
  163 |     await page.selectOption('select[name="roomType"]', "DELUXE")
  164 |     await page.click('input[name="selectedRoom"][value="205"]')
  165 |
  166 |     // Test form submission
  167 |     await page.click('button[type="submit"]')
  168 |     // Form should attempt to submit
  169 |     await page.waitForTimeout(2000) // Allow form processing
  170 |   })
  171 |
  172 |   test("button states and loading work", async ({ page }) => {
  173 |     await page.goto("/rooms")
  174 |
  175 |     // Test button disabled state during loading
  176 |     await page.click('text=Refresh Status')
  177 |
  178 |     // Button should be clicked successfully (may show loading state briefly)
  179 |     await page.waitForTimeout(1000) // Brief wait for any loading state
  180 |
  181 |     // Wait for loading to complete
  182 |     await expect(page.locator('text=Refresh Status')).toBeVisible({ timeout: 10000 })
  183 |   })
  184 |
  185 |   test("form validation prevents submission", async ({ page }) => {
  186 |     await page.goto("/auth/signup")
  187 |
  188 |     // Try to submit empty form
  189 |     await page.click('button[type="submit"]')
  190 |
  191 |     // Form should not submit (stays on same page)
  192 |     await expect(page).toHaveURL(/\/auth\/signup/)
  193 |
  194 |     // Fill partial form and test validation
  195 |     await page.fill('input[name="firstName"]', "Test")
  196 |     await page.fill('input[name="password"]', "password123")
  197 |     await page.fill('input[name="confirmPassword"]', "different")
  198 |
  199 |     await page.click('button[type="submit"]')
  200 |
  201 |     // Form validation should prevent submission (page stays on signup)
  202 |     await expect(page).toHaveURL(/\/auth\/signup/)
  203 |   })
  204 |
  205 |   test("interactive elements respond to clicks", async ({ page }) => {
  206 |     // Test various interactive elements
  207 |     const pages = [
  208 |       "/dashboard",
  209 |       "/reservations",
  210 |       "/rooms",
  211 |       "/contact"
  212 |     ]
  213 |
  214 |     for (const pagePath of pages) {
  215 |       await page.goto(pagePath)
  216 |
  217 |       // Find all buttons on the page
  218 |       const buttons = await page.locator('button').count()
  219 |
  220 |       // Ensure at least some buttons exist on each page
  221 |       expect(buttons).toBeGreaterThan(0)
  222 |
  223 |       // Test that buttons are not disabled by default (except submit buttons without required fields)
  224 |       const enabledButtons = await page.locator('button:not([disabled])').count()
  225 |       expect(enabledButtons).toBeGreaterThan(0)
  226 |     }
  227 |   })
  228 | })
```