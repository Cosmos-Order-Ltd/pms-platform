# 🛡️ PMS Platform QA & Testing Guide

## 📋 Overview

This document outlines the comprehensive Quality Assurance and testing infrastructure for the PMS (Property Management System) platform, ensuring reliability across all devices and platforms.

## 🎯 Testing Strategy

### 1. **Code Quality Assurance**

#### ESLint Configuration
- **Root config**: `.eslintrc.js` with TypeScript and React rules
- **Backend rules**: Node.js specific configurations
- **Frontend rules**: Next.js 15 and React 19 optimized
- **Test files**: Relaxed rules for test environments

#### Prettier Configuration
- **Consistent formatting**: 100 character line width
- **TypeScript support**: Single quotes, trailing commas
- **File-specific rules**: JSON, Markdown, YAML handling

#### EditorConfig
- **Cross-platform consistency**: UTF-8, LF, 2-space indentation
- **Language-specific**: Tailored for TS, JS, Markdown, YAML

### 2. **Backend Testing (Jest)**

#### Services Covered:
- `api-gateway` - API routing and service communication
- `pms-backend` - Core business logic and data management
- `pms-core` - Shared utilities and middleware
- `monitoring` - System monitoring and alerting

#### Test Structure:
```
src/
├── __tests__/
│   ├── unit/           # Individual function/class tests
│   ├── integration/    # Service interaction tests
│   ├── fixtures/       # Test data and mocks
│   └── mocks/          # Service mocks
```

#### Coverage Requirements:
- **Lines**: 70% minimum
- **Functions**: 70% minimum
- **Branches**: 70% minimum
- **Statements**: 70% minimum

### 3. **Frontend Testing (Vitest + React Testing Library)**

#### Services Covered:
- `pms-admin` - Admin dashboard interface
- `pms-guest` - Guest booking portal
- `pms-staff` - Staff mobile PWA
- `pms-marketplace` - Property marketplace

#### Test Types:
- **Component tests**: UI component functionality
- **Integration tests**: Component interaction
- **Hook tests**: Custom React hooks
- **API tests**: Frontend API integration

#### Accessibility Testing:
- **jest-dom matchers**: Semantic HTML validation
- **Screen reader compatibility**: ARIA attributes
- **Keyboard navigation**: Tab order and focus management

### 4. **End-to-End Testing (Playwright)**

#### Multi-Device Configuration:

**Desktop Browsers:**
- Chrome (1920x1080)
- Firefox (1920x1080)
- Safari (1920x1080)

**Tablet Testing:**
- iPad Pro (portrait & landscape)
- Galaxy Tab S4

**Mobile Testing:**
- iPhone 14 Pro
- Pixel 7
- Galaxy S23

**Network Conditions:**
- Slow 3G simulation
- Offline mode testing
- Network throttling

#### Test Scenarios:
1. **User Journeys**: Registration → Booking → Payment
2. **Staff Workflows**: Login → Task Management → Completion
3. **Admin Operations**: Dashboard → Reports → Settings
4. **Cross-service Communication**: Service-to-service validation

### 5. **Performance & Accessibility**

#### Lighthouse CI Metrics:
- **Performance**: > 90 score
- **Accessibility**: > 95 score
- **Best Practices**: > 95 score
- **SEO**: > 90 score
- **PWA** (Staff app): > 80 score

#### Bundle Size Limits:
- **Initial JS**: < 200KB
- **Initial CSS**: < 50KB
- **Per-route chunks**: < 100KB

### 6. **Health Monitoring**

#### Health Check Endpoints:

**Backend Services:**
- `GET /health` - Comprehensive health status
- `GET /ready` - Kubernetes readiness probe
- `GET /live` - Kubernetes liveness probe

**Frontend Services:**
- `GET /api/health` - Next.js API route health check
- `HEAD /api/health` - Liveness probe

#### Health Check Features:
- **Database connectivity**: PostgreSQL connection status
- **Redis connectivity**: Cache service status
- **Memory monitoring**: Heap usage tracking
- **Response time**: Performance metrics
- **Service dependencies**: Downstream service health

### 7. **CI/CD Pipeline**

#### PR Checks (`pr-checks.yml`):
1. **Lint & Format**: ESLint + Prettier validation
2. **Type Check**: TypeScript compilation
3. **Unit Tests**: Backend + Frontend test suites
4. **E2E Tests**: Critical user journeys
5. **Security Scan**: Dependency vulnerabilities
6. **Build Check**: Production build validation

