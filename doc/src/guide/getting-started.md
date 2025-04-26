# Getting Started with Kushai

Welcome to Kushai! This guide will help you get started with using Kushai to access Google Gemini AI models.

## Installation

### SDK

\`\`\`bash
npm install @kushai/sdk
\`\`\`

### CLI

\`\`\`bash
npm install -g @kushai/cli
\`\`\`

## Authentication

To use Kushai, you need a Kushai API key. You can get one by signing up on the [Kushai website](https://kushai.com).

### Setting up your API key

#### SDK

\`\`\`typescript
import { Kushai } from '@kushai/sdk';

// Initialize with your Kushai API key
const kushai = new Kushai('your-kushai-api-key');
\`\`\`

#### CLI

\`\`\`bash
kushai config set --api-key "your-kushai-api-key"
\`\`\`

#### REST API

Include your API key in the `Authorization` header of your requests:

\`\`\`
Authorization: Bearer your-kushai-api-key
\`\`\`

## Basic Usage

### Generating Text

#### SDK

\`\`\`typescript
import { Kushai } from '@kushai/sdk';

const kushai = new Kushai('your-kushai-api-key');

async function generateText() {
  const response = await kushai.generate({
    prompt: 'Explain quantum computing in simple terms'
  });
  
  console.log(response.text);
}

generateText();
\`\`\`

#### CLI

\`\`\`bash
kushai generate --prompt "Explain quantum computing in simple terms"
\`\`\`

#### REST API

\`\`\`bash
curl -X POST https://api.kushai.com/v1/generate \
  -H "Authorization: Bearer your-kushai-api-key" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing in simple terms"}'
\`\`\`

### Generating Images

#### SDK

\`\`\`typescript
import { Kushai } from '@kushai/sdk';

const kushai = new Kushai('your-kushai-api-key');

async function generateImage() {
  const response = await kushai.generateImage({
    prompt: 'A futuristic city with flying cars'
  });
  
  console.log(response.images);
}

generateImage();
\`\`\`

#### CLI

\`\`\`bash
kushai image --prompt "A futuristic city with flying cars"
\`\`\`

#### REST API

\`\`\`bash
curl -X POST https://api.kushai.com/v1/image \
  -H "Authorization: Bearer your-kushai-api-key" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A futuristic city with flying cars"}'
\`\`\`

## Next Steps

- Explore the [SDK Reference](/reference/sdk) for detailed information on all available methods
- Check out the [CLI Reference](/reference/cli) for all available commands
- Learn about [API Endpoints](/reference/api) for direct REST API usage
- See [Examples](/examples) for common use cases
