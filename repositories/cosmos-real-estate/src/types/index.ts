/**
 * COSMOS ORDER REAL ESTATE PLATFORM - TYPE DEFINITIONS
 * Complete TypeScript interfaces for the Real Estate Development Platform
 */

// Base Types
export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Address {
    street: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    coordinates?: Coordinates;
}

export interface ContactInfo {
    email: string;
    phone: string;
    mobile?: string;
    website?: string;
}

export interface FinancialAmount {
    amount: number;
    currency: 'EUR' | 'USD' | 'GBP';
    exchangeRate?: number;
}

// User Management
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    permissions: Permission[];
    invitationCode?: string;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type UserRole = 'developer' | 'investor' | 'contractor' | 'architect' | 'admin';

export type Permission =
    | 'project.create'
    | 'project.view'
    | 'project.edit'
    | 'project.delete'
    | 'financial.view'
    | 'financial.edit'
    | 'investor.manage'
    | 'contractor.manage'
    | 'compliance.view'
    | 'analytics.view';

// Developer
export interface Developer {
    id: string;
    companyName: string;
    registrationNumber: string;
    licenseNumber: string;
    address: Address;
    contactInfo: ContactInfo;
    projects: string[]; // Project IDs
    totalInvestment: FinancialAmount;
    activeProjects: number;
    completedProjects: number;
    rating: number;
    certifications: Certification[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Certification {
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    certificateNumber: string;
    isActive: boolean;
}

// Land and Property
export interface LandParcel {
    id: string;
    title: string;
    plotNumber: string;
    area: number; // in square meters
    zoning: ZoningType;
    coordinates: Coordinates;
    address: Address;
    currentValue: FinancialAmount;
    purchasePrice?: FinancialAmount;
    purchaseDate?: Date;
    titleDeedNumber: string;
    developmentPotential: DevelopmentPotential;
    utilities: Utility[];
    restrictions: string[];
    images: string[];
    documents: Document[];
    status: LandStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type ZoningType =
    | 'residential'
    | 'commercial'
    | 'mixed-use'
    | 'industrial'
    | 'agricultural'
    | 'tourist'
    | 'protected';

export type LandStatus = 'available' | 'under-negotiation' | 'purchased' | 'in-development' | 'developed';

export interface DevelopmentPotential {
    maxFloors: number;
    maxCoverage: number; // percentage
    maxBuildingCoefficient: number;
    allowedUses: string[];
    restrictions: string[];
    estimatedUnits: number;
    estimatedValue: FinancialAmount;
}

export interface Utility {
    type: 'water' | 'electricity' | 'gas' | 'sewage' | 'internet' | 'cable';
    status: 'available' | 'partial' | 'unavailable';
    connectionCost?: FinancialAmount;
    provider?: string;
}

// Project Management
export interface Project {
    id: string;
    name: string;
    description: string;
    type: ProjectType;
    status: ProjectStatus;
    developer: string; // Developer ID
    landParcel: string; // Land ID
    totalBudget: FinancialAmount;
    currentSpent: FinancialAmount;
    projectedProfit: FinancialAmount;
    timeline: ProjectTimeline;
    phases: ProjectPhase[];
    units: PropertyUnit[];
    team: ProjectTeam;
    investors: ProjectInvestor[];
    compliance: ComplianceStatus;
    marketing: MarketingInfo;
    sales: SalesInfo;
    construction: ConstructionInfo;
    images: string[];
    documents: Document[];
    risks: RiskAssessment[];
    createdAt: Date;
    updatedAt: Date;
}

export type ProjectType = 'residential' | 'commercial' | 'mixed-use' | 'renovation' | 'infrastructure';
export type ProjectStatus = 'planning' | 'approved' | 'construction' | 'marketing' | 'completed' | 'cancelled';

export interface ProjectTimeline {
    plannedStart: Date;
    actualStart?: Date;
    plannedCompletion: Date;
    projectedCompletion?: Date;
    actualCompletion?: Date;
    milestones: Milestone[];
}

export interface Milestone {
    id: string;
    name: string;
    description: string;
    plannedDate: Date;
    actualDate?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'delayed';
    dependencies: string[]; // Other milestone IDs
    cost?: FinancialAmount;
}

export interface ProjectPhase {
    id: string;
    name: string;
    description: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
    startDate?: Date;
    endDate?: Date;
    budget: FinancialAmount;
    spent: FinancialAmount;
    progress: number; // 0-100
    tasks: Task[];
    dependencies: string[]; // Other phase IDs
}

export interface Task {
    id: string;
    title: string;
    description: string;
    assignee?: string; // User ID
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'critical';
    dueDate?: Date;
    completedDate?: Date;
    estimatedHours: number;
    actualHours?: number;
    dependencies: string[]; // Other task IDs
}

// Property Units
export interface PropertyUnit {
    id: string;
    projectId: string;
    unitNumber: string;
    type: UnitType;
    floor: number;
    area: number; // square meters
    bedrooms: number;
    bathrooms: number;
    balconies: number;
    parkingSpaces: number;
    features: string[];
    price: FinancialAmount;
    status: UnitStatus;
    buyer?: BuyerInfo;
    salesDate?: Date;
    handoverDate?: Date;
    images: string[];
    floorPlan?: string;
    specifications: UnitSpecification[];
}

export type UnitType = 'apartment' | 'penthouse' | 'villa' | 'office' | 'shop' | 'warehouse';
export type UnitStatus = 'planned' | 'construction' | 'available' | 'reserved' | 'sold' | 'delivered';

export interface UnitSpecification {
    category: string;
    items: {
        name: string;
        brand?: string;
        model?: string;
        quantity: number;
        cost?: FinancialAmount;
    }[];
}

// Team Management
export interface ProjectTeam {
    projectManager: string; // User ID
    architect: TeamMember;
    civilEngineer: TeamMember;
    contractors: TeamMember[];
    consultants: TeamMember[];
}

export interface TeamMember {
    userId?: string;
    companyName: string;
    contactPerson: string;
    contactInfo: ContactInfo;
    role: string;
    contractValue?: FinancialAmount;
    contractStartDate?: Date;
    contractEndDate?: Date;
    performance?: Performance;
}

export interface Performance {
    rating: number; // 1-10
    onTimeDelivery: number; // percentage
    qualityScore: number; // 1-10
    communicationScore: number; // 1-10
    notes: string;
}

// Investment Management
export interface ProjectInvestor {
    investorId: string;
    investmentAmount: FinancialAmount;
    investmentDate: Date;
    equityPercentage: number;
    expectedReturn: number; // percentage
    paymentSchedule: PaymentSchedule[];
    status: 'committed' | 'active' | 'completed' | 'cancelled';
}

export interface PaymentSchedule {
    id: string;
    amount: FinancialAmount;
    dueDate: Date;
    paidDate?: Date;
    status: 'pending' | 'paid' | 'overdue';
    description: string;
}

export interface Investor {
    id: string;
    type: 'individual' | 'company' | 'fund';
    name: string;
    email: string;
    phone: string;
    address: Address;
    totalInvested: FinancialAmount;
    portfolioProjects: string[]; // Project IDs
    riskTolerance: 'low' | 'medium' | 'high';
    preferredProjectTypes: ProjectType[];
    minimumInvestment: FinancialAmount;
    documents: Document[];
    kycStatus: 'pending' | 'verified' | 'rejected';
    accreditationStatus: 'retail' | 'accredited' | 'institutional';
    createdAt: Date;
    updatedAt: Date;
}

// Buyers
export interface BuyerInfo {
    id: string;
    type: 'individual' | 'company';
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email: string;
    phone: string;
    address: Address;
    nationality: string;
    budget: {
        min: FinancialAmount;
        max: FinancialAmount;
    };
    preferences: BuyerPreferences;
    mortgage?: MortgageInfo;
    documents: Document[];
    status: 'prospect' | 'qualified' | 'negotiating' | 'purchased';
    source: string;
    assignedAgent?: string; // User ID
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BuyerPreferences {
    unitTypes: UnitType[];
    minBedrooms: number;
    maxBedrooms: number;
    minArea: number;
    maxArea: number;
    preferredFloors: number[];
    mustHaveFeatures: string[];
    dealBreakers: string[];
}

export interface MortgageInfo {
    bankName: string;
    preApprovalAmount: FinancialAmount;
    interestRate: number;
    loanTerm: number; // years
    downPayment: FinancialAmount;
    monthlyPayment: FinancialAmount;
    approvalDate?: Date;
    expiryDate?: Date;
    status: 'pending' | 'approved' | 'rejected' | 'expired';
}

// Sales & Marketing
export interface SalesInfo {
    totalUnits: number;
    availableUnits: number;
    reservedUnits: number;
    soldUnits: number;
    totalSalesValue: FinancialAmount;
    averagePrice: FinancialAmount;
    salesVelocity: number; // units per month
    conversionRate: number; // percentage
    leadsGenerated: number;
    qualifiedLeads: number;
    salesHistory: SaleRecord[];
}

export interface SaleRecord {
    id: string;
    unitId: string;
    buyerId: string;
    salePrice: FinancialAmount;
    saleDate: Date;
    paymentSchedule: PaymentSchedule[];
    salesAgent?: string; // User ID
    commission?: FinancialAmount;
    notes: string;
}

export interface MarketingInfo {
    budget: FinancialAmount;
    spent: FinancialAmount;
    campaigns: MarketingCampaign[];
    website?: string;
    virtualTour?: string;
    brochures: string[];
    advertisements: Advertisement[];
    events: MarketingEvent[];
}

export interface MarketingCampaign {
    id: string;
    name: string;
    type: 'digital' | 'print' | 'outdoor' | 'event' | 'referral';
    budget: FinancialAmount;
    spent: FinancialAmount;
    startDate: Date;
    endDate: Date;
    leadsGenerated: number;
    conversions: number;
    roi: number; // percentage
    status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export interface Advertisement {
    id: string;
    title: string;
    medium: 'online' | 'newspaper' | 'magazine' | 'radio' | 'tv' | 'billboard';
    platform?: string;
    cost: FinancialAmount;
    startDate: Date;
    endDate: Date;
    impressions?: number;
    clicks?: number;
    leads?: number;
}

export interface MarketingEvent {
    id: string;
    name: string;
    type: 'launch' | 'open-house' | 'exhibition' | 'seminar';
    date: Date;
    location: string;
    budget: FinancialAmount;
    attendees: number;
    leadsGenerated: number;
    description: string;
}

// Construction Management
export interface ConstructionInfo {
    status: 'not-started' | 'foundation' | 'structure' | 'finishing' | 'completed';
    progress: number; // 0-100
    startDate?: Date;
    projectedEndDate?: Date;
    actualEndDate?: Date;
    contractor: string; // Company name
    subcontractors: SubcontractorInfo[];
    permits: PermitInfo[];
    inspections: InspectionRecord[];
    materials: MaterialOrder[];
    qualityChecks: QualityCheck[];
    safety: SafetyRecord[];
    changeOrders: ChangeOrder[];
}

export interface SubcontractorInfo {
    id: string;
    companyName: string;
    specialty: string;
    contactPerson: string;
    contactInfo: ContactInfo;
    contractValue: FinancialAmount;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'completed' | 'terminated';
    performance: Performance;
}

export interface PermitInfo {
    id: string;
    type: string;
    number: string;
    issuingAuthority: string;
    issueDate: Date;
    expiryDate?: Date;
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    cost: FinancialAmount;
    requirements: string[];
    documents: string[];
}

export interface InspectionRecord {
    id: string;
    type: string;
    inspector: string;
    scheduledDate: Date;
    actualDate?: Date;
    status: 'scheduled' | 'passed' | 'failed' | 'cancelled';
    findings: string[];
    requirements: string[];
    nextInspectionDate?: Date;
}

export interface MaterialOrder {
    id: string;
    supplier: string;
    materials: {
        item: string;
        quantity: number;
        unit: string;
        unitPrice: FinancialAmount;
        totalPrice: FinancialAmount;
    }[];
    orderDate: Date;
    deliveryDate?: Date;
    receivedDate?: Date;
    status: 'ordered' | 'delivered' | 'received' | 'cancelled';
    invoiceNumber?: string;
}

export interface QualityCheck {
    id: string;
    area: string;
    inspector: string;
    checkDate: Date;
    status: 'passed' | 'failed' | 'conditional';
    issues: QualityIssue[];
    photos: string[];
    nextCheckDate?: Date;
}

export interface QualityIssue {
    description: string;
    severity: 'minor' | 'major' | 'critical';
    location: string;
    responsibleParty: string;
    dueDate: Date;
    status: 'open' | 'in-progress' | 'resolved';
    cost?: FinancialAmount;
}

export interface SafetyRecord {
    id: string;
    date: Date;
    inspector: string;
    violations: SafetyViolation[];
    accidents: AccidentRecord[];
    training: TrainingRecord[];
    score: number; // 1-100
}

export interface SafetyViolation {
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: string;
    correctionRequired: string;
    dueDate: Date;
    status: 'open' | 'corrected';
    fine?: FinancialAmount;
}

export interface AccidentRecord {
    date: Date;
    description: string;
    injured: string;
    severity: 'minor' | 'moderate' | 'severe' | 'fatal';
    causedBy: string;
    preventiveMeasures: string[];
    reportedToAuthorities: boolean;
    compensation?: FinancialAmount;
}

export interface TrainingRecord {
    date: Date;
    topic: string;
    attendees: string[];
    trainer: string;
    hours: number;
    certificationIssued: boolean;
}

export interface ChangeOrder {
    id: string;
    requestedBy: string;
    description: string;
    reason: string;
    costImpact: FinancialAmount;
    timeImpact: number; // days
    status: 'pending' | 'approved' | 'rejected' | 'implemented';
    requestDate: Date;
    approvalDate?: Date;
    implementationDate?: Date;
    documents: string[];
}

// Cyprus Compliance
export interface ComplianceStatus {
    townPlanningPermit: PermitStatus;
    buildingPermit: PermitStatus;
    environmentalStudy: StudyStatus;
    titleDeedPreparation: ComplianceItem;
    vatRegistration: ComplianceItem;
    capitalGainsTax: ComplianceItem;
    municipalApprovals: ComplianceItem[];
    utilitiesConnections: ComplianceItem[];
    overallStatus: 'compliant' | 'non-compliant' | 'in-progress';
    lastAuditDate?: Date;
    nextAuditDate?: Date;
    violations: ComplianceViolation[];
}

export interface PermitStatus {
    status: 'not-required' | 'pending' | 'submitted' | 'approved' | 'rejected';
    applicationDate?: Date;
    approvalDate?: Date;
    expiryDate?: Date;
    permitNumber?: string;
    authority: string;
    requirements: string[];
    documents: Document[];
    cost: FinancialAmount;
    consultantUsed?: string;
}

export interface StudyStatus {
    required: boolean;
    status?: 'not-started' | 'in-progress' | 'completed' | 'approved' | 'rejected';
    consultant?: string;
    startDate?: Date;
    completionDate?: Date;
    approvalDate?: Date;
    cost?: FinancialAmount;
    findings?: string[];
    recommendations?: string[];
    documents?: Document[];
}

export interface ComplianceItem {
    name: string;
    required: boolean;
    status: 'not-applicable' | 'pending' | 'in-progress' | 'completed';
    dueDate?: Date;
    completionDate?: Date;
    authority: string;
    cost?: FinancialAmount;
    documents: Document[];
    notes: string;
}

export interface ComplianceViolation {
    id: string;
    type: string;
    description: string;
    severity: 'minor' | 'major' | 'critical';
    discoveredDate: Date;
    authority: string;
    fine?: FinancialAmount;
    correctionRequired: string;
    dueDate: Date;
    status: 'open' | 'in-progress' | 'resolved';
    resolutionDate?: Date;
    resolutionCost?: FinancialAmount;
}

// Risk Management
export interface RiskAssessment {
    id: string;
    category: RiskCategory;
    description: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    riskScore: number; // 1-25
    mitigationStrategy: string;
    owner: string; // User ID
    status: 'identified' | 'monitoring' | 'mitigating' | 'resolved';
    identifiedDate: Date;
    reviewDate?: Date;
    cost?: FinancialAmount;
}

export type RiskCategory =
    | 'financial'
    | 'legal'
    | 'environmental'
    | 'technical'
    | 'market'
    | 'regulatory'
    | 'operational'
    | 'reputational';

// Documents
export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    category: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string; // User ID
    uploadedAt: Date;
    version: number;
    isConfidential: boolean;
    expiryDate?: Date;
    metadata: Record<string, any>;
}

export type DocumentType =
    | 'contract'
    | 'permit'
    | 'drawing'
    | 'photo'
    | 'report'
    | 'financial'
    | 'legal'
    | 'marketing'
    | 'compliance'
    | 'other';

// Financial Analysis
export interface ProjectFinancials {
    totalCost: FinancialAmount;
    landCost: FinancialAmount;
    constructionCost: FinancialAmount;
    softCosts: FinancialAmount;
    marketingCosts: FinancialAmount;
    financingCosts: FinancialAmount;
    contingency: FinancialAmount;

    totalRevenue: FinancialAmount;
    grossProfit: FinancialAmount;
    netProfit: FinancialAmount;
    profitMargin: number; // percentage

    roi: number; // percentage
    irr: number; // percentage
    paybackPeriod: number; // months

    cashFlow: CashFlowProjection[];
    breakEvenPoint: Date;

    sensitivityAnalysis: SensitivityAnalysis;

    fundingSources: FundingSource[];
    loanDetails?: LoanDetails;
}

export interface CashFlowProjection {
    month: string;
    income: FinancialAmount;
    expenses: FinancialAmount;
    netCashFlow: FinancialAmount;
    cumulativeCashFlow: FinancialAmount;
}

export interface SensitivityAnalysis {
    scenarios: {
        optimistic: ProjectOutcome;
        realistic: ProjectOutcome;
        pessimistic: ProjectOutcome;
    };
    keyVariables: SensitivityVariable[];
}

export interface ProjectOutcome {
    totalProfit: FinancialAmount;
    roi: number;
    completionDate: Date;
    salesVelocity: number;
}

export interface SensitivityVariable {
    name: string;
    baseValue: number;
    impactOnProfit: number; // percentage change in profit per 1% change in variable
    impactOnROI: number;
}

export interface FundingSource {
    source: 'equity' | 'debt' | 'mezzanine' | 'grant';
    provider: string;
    amount: FinancialAmount;
    percentage: number;
    cost: number; // interest rate or equity percentage
    terms: string[];
}

export interface LoanDetails {
    lender: string;
    amount: FinancialAmount;
    interestRate: number;
    term: number; // months
    monthlyPayment: FinancialAmount;
    collateral: string[];
    guarantors: string[];
    covenants: string[];
    drawdownSchedule: PaymentSchedule[];
}

// Market Analysis
export interface MarketAnalysis {
    id: string;
    projectId: string;
    analysisDate: Date;
    marketConditions: MarketConditions;
    competitorAnalysis: CompetitorAnalysis[];
    demandAnalysis: DemandAnalysis;
    pricingAnalysis: PricingAnalysis;
    recommendations: string[];
    confidence: 'low' | 'medium' | 'high';
    validUntil: Date;
    analyst: string; // User ID
}

export interface MarketConditions {
    economicIndicators: {
        gdpGrowth: number;
        inflation: number;
        unemployment: number;
        interestRates: number;
    };
    realEstateMetrics: {
        averagePricePerSqm: FinancialAmount;
        priceGrowth: number; // yearly percentage
        salesVolume: number;
        daysOnMarket: number;
        inventoryLevels: 'low' | 'medium' | 'high';
    };
    regulatoryEnvironment: {
        recentChanges: string[];
        upcomingChanges: string[];
        impact: 'positive' | 'neutral' | 'negative';
    };
}

export interface CompetitorAnalysis {
    competitorName: string;
    projectName: string;
    location: string;
    distanceKm: number;
    unitTypes: UnitType[];
    priceRange: {
        min: FinancialAmount;
        max: FinancialAmount;
    };
    features: string[];
    salesVelocity: number;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
    differentiators: string[];
}

export interface DemandAnalysis {
    targetMarkets: TargetMarket[];
    demographics: Demographics;
    buyingPatterns: BuyingPattern[];
    seasonality: SeasonalityFactor[];
    demandDrivers: string[];
    demandConstraints: string[];
    forecastedDemand: number; // units per month
}

export interface TargetMarket {
    segment: string;
    size: number; // number of potential buyers
    characteristics: string[];
    preferences: BuyerPreferences;
    averageBudget: FinancialAmount;
    priority: 'primary' | 'secondary' | 'tertiary';
}

export interface Demographics {
    ageGroups: { range: string; percentage: number }[];
    incomeGroups: { range: string; percentage: number }[];
    familyStatus: { status: string; percentage: number }[];
    nationality: { country: string; percentage: number }[];
    occupation: { type: string; percentage: number }[];
}

export interface BuyingPattern {
    trigger: string;
    timeline: string;
    decisionFactors: string[];
    informationSources: string[];
    budget: FinancialAmount;
    frequency: number; // percentage of segment
}

export interface SeasonalityFactor {
    period: string;
    demandMultiplier: number; // 1.0 = average, >1.0 = above average
    reasons: string[];
}

export interface PricingAnalysis {
    recommendedPricing: UnitPricing[];
    pricingStrategy: 'premium' | 'competitive' | 'penetration' | 'value';
    priceElasticity: number;
    optimalPricePoint: FinancialAmount;
    revenueMaximization: FinancialAmount;
    competitiveBenchmark: FinancialAmount;
    priceJustification: string[];
}

export interface UnitPricing {
    unitType: UnitType;
    area: number;
    recommendedPrice: FinancialAmount;
    pricePerSqm: FinancialAmount;
    competitorAverage: FinancialAmount;
    premium: number; // percentage above/below market
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Query Types
export interface ProjectQuery {
    status?: ProjectStatus[];
    type?: ProjectType[];
    developer?: string;
    minBudget?: number;
    maxBudget?: number;
    city?: string;
    district?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface DashboardMetrics {
    totalProjects: number;
    activeProjects: number;
    totalInvestment: FinancialAmount;
    totalRevenue: FinancialAmount;
    averageROI: number;
    projectsByStatus: Record<ProjectStatus, number>;
    monthlyMetrics: MonthlyMetric[];
    recentActivity: ActivityRecord[];
}

export interface MonthlyMetric {
    month: string;
    newProjects: number;
    completedProjects: number;
    totalInvestment: FinancialAmount;
    totalRevenue: FinancialAmount;
    profitMargin: number;
}

export interface ActivityRecord {
    id: string;
    type: 'project.created' | 'project.updated' | 'unit.sold' | 'payment.received' | 'milestone.completed';
    description: string;
    projectId?: string;
    userId: string;
    timestamp: Date;
    metadata: Record<string, any>;
}

// Configuration Types
export interface SystemConfig {
    company: {
        name: string;
        address: Address;
        contactInfo: ContactInfo;
        logo: string;
        website: string;
    };
    defaults: {
        currency: 'EUR' | 'USD' | 'GBP';
        language: 'en' | 'el' | 'tr';
        timezone: string;
        dateFormat: string;
        numberFormat: string;
    };
    integrations: {
        paymentProcessor: 'stripe' | 'paypal';
        emailService: 'sendgrid' | 'ses';
        smsService: 'twilio' | 'aws-sns';
        mapService: 'google' | 'mapbox';
        documentStorage: 's3' | 'gcp' | 'azure';
    };
    compliance: {
        country: 'CY' | 'GR' | 'MT';
        regulations: string[];
        authorities: Authority[];
    };
}

export interface Authority {
    name: string;
    department: string;
    contactInfo: ContactInfo;
    website: string;
    services: string[];
    processingTimes: Record<string, number>; // service -> days
}