#### Main Deploy (`main-deploy.yml`):
1. **Full Test Suite**: Comprehensive testing
2. **Docker Build**: Multi-platform container images
3. **Staging Deploy**: Automated deployment
4. **Health Validation**: Post-deploy verification

#### Nightly Tests (`nightly-tests.yml`):
1. **Comprehensive E2E**: All browsers and devices
2. **Performance Testing**: Lighthouse CI
3. **Security Audit**: OWASP ZAP + Snyk
4. **Dependency Updates**: Automated PR creation

### 8. **Pre-commit Hooks (Husky)**

#### Automated Checks:
- **Lint Staged**: ESLint + Prettier for changed files
- **Type Check**: TypeScript validation
- **Unit Tests**: Tests for modified files
- **Commit Message**: Conventional commit format

#### Commit Message Format:
```
feat: add property search functionality
fix: resolve booking confirmation bug
docs: update API documentation
test: add e2e tests for marketplace
```

## 🚀 Running Tests

### Local Development:
```bash
# Run all linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type check all services
npm run type-check:all

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend

# Run all tests
npm run test:all

# Run E2E tests
npm run e2e

# Health checks
npm run health-check:all
```

### Service-Specific Testing:
```bash
# Backend services
cd pms-backend && npm test
cd api-gateway && npm test
cd pms-core && npm test

# Frontend services
cd pms-admin && npm test
cd pms-marketplace && npm test
cd pms-staff && npm test
cd pms-guest && npm test
```

### E2E Testing:
```bash
# All browsers and devices
npm run e2e

# Specific browser
npm run e2e -- --project=chromium-desktop

# Debug mode
npm run e2e:debug

# UI mode
npm run e2e:ui

# Generate report
npm run e2e:report
```

## 📊 Test Coverage

### Viewing Coverage Reports:
```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

### Coverage Integration:
- **Codecov**: Automated coverage reporting
- **PR Comments**: Coverage diff in pull requests
- **Quality Gates**: Minimum coverage enforcement

## 🔒 Security Testing

### Automated Scans:
- **npm audit**: Dependency vulnerability scanning
- **Snyk**: Advanced security analysis
- **OWASP ZAP**: Web application security testing
- **CodeQL**: Static code analysis

### Manual Security Testing:
- **Authentication flows**: JWT validation
- **Authorization**: RBAC testing
- **Input validation**: XSS and injection prevention
- **API security**: Rate limiting and validation

## 📱 Mobile & PWA Testing

### Staff App (PWA):
- **Offline functionality**: Service worker testing
- **Push notifications**: Background sync validation
- **Add to Home Screen**: Installation flow
- **Touch gestures**: Mobile interaction testing

### Responsive Design:
- **Breakpoints**: 320px, 768px, 1024px, 1440px
- **Safe areas**: Notch and status bar handling
- **Orientation**: Portrait and landscape testing

## 🔍 Monitoring & Alerting

### Production Monitoring:
- **Health endpoints**: Continuous monitoring
- **Performance metrics**: Real-time tracking
- **Error tracking**: Sentry integration
- **Uptime monitoring**: External service checks

### Alert Configuration:
- **Response time**: > 2s warnings
- **Error rate**: > 1% alerts
- **Service availability**: < 99% critical
- **Resource usage**: Memory/CPU thresholds

## 📝 Contributing

### Adding New Tests:
1. **Unit tests**: `src/__tests__/unit/`
2. **Integration tests**: `src/__tests__/integration/`
3. **Component tests**: `src/__tests__/components/`
4. **E2E tests**: `e2e/`

### Test Naming Conventions:
- **Test files**: `*.test.ts`, `*.spec.ts`
- **Test descriptions**: Clear, descriptive names
- **Test organization**: Logical grouping with `describe` blocks

### Quality Standards:
- **Test coverage**: Maintain > 70% coverage
- **Test reliability**: No flaky tests
- **Test speed**: Fast feedback loops
- **Test maintenance**: Regular updates and cleanup

## 🎉 Success Metrics

### Quality Gates:
- ✅ All tests passing
- ✅ Coverage > 70%
- ✅ Lighthouse scores > 90%
- ✅ Zero security vulnerabilities
- ✅ Build successful
- ✅ Health checks passing

This comprehensive testing strategy ensures the PMS platform maintains high quality, reliability, and performance across all supported devices and platforms.