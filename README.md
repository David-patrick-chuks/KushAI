<p align="center">
  <img src="/logo.png" alt="Kushai Logo" width="200" />
</p>

<h1 align="center">Kushai</h1>

<p align="center">
  <strong>A unified interface to Google Gemini AI models with multi-version support</strong>
</p>

<p align="center">
  <a href="https://github.com/kushai/kushai/actions"><img src="https://github.com/kushai/kushai/workflows/CI/badge.svg" alt="Build Status"></a>
  <a href="https://codecov.io/gh/kushai/kushai"><img src="https://codecov.io/gh/kushai/kushai/branch/main/graph/badge.svg" alt="Coverage Status"></a>
  <a href="https://github.com/kushai/kushai/blob/main/LICENSE"><img src="https://img.shields.io/github/license/kushai/kushai" alt="License"></a>
  <a href="https://www.npmjs.com/package/@kushai/sdk"><img src="https://img.shields.io/npm/v/@kushai/sdk.svg" alt="npm version"></a>
</p>

## 🚀 Overview

Kushai is an open-source AI platform that provides a unified interface to Google Gemini models with multi-version support. It abstracts away the complexity of managing multiple API keys and provides a simple, consistent API for developers.

### 🌟 Key Features

- **Multiple Model Versions**: Support for different model versions (kush-1.0, kush-2.0, kush-2.5) with varying capabilities
- **Comprehensive AI Capabilities**: Text generation, image generation, video generation, multimodal understanding, and more
- **Multiple Interfaces**: SDK, CLI, and REST API for flexible integration
- **Advanced Security**: Secure API key management, password hashing, and rate limiting
- **Robust Monitoring**: Comprehensive logging and usage tracking
- **Developer-Friendly**: Detailed documentation, examples, and error handling

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Features](#-features)
- [Models](#-models)
- [Security](#-security)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## 📦 Installation

### SDK

\`\`\`bash
npm install @kushai/sdk
\`\`\`

### CLI

\`\`\`bash
npm install -g @kushai/cli
\`\`\`

## 🚀 Quick Start

### Using the SDK

\`\`\`typescript
import { Kushai } from '@kushai/sdk';

// Initialize with your Kushai API key
const kushai = new Kushai('your-kushai-api-key');

// Generate text with a specific model
async function generateText() {
  const response = await kushai.generate({
    prompt: 'Explain quantum computing in simple terms',
    model: 'kush-2.0-pro'
  });
  
  console.log(response.text);
}

// Generate an image
async function generateImage() {
  const response = await kushai.generateImage({
    prompt: 'A futuristic city with flying cars',
    model: 'kush-2.5-creative'
  });
  
  console.log(response.images[0]);
}

generateText();
\`\`\`

### Using the CLI

\`\`\`bash
# Configure your API key
kushai config set --api-key "your-kushai-api-key"

# List available models
kushai models list

# Generate text
kushai generate --prompt "Explain quantum computing" --model kush-2.0-pro

# Generate an image
kushai image --prompt "A futuristic city with flying cars" --model kush-2.5-creative --output ./images
\`\`\`

### Using the REST API

\`\`\`bash
curl -X POST https://api.kushai.com/v1/generate \
  -H "Authorization: Bearer your-kushai-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "model": "kush-2.0-pro"
  }'
\`\`\`

## 🏗️ Architecture

Kushai is built as a TypeScript monorepo with the following packages:

- **@kushai/sdk**: TypeScript SDK for interacting with the Kushai API
- **@kushai/cli**: Command-line interface for Kushai
- **@kushai/api**: Express backend API server
- **@kushai/common**: Shared utilities and types
- **@kushai/web**: Landing page and user dashboard
- **@kushai/docs**: Documentation site

The architecture follows these key principles:

1. **Separation of Concerns**: Each package has a specific responsibility
2. **Type Safety**: Comprehensive TypeScript types for all components
3. **Consistent API Design**: Uniform API design across all interfaces
4. **Robust Error Handling**: Standardized error handling and reporting
5. **Comprehensive Testing**: Unit and integration tests for all components

## 🔥 Features

### Text Generation

Generate human-like text for various applications:

\`\`\`typescript
const response = await kushai.generate({
  prompt: "Write a short story about a robot learning to paint",
  model: "kush-2.0-pro",
  temperature: 0.7
});
\`\`\`

### Image Generation

Create images from text descriptions:

\`\`\`typescript
const response = await kushai.generateImage({
  prompt: "A serene mountain landscape at sunset",
  model: "kush-2.5-creative",
  width: 1024,
  height: 1024
});
\`\`\`

### Chat

Have interactive conversations:

\`\`\`typescript
const response = await kushai.chat({
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What's the capital of France?" }
  ],
  model: "kush-2.0-pro"
});
\`\`\`

### Function Calling

Use structured function calls for specific tasks:

\`\`\`typescript
const response = await kushai.functionCall({
  prompt: "What's the weather in New York?",
  functions: [
    {
      name: "getWeather",
      description: "Get the weather for a location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state"
          }
        },
        required: ["location"]
      }
    }
  ],
  model: "kush-2.0-pro"
});
\`\`\`

### Multimodal

Process text and images together:

\`\`\`typescript
const response = await kushai.multimodal({
  prompt: "What's in this image?",
  imageUrl: "https://example.com/image.jpg",
  model: "kush-2.0-vision"
});
\`\`\`

## 🤖 Models

Kushai provides access to multiple model versions:

### Kushai 1.0 Series

- **kush-1.0-pro**: General purpose model
- **kush-1.0-flash**: Fast and efficient model
- **kush-1.0-vision**: Specialized for image understanding

### Kushai 2.0 Series

- **kush-2.0-pro**: Advanced model with 128K context window
- **kush-2.0-vision**: Advanced vision model

### Kushai 2.5 Series (Beta)

- **kush-2.5-pro**: State-of-the-art model with 256K context
- **kush-2.5-flash**: High-performance model
- **kush-2.5-creative**: Specialized for creative content generation

## 🔒 Security

Kushai implements robust security measures:

- **API Key Management**: Secure generation and validation of API keys
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Tiered rate limiting based on user plans
- **Input Validation**: Comprehensive validation of all inputs
- **Error Handling**: Secure error messages that don't leak sensitive information
- **Monitoring**: Detailed logging of authentication attempts and API usage

## 🛠️ Development

### Prerequisites

- Node.js 18+
- MongoDB 5.0+

### Setup

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

### Testing

\`\`\`bash
# Run all tests
npm test

# Run tests for a specific package
npm test --workspace=@kushai/sdk
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

[MIT](./LICENSE)
