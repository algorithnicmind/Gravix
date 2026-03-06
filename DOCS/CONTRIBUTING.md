# 🤝 Contributing — Cosmic Watch

## Git Workflow

### Branch Naming

```
main              → Production-ready code
develop           → Integration branch
feature/<name>    → New features (e.g., feature/risk-engine)
fix/<name>        → Bug fixes (e.g., fix/auth-token-refresh)
docs/<name>       → Documentation updates
```

### Commit Message Convention

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

Types:
  feat:     New feature
  fix:      Bug fix
  docs:     Documentation
  style:    Formatting (no code change)
  refactor: Code refactoring
  test:     Adding tests
  chore:    Build, config changes

Examples:
  feat(auth): implement JWT token refresh
  fix(api): handle NASA API timeout gracefully
  docs(readme): update project structure
  test(risk): add unit tests for risk scoring
```

---

## Code Standards

### General

- Use **ES Modules** (`import/export`) throughout
- Use **async/await** (no raw Promises/callbacks)
- Maximum line length: **100 characters**
- Use **const** by default, **let** when reassignment needed, **never** `var`

### Backend

- Follow **Route → Controller → Service → Model** pattern
- All controllers use **try/catch** with `next(error)`
- All inputs validated with **Joi** before processing
- Use **named exports** for services and controllers
- Environment variables accessed via **config files**, not directly

### Frontend

- **Functional components** with hooks (no class components)
- **Custom hooks** for reusable logic
- **Context API** for global state (avoid prop drilling)
- Component files: **PascalCase** (e.g., `AsteroidCard.jsx`)
- Utility files: **camelCase** (e.g., `formatters.js`)

---

## Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with meaningful commits
3. Write/update tests
4. Ensure `npm test` passes
5. Ensure `npm run lint` passes
6. Create PR to `develop` with description
7. Request review
8. Address feedback
9. Merge after approval

### PR Description Template

```markdown
## What

Brief description of changes

## Why

Motivation and context

## How

Implementation approach

## Testing

How was this tested?

## Screenshots

If UI changes, include before/after screenshots
```

---

## File Structure Rules

- **One component per file**
- **Co-locate tests** next to source files (`Component.jsx` + `Component.test.jsx`)
- **Index files** for clean imports from directories
- **No circular dependencies**

---

> **Back to**: [README.md](./README.md)
