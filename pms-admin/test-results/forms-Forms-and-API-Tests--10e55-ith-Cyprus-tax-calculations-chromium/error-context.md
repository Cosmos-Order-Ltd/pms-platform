# Test info

- Name: Forms and API Tests >> reservation creation with Cyprus tax calculations
- Location: C:\Users\User\Desktop\pms\e2e\forms.spec.ts:85:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)

Locator: locator('[role="status"]')
Expected string: "Reservation created"
Received: <element(s) not found>
Call log:
  - expect.toContainText with timeout 5000ms
  - waiting for locator('[role="status"]')
    8 × locator resolved to <div role="status" aria-live="polite" class="go3958317564">All required fields must be filled</div>
      - unexpected value "All required fields must be filled"

    at C:\Users\User\Desktop\pms\e2e\forms.spec.ts:117:32
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
  - link "All Reservations":
    - /url: /reservations
  - link "New Reservation":
    - /url: /reservations/new
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
  - heading "New Reservation" [level=1]
  - paragraph: Create a new guest reservation
  - link "← Back to Reservations":
    - /url: /reservations
  - heading "Guest Information" [level=2]
  - text: First Name *
  - textbox "First Name *": Maria
  - text: Last Name *
  - textbox "Last Name *": Georgiou
  - text: Email Address *
  - textbox "Email Address *": maria@example.com
  - text: Phone Number
  - textbox "Phone Number": +357 99 987654
  - text: Nationality
  - combobox "Nationality":
    - option "Select nationality"
    - option "Cyprus" [selected]
    - option "Greece"
    - option "Turkey"
    - option "United Kingdom"
    - option "Germany"
    - option "Russia"
    - option "France"
    - option "Italy"
  - heading "Reservation Details" [level=2]
  - text: Check-in Date *
  - textbox "Check-in Date *": 2025-09-15
  - text: Check-out Date *
  - textbox "Check-out Date *": 2025-09-17
  - text: Nights
  - spinbutton "Nights": "2"
  - text: Adults *
  - combobox "Adults *":
    - option "1 Adult"
    - option "2 Adults" [selected]
    - option "3 Adults"
    - option "4 Adults"
  - text: Children
  - combobox "Children":
    - option "No children" [selected]
    - option "1 Child"
    - option "2 Children"
    - option "3 Children"
  - text: Room Type *
  - combobox "Room Type *":
    - option "Select room type"
    - option "Standard Room - €80/night"
    - option "Deluxe Room - €120/night" [selected]
    - option "Suite - €200/night"
    - option "Family Room - €150/night"
  - heading "Available Rooms" [level=2]
  - text: Room 101
  - radio
  - paragraph: Standard
  - paragraph: €80/night
  - text: Available Room 205
  - radio [checked]
  - paragraph: Deluxe
  - paragraph: €120/night
  - text: Available Room 310
  - radio [disabled]
  - paragraph: Suite
  - paragraph: €200/night
  - text: Occupied Room 207
  - radio
  - paragraph: Family
  - paragraph: €150/night
  - text: Available
  - heading "Special Requests" [level=2]
  - text: Additional Notes
  - textbox "Additional Notes"
  - checkbox "Early Check-in"
  - text: Early Check-in
  - checkbox "Late Check-out"
  - text: Late Check-out
  - checkbox "Airport Transfer"
  - text: Airport Transfer
  - checkbox "Ground Floor"
  - text: Ground Floor
  - heading "Pricing Summary" [level=2]
  - text: Room Rate (2 nights × €120) €240.00 Tourism Tax (€1.50 per person/night) €6.00 VAT (19%) €55.62 Total Amount €292.74
  - button "Save as Draft"
  - button "Create Reservation"
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   17 |     // Submit the form
   18 |     await page.click('button[type="submit"]')
   19 |
   20 |     // Wait for success message and redirect
   21 |     await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
   22 |     await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 10000 })
   23 |   })
   24 |
   25 |   test("signup form validation works", async ({ page }) => {
   26 |     await page.goto("/auth/signup")
   27 |
   28 |     // Try to submit without required fields
   29 |     await page.click('button[type="submit"]')
   30 |
   31 |     // Check that form doesn't submit (stays on same page)
   32 |     await expect(page).toHaveURL(/\/auth\/signup/)
   33 |
   34 |     // Test password mismatch
   35 |     await page.fill('input[name="firstName"]', "Test")
   36 |     await page.fill('input[name="lastName"]', "User")
   37 |     await page.fill('input[name="email"]', "test@example.com")
   38 |     await page.fill('input[name="propertyName"]', "Test Hotel")
   39 |     await page.selectOption('select[name="propertyType"]', "hotel")
   40 |     await page.fill('input[name="password"]', "password123")
   41 |     await page.fill('input[name="confirmPassword"]', "different")
   42 |     await page.check('input[name="agreeTerms"]')
   43 |
   44 |     await page.click('button[type="submit"]')
   45 |
   46 |     // Should show error message
   47 |     await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 5000 })
   48 |   })
   49 |
   50 |   test("signin form works", async ({ page }) => {
   51 |     await page.goto("/auth/signin")
   52 |
   53 |     // Fill out the form with demo credentials
   54 |     await page.fill('input[name="email"]', "demo@cypruspms.com")
   55 |     await page.fill('input[name="password"]', "demo123")
   56 |
   57 |     // Submit the form
   58 |     await page.click('button[type="submit"]')
   59 |
   60 |     // Wait for success message and redirect
   61 |     await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
   62 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
   63 |   })
   64 |
   65 |   test("contact form submission works", async ({ page }) => {
   66 |     await page.goto("/contact")
   67 |
   68 |     // Fill out the form
   69 |     await page.fill('input[name="firstName"]', "John")
   70 |     await page.fill('input[name="lastName"]', "Doe")
   71 |     await page.fill('input[name="email"]', "john.doe@example.com")
   72 |     await page.fill('input[name="phone"]', "+357 99 123456")
   73 |     await page.fill('input[name="property"]', "Test Resort")
   74 |     await page.selectOption('select[name="propertyType"]', "resort")
   75 |     await page.selectOption('select[name="requestType"]', "demo")
   76 |     await page.fill('textarea[name="message"]', "I would like to schedule a demo of your PMS system.")
   77 |
   78 |     // Submit the form
   79 |     await page.click('button[type="submit"]')
   80 |
   81 |     // Wait for success message
   82 |     await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
   83 |   })
   84 |
   85 |   test("reservation creation with Cyprus tax calculations", async ({ page }) => {
   86 |     await page.goto("/reservations/new")
   87 |
   88 |     // Fill out the reservation form
   89 |     await page.fill('input[name="firstName"]', "Maria")
   90 |     await page.fill('input[name="lastName"]', "Georgiou")
   91 |     await page.fill('input[name="email"]', "maria@example.com")
   92 |     await page.fill('input[name="phone"]', "+357 99 987654")
   93 |     await page.selectOption('select[name="nationality"]', "Cyprus")
   94 |
   95 |     // Set future dates
   96 |     const tomorrow = new Date()
   97 |     tomorrow.setDate(tomorrow.getDate() + 1)
   98 |     const dayAfter = new Date()
   99 |     dayAfter.setDate(dayAfter.getDate() + 3)
  100 |
  101 |     await page.fill('input[name="checkIn"]', tomorrow.toISOString().split('T')[0])
  102 |     await page.fill('input[name="checkOut"]', dayAfter.toISOString().split('T')[0])
  103 |
  104 |     await page.selectOption('select[name="adults"]', "2")
  105 |     await page.selectOption('select[name="children"]', "0")
  106 |     await page.selectOption('select[name="roomType"]', "DELUXE")
  107 |     await page.click('input[name="selectedRoom"][value="205"]')
  108 |
  109 |     // Submit the form
  110 |     await page.click('button[type="submit"]')
  111 |
  112 |     // Wait for success message with Cyprus-specific pricing
  113 |     await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
  114 |
  115 |     // Verify the success message contains reservation details
  116 |     const successToast = page.locator('[role="status"]')
> 117 |     await expect(successToast).toContainText("Reservation created")
      |                                ^ Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)
  118 |   })
  119 |
  120 |   test("forgot password flow works", async ({ page }) => {
  121 |     await page.goto("/auth/forgot-password")
  122 |
  123 |     // Test the form exists
  124 |     await expect(page.locator('input[name="email"]')).toBeVisible()
  125 |
  126 |     // Fill out email
  127 |     await page.fill('input[name="email"]', "test@example.com")
  128 |
  129 |     // Submit the form
  130 |     await page.click('button[type="submit"]')
  131 |
  132 |     // Should show success state
  133 |     await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 10000 })
  134 |   })
  135 |
  136 |   test("API endpoints respond correctly", async ({ page }) => {
  137 |     // Test signup API directly
  138 |     const signupResponse = await page.request.post("/api/auth/signup", {
  139 |       data: {
  140 |         firstName: "API",
  141 |         lastName: "Test",
  142 |         email: "api@test.com",
  143 |         password: "test123",
  144 |         confirmPassword: "test123",
  145 |         propertyName: "API Test Hotel",
  146 |         propertyType: "hotel",
  147 |         agreeTerms: true
  148 |       }
  149 |     })
  150 |
  151 |     expect(signupResponse.status()).toBe(200)
  152 |     const signupData = await signupResponse.json()
  153 |     expect(signupData.success).toBe(true)
  154 |
  155 |     // Test signin API
  156 |     const signinResponse = await page.request.post("/api/auth/signin", {
  157 |       data: {
  158 |         email: "demo@cypruspms.com",
  159 |         password: "demo123",
  160 |         rememberMe: false
  161 |       }
  162 |     })
  163 |
  164 |     expect(signinResponse.status()).toBe(200)
  165 |     const signinData = await signinResponse.json()
  166 |     expect(signinData.success).toBe(true)
  167 |
  168 |     // Test contact API
  169 |     const contactResponse = await page.request.post("/api/contact", {
  170 |       data: {
  171 |         firstName: "API",
  172 |         lastName: "Contact",
  173 |         email: "contact@test.com",
  174 |         phone: "+357 99 123456",
  175 |         property: "API Test Hotel",
  176 |         propertyType: "hotel",
  177 |         requestType: "demo",
  178 |         message: "API test message"
  179 |       }
  180 |     })
  181 |
  182 |     expect(contactResponse.status()).toBe(200)
  183 |     const contactData = await contactResponse.json()
  184 |     expect(contactData.success).toBe(true)
  185 |
  186 |     // Test reservations API
  187 |     const reservationResponse = await page.request.post("/api/reservations", {
  188 |       data: {
  189 |         firstName: "API",
  190 |         lastName: "Guest",
  191 |         email: "guest@test.com",
  192 |         phone: "+357 99 123456",
  193 |         nationality: "Cyprus",
  194 |         checkIn: "2025-12-15",
  195 |         checkOut: "2025-12-17",
  196 |         adults: "2",
  197 |         children: "0",
  198 |         roomType: "DELUXE",
  199 |         selectedRoom: "205",
  200 |         specialRequests: "API test booking"
  201 |       }
  202 |     })
  203 |
  204 |     expect(reservationResponse.status()).toBe(200)
  205 |     const reservationData = await reservationResponse.json()
  206 |     expect(reservationData.success).toBe(true)
  207 |     expect(reservationData.reservation.pricing.tourismTax).toBe(6) // €1.50 * 2 adults * 2 nights
  208 |     expect(reservationData.reservation.pricing.vat).toBeGreaterThan(0) // Cyprus VAT 19%
  209 |   })
  210 | })
```