# Contributing to Automated Video Tutorial Generator

Thank you for considering contributing to this project! 🎉

## How to Contribute

### 1. **Report Bugs**

- Check if the issue already exists in GitHub Issues
- Provide clear steps to reproduce
- Include error messages and logs
- Mention your environment (OS, Node version, etc.)

### 2. **Suggest Features**

- Describe the feature and its use case
- Explain why it would be valuable
- Consider implementation complexity

### 3. **Submit Code**

#### Setup

```bash
git clone <repository>
cd crear-videos
npm run setup
```

#### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes
# Test your changes with demo flows
npm run validate flows/demo-navegacion.json
npm run generate -- flows/demo-navegacion.json

# Commit with clear messages
git commit -m "feat: add new action type for drag-and-drop"

# Push and create pull request
git push origin feature/your-feature-name
```

## Code Guidelines

### TypeScript

- Use strict type checking
- Define types for all function parameters and returns
- Avoid `any` types unless absolutely necessary
- Use interfaces for object shapes

### Naming Conventions

- Files: kebab-case (`my-component.tsx`)
- Components: PascalCase (`MyComponent`)
- Functions/variables: camelCase (`myFunction`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Comments

- Use JSDoc for public APIs
- Explain "why", not "what" (code should be self-explanatory)
- Keep comments up-to-date

### Commit Messages

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style/formatting
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Project Areas

### Easy Contributions

- Add new demo flows
- Improve documentation
- Fix typos
- Add more action validations
- Create new design themes

### Medium Contributions

- Add new action types (e.g., drag-and-drop)
- Improve error messages
- Add unit tests
- Optimize performance
- Add animation effects

### Advanced Contributions

- Multi-format video support (16:9, 1:1)
- Web UI for flow creation
- CI/CD pipeline
- Alternative video frameworks
- Advanced voiceover features

## Testing

Before submitting:

1. Validate demo flows: `npm run validate flows/demo-*.json`
2. Generate test video: `npm run generate -- flows/demo-navegacion.json`
3. Check TypeScript compilation: `tsc --noEmit`
4. Test in both headless and headed mode

## Documentation

If you add features:

- Update README.md
- Add JSDoc comments
- Update PROJECT_SUMMARY.md
- Add examples in QUICK_START.md if applicable

## Pull Request Process

1. Ensure code follows guidelines above
2. Update documentation as needed
3. Test thoroughly with demo flows
4. Create clear PR description:
   - What does it do?
   - Why is it needed?
   - How was it tested?
5. Link related issues

## Need Help?

- Check documentation: README.md, QUICK_START.md
- Review existing code for patterns
- Open a discussion issue
- Ask questions in PR comments

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the code, not the person
- Assume good intentions
- Help others learn and grow

## Attribution

Contributors will be acknowledged in the project README.

Thank you for helping make this project better! 🚀
