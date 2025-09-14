-- CreateTable
CREATE TABLE "guest_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestId" TEXT NOT NULL,
    "preferredLanguage" TEXT DEFAULT 'en',
    "dietary" TEXT,
    "roomPreferences" TEXT,
    "servicePreferences" TEXT,
    "allergies" TEXT,
    "notes" TEXT,
    "vipStatus" BOOLEAN NOT NULL DEFAULT false,
    "specialRequests" TEXT,
    "preferredContact" TEXT NOT NULL DEFAULT 'EMAIL',
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "birthday" DATETIME,
    "anniversary" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "guest_profiles_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requestedTime" DATETIME,
    "guestProfileId" TEXT NOT NULL,
    "propertyId" TEXT,
    "roomId" TEXT,
    "assignedToId" TEXT,
    "estimatedCost" REAL,
    "actualCost" REAL,
    "billedToRoom" BOOLEAN NOT NULL DEFAULT true,
    "completedAt" DATETIME,
    "guestRating" INTEGER,
    "guestFeedback" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "service_requests_guestProfileId_fkey" FOREIGN KEY ("guestProfileId") REFERENCES "guest_profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "service_requests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "service_requests_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "service_requests_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "guestProfileId" TEXT NOT NULL,
    "staffId" TEXT,
    "recipient" TEXT NOT NULL,
    "sentAt" DATETIME,
    "deliveredAt" DATETIME,
    "readAt" DATETIME,
    "propertyId" TEXT,
    "reservationId" TEXT,
    "templateId" TEXT,
    "isAutomated" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_guestProfileId_fkey" FOREIGN KEY ("guestProfileId") REFERENCES "guest_profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "messages_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "messages" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "loyalty_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestProfileId" TEXT NOT NULL,
    "membershipNumber" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'BRONZE',
    "points" INTEGER NOT NULL DEFAULT 0,
    "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
    "tierExpiresAt" DATETIME,
    "pointsToNext" INTEGER,
    "complimentaryNights" INTEGER NOT NULL DEFAULT 0,
    "roomUpgrades" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "loyalty_accounts_guestProfileId_fkey" FOREIGN KEY ("guestProfileId") REFERENCES "guest_profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "point_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loyaltyAccountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "reservationId" TEXT,
    "propertyId" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "point_transactions_loyaltyAccountId_fkey" FOREIGN KEY ("loyaltyAccountId") REFERENCES "loyalty_accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "point_transactions_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "point_transactions_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform" TEXT NOT NULL,
    "externalId" TEXT,
    "guestProfileId" TEXT,
    "reviewerName" TEXT NOT NULL,
    "reviewerEmail" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "cleanlinessRating" INTEGER,
    "serviceRating" INTEGER,
    "locationRating" INTEGER,
    "valueRating" INTEGER,
    "propertyId" TEXT,
    "reservationId" TEXT,
    "hasResponse" BOOLEAN NOT NULL DEFAULT false,
    "response" TEXT,
    "respondedAt" DATETIME,
    "respondedById" TEXT,
    "sentiment" TEXT,
    "keywords" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "reviewDate" DATETIME NOT NULL,
    "stayDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reviews_guestProfileId_fkey" FOREIGN KEY ("guestProfileId") REFERENCES "guest_profiles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reviews_respondedById_fkey" FOREIGN KEY ("respondedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "guest_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestProfileId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "bookedFor" DATETIME NOT NULL,
    "duration" INTEGER,
    "participants" INTEGER NOT NULL DEFAULT 1,
    "price" REAL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "vendor" TEXT,
    "location" TEXT,
    "contactInfo" TEXT,
    "propertyId" TEXT,
    "reservationId" TEXT,
    "guestRating" INTEGER,
    "guestFeedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "guest_activities_guestProfileId_fkey" FOREIGN KEY ("guestProfileId") REFERENCES "guest_profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "guest_activities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "guest_activities_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "guest_profiles_guestId_key" ON "guest_profiles"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_accounts_guestProfileId_key" ON "loyalty_accounts"("guestProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_accounts_membershipNumber_key" ON "loyalty_accounts"("membershipNumber");
