# Contributing to PMS Backend

Thank you for your interest in contributing to the PMS Backend service! This guide will help you get started with development and contributing to the project.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0.0+
- PostgreSQL 15+ (or SQLite for development)
- Git

### Setup Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/charilaouc/pms-backend.git
   cd pms-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and configuration
   ```

4. **Setup database**:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

**Examples**:
```bash
feat(booking): add room availability check
fix(auth): resolve JWT token expiration issue
docs(readme): update API documentation
refactor(db): optimize booking queries
```

## 📝 Code Standards

### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use enums for constants with multiple related values
- Always provide return types for functions
- Use meaningful variable and function names

### API Design Guidelines
- Follow RESTful principles
- Use consistent HTTP status codes
- Include request/response validation
- Provide comprehensive error messages
- Document all endpoints with JSDoc

### Database Guidelines
- Use Prisma for database operations
- Write migrations for schema changes
- Use transactions for multi-table operations
- Index frequently queried fields
- Follow naming conventions (snake_case for DB, camelCase for TypeScript)

### Error Handling
- Use custom error classes
- Provide meaningful error messages
- Log errors appropriately
- Return consistent error responses
- Never expose sensitive information in errors

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Integration tests
npm run test:integration

# All tests
npm run test:all
```

### Writing Tests
- Write tests for all new features
- Maintain minimum 80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

**Test Structure**:
```typescript
describe('BookingService', () => {
  beforeEach(() => {
    // Setup
  });

  describe('createBooking', () => {
    it('should create booking with valid data', async () => {
      // Arrange
      const bookingData = { /* test data */ };

      // Act
      const result = await bookingService.createBooking(bookingData);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('confirmed');
    });
  });
});
```

## 📋 Pull Request Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Write code following our guidelines
   - Add/update tests
   - Update documentation if needed

3. **Run Quality Checks**:
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

### PR Requirements
- ✅ All tests pass
- ✅ Code follows style guidelines
- ✅ Documentation updated (if applicable)
- ✅ No security vulnerabilities
- ✅ Performance impact assessed
- ✅ Breaking changes documented

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No security issues
```

## 🔒 Security Guidelines

### Authentication & Authorization
- Always validate JWT tokens
- Implement proper RBAC
- Never store passwords in plain text
- Use HTTPS in production
- Validate all user inputs

### Data Protection
- Encrypt sensitive data
- Use parameterized queries
- Implement rate limiting
- Log security events
- Never commit secrets to git

### Dependencies
- Keep dependencies updated
- Run security audits regularly
- Review dependency licenses
- Remove unused dependencies

## 📚 Resources

### API Documentation
- OpenAPI/Swagger documentation available at `/docs`
- Postman collection in `/docs/postman`

### Database
- Prisma schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Seeds: `prisma/seed.ts`

### Architecture
- See [PMS Docs](https://github.com/charilaouc/pms-docs)
- Service communication patterns
- Database design decisions

## 🤝 Getting Help

### Communication Channels
- GitHub Issues for bug reports and feature requests
- GitHub Discussions for questions and ideas
- Code reviews for technical discussions

### Reporting Issues
When reporting bugs, please include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Environment details (Node.js version, OS, etc.)
5. Error messages and stack traces

### Feature Requests
When requesting features:
1. Describe the problem you're solving
2. Explain the proposed solution
3. Consider alternative solutions
4. Assess impact on existing functionality

## 🎯 Development Best Practices

### Performance
- Use database indexes appropriately
- Implement caching where beneficial
- Monitor memory usage
- Profile slow operations
- Use connection pooling

### Scalability
- Design for horizontal scaling
- Use stateless operations
- Implement proper error handling
- Monitor service health
- Plan for traffic spikes

### Maintainability
- Write self-documenting code
- Use consistent patterns
- Refactor regularly
- Remove dead code
- Update dependencies

## 🏆 Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- Annual contributor report

Thank you for contributing to the PMS Backend service! 🚀