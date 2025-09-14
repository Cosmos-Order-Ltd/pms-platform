import { expect, test } from "@playwright/test"

test.describe("Forms and API Tests", () => {
  test("signup form submission works", async ({ page }) => {
    await page.goto("/auth/signup")

    // Fill out the form
    await page.fill('input[name="firstName"]', "Test")
    await page.fill('input[name="lastName"]', "User")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="propertyName"]', "Test Hotel")
    await page.selectOption('select[name="propertyType"]', "hotel")
    await page.fill('input[name="password"]', "password123")
    await page.fill('input[name="confirmPassword"]', "password123")
    await page.check('input[name="agreeTerms"]')

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success message and redirect
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 10000 })
  })

  test("signup form validation works", async ({ page }) => {
    await page.goto("/auth/signup")

    // Try to submit without required fields
    await page.click('button[type="submit"]')

    // Check that form doesn't submit (stays on same page)
    await expect(page).toHaveURL(/\/auth\/signup/)

    // Test password mismatch
    await page.fill('input[name="firstName"]', "Test")
    await page.fill('input[name="lastName"]', "User")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="propertyName"]', "Test Hotel")
    await page.selectOption('select[name="propertyType"]', "hotel")
    await page.fill('input[name="password"]', "password123")
    await page.fill('input[name="confirmPassword"]', "different")
    await page.check('input[name="agreeTerms"]')

    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 5000 })
  })

  test("signin form works", async ({ page }) => {
    await page.goto("/auth/signin")

    // Fill out the form with demo credentials
    await page.fill('input[name="email"]', "demo@cypruspms.com")
    await page.fill('input[name="password"]', "demo123")

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success message and redirect
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
  })

  test("contact form submission works", async ({ page }) => {
    await page.goto("/contact")

    // Fill out the form
    await page.fill('input[name="firstName"]', "John")
    await page.fill('input[name="lastName"]', "Doe")
    await page.fill('input[name="email"]', "john.doe@example.com")
    await page.fill('input[name="phone"]', "+357 99 123456")
    await page.fill('input[name="property"]', "Test Resort")
    await page.selectOption('select[name="propertyType"]', "resort")
    await page.selectOption('select[name="requestType"]', "demo")
    await page.fill('textarea[name="message"]', "I would like to schedule a demo of your PMS system.")

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })
  })

  test("reservation creation with Cyprus tax calculations", async ({ page }) => {
    await page.goto("/reservations/new")

    // Fill out the reservation form
    await page.fill('input[name="firstName"]', "Maria")
    await page.fill('input[name="lastName"]', "Georgiou")
    await page.fill('input[name="email"]', "maria@example.com")
    await page.fill('input[name="phone"]', "+357 99 987654")
    await page.selectOption('select[name="nationality"]', "Cyprus")

    // Set future dates
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 3)

    await page.fill('input[name="checkIn"]', tomorrow.toISOString().split('T')[0])
    await page.fill('input[name="checkOut"]', dayAfter.toISOString().split('T')[0])

    await page.selectOption('select[name="adults"]', "2")
    await page.selectOption('select[name="children"]', "0")
    await page.selectOption('select[name="roomType"]', "DELUXE")
    await page.click('input[name="selectedRoom"][value="205"]')

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for success message with Cyprus-specific pricing
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 10000 })

    // Verify the success message contains reservation details
    const successToast = page.locator('[role="status"]')
    await expect(successToast).toContainText("Reservation created")
  })

  test("forgot password flow works", async ({ page }) => {
    await page.goto("/auth/forgot-password")

    // Test the form exists
    await expect(page.locator('input[name="email"]')).toBeVisible()

    // Fill out email
    await page.fill('input[name="email"]', "test@example.com")

    // Submit the form
    await page.click('button[type="submit"]')

    // Should show success state
    await expect(page.locator('text=Check your email')).toBeVisible({ timeout: 10000 })
  })

  test("API endpoints respond correctly", async ({ page }) => {
    // Test signup API directly
    const signupResponse = await page.request.post("/api/auth/signup", {
      data: {
        firstName: "API",
        lastName: "Test",
        email: "api@test.com",
        password: "test123",
        confirmPassword: "test123",
        propertyName: "API Test Hotel",
        propertyType: "hotel",
        agreeTerms: true
      }
    })

    expect(signupResponse.status()).toBe(200)
    const signupData = await signupResponse.json()
    expect(signupData.success).toBe(true)

    // Test signin API
    const signinResponse = await page.request.post("/api/auth/signin", {
      data: {
        email: "demo@cypruspms.com",
        password: "demo123",
        rememberMe: false
      }
    })

    expect(signinResponse.status()).toBe(200)
    const signinData = await signinResponse.json()
    expect(signinData.success).toBe(true)

    // Test contact API
    const contactResponse = await page.request.post("/api/contact", {
      data: {
        firstName: "API",
        lastName: "Contact",
        email: "contact@test.com",
        phone: "+357 99 123456",
        property: "API Test Hotel",
        propertyType: "hotel",
        requestType: "demo",
        message: "API test message"
      }
    })

    expect(contactResponse.status()).toBe(200)
    const contactData = await contactResponse.json()
    expect(contactData.success).toBe(true)

    // Test reservations API
    const reservationResponse = await page.request.post("/api/reservations", {
      data: {
        firstName: "API",
        lastName: "Guest",
        email: "guest@test.com",
        phone: "+357 99 123456",
        nationality: "Cyprus",
        checkIn: "2025-12-15",
        checkOut: "2025-12-17",
        adults: "2",
        children: "0",
        roomType: "DELUXE",
        selectedRoom: "205",
        specialRequests: "API test booking"
      }
    })

    expect(reservationResponse.status()).toBe(200)
    const reservationData = await reservationResponse.json()
    expect(reservationData.success).toBe(true)
    expect(reservationData.reservation.pricing.tourismTax).toBe(6) // €1.50 * 2 adults * 2 nights
    expect(reservationData.reservation.pricing.vat).toBeGreaterThan(0) // Cyprus VAT 19%
  })
})