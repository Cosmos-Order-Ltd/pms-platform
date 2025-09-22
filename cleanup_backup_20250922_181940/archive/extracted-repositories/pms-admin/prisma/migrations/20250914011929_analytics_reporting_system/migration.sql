-- CreateTable
CREATE TABLE "analytics_snapshots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "hour" INTEGER,
    "propertyId" TEXT,
    "totalRevenue" REAL NOT NULL DEFAULT 0,
    "roomRevenue" REAL NOT NULL DEFAULT 0,
    "serviceRevenue" REAL NOT NULL DEFAULT 0,
    "totalRooms" INTEGER NOT NULL DEFAULT 0,
    "occupiedRooms" INTEGER NOT NULL DEFAULT 0,
    "availableRooms" INTEGER NOT NULL DEFAULT 0,
    "outOfOrderRooms" INTEGER NOT NULL DEFAULT 0,
    "occupancyRate" REAL NOT NULL DEFAULT 0,
    "adr" REAL NOT NULL DEFAULT 0,
    "revpar" REAL NOT NULL DEFAULT 0,
    "totalGuests" INTEGER NOT NULL DEFAULT 0,
    "newGuests" INTEGER NOT NULL DEFAULT 0,
    "returningGuests" INTEGER NOT NULL DEFAULT 0,
    "serviceRequests" INTEGER NOT NULL DEFAULT 0,
    "completedServices" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" REAL NOT NULL DEFAULT 0,
    "guestSatisfaction" REAL NOT NULL DEFAULT 0,
    "staffOnDuty" INTEGER NOT NULL DEFAULT 0,
    "totalStaff" INTEGER NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "avgRating" REAL NOT NULL DEFAULT 0,
    "positiveReviews" INTEGER NOT NULL DEFAULT 0,
    "negativeReviews" INTEGER NOT NULL DEFAULT 0,
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "loyaltyRedemptions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "analytics_snapshots_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "formula" TEXT,
    "unit" TEXT NOT NULL,
    "targetValue" REAL,
    "minThreshold" REAL,
    "maxThreshold" REAL,
    "currentValue" REAL,
    "previousValue" REAL,
    "trend" TEXT,
    "trendPercent" REAL,
    "propertyId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "performance_metrics_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "report_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "sqlQuery" TEXT,
    "layout" JSONB,
    "createdById" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "lastUsed" DATETIME,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "report_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "data_exports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "templateId" TEXT,
    "customQuery" TEXT,
    "dateFrom" DATETIME,
    "dateTo" DATETIME,
    "filters" JSONB,
    "filePath" TEXT,
    "fileSize" INTEGER,
    "recordCount" INTEGER,
    "errorMessage" TEXT,
    "requestedById" TEXT NOT NULL,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "scheduleConfig" JSONB,
    "nextRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "data_exports_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "report_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "data_exports_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "forecast_models" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "accuracy" REAL,
    "trainingStart" DATETIME NOT NULL,
    "trainingEnd" DATETIME NOT NULL,
    "dataPoints" INTEGER NOT NULL,
    "predictions" JSONB NOT NULL,
    "confidence" REAL,
    "lastValidated" DATETIME,
    "validationMae" REAL,
    "validationRmse" REAL,
    "propertyId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "forecast_models_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "business_rules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "actions" JSONB NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastExecuted" DATETIME,
    "executionCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "lastResult" TEXT,
    "propertyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "business_rules_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "analytics_snapshots_propertyId_date_hour_key" ON "analytics_snapshots"("propertyId", "date", "hour");
