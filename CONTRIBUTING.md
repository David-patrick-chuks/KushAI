# Contributing to Kushai

Thank you for your interest in contributing to Kushai! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

If you find a bug, please report it by creating an issue on GitHub. Please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Any relevant logs or screenshots
- Your environment (OS, Node.js version, etc.)

### Suggesting Features

We welcome feature suggestions! Please create an issue on GitHub with:

- A clear, descriptive title
- A detailed description of the proposed feature
- Any relevant examples or mockups
- The problem the feature would solve

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes using [conventional commits](https://www.conventionalcommits.org/)
6. Push to your branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

#### Pull Request Guidelines

- Follow the [conventional commits](https://www.conventionalcommits.org/) specification
- Include tests for new features or bug fixes
- Update documentation as needed
- Ensure all tests pass
- Keep pull requests focused on a single concern

## Development Setup

### Prerequisites

- Node.js 18+
- MongoDB 5.0+

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/kushai/kushai.git
   cd kushai
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. Start development servers:
   \`\`\`bash
   npm run dev
   \`\`\`

### Project Structure

- `api/` - Express backend API server
- `sdk/` - TypeScript SDK for Kushai
- `cli/` - Command-line interface
- `common/` - Shared utilities and types
- `web/` - Landing page and user dashboard
- `docs/` - Documentation site
- `test/` - Integration tests
- `sdk-samples/` - SDK usage examples

### Testing

\`\`\`bash
# Run all tests
npm test

# Run tests for a specific package
npm test --workspace=@kushai/sdk
\`\`\`

## Style Guide

- Use TypeScript for all code
- Follow the ESLint and Prettier configurations
- Write meaningful commit messages following conventional commits
- Document all public APIs with JSDoc comments

## License

By contributing to Kushai, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

