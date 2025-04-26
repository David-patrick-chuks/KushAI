# Image Generation

Kushai provides a powerful image generation API that leverages Google Gemini models to create images from text prompts.

## Basic Usage

### SDK

\`\`\`typescript
import { Kushai } from '@kushai/sdk';

const kushai = new Kushai('your-kushai-api-key');

async function generateImage() {
  const response = await kushai.generateImage({
    prompt: 'A futuristic city with flying cars and neon lights',
    width: 1024,
    height: 1024,
    numberOfImages: 1
  });
  
  console.log(response.images); // Array of base64-encoded images
}

generateImage();
\`\`\`

### CLI

\`\`\`bash
kushai image --prompt "A futuristic city with flying cars and neon lights" --width 1024 --height 1024 --number 1 --output ./images
\`\`\`

### REST API

\`\`\`bash
curl -X POST https://api.kushai.com/v1/image \
  -H "Authorization: Bearer your-kushai-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city with flying cars and neon lights",
    "width": 1024,
    "height": 1024,
    "numberOfImages": 1
  }'
\`\`\`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | (required) | The text prompt describing the image to generate |
| `width` | number | 1024 | Width of the generated image (256-2048 pixels) |
| `height` | number | 1024 | Height of the generated image (256-2048 pixels) |
| `numberOfImages` | number | 1 | Number of images to generate (1-4) |

## Response

The response contains an array of images and usage information:

\`\`\`json
{
  "images": [
    "data:image/png;base64,..."
  ],
  "usage": {
    "promptTokens": 100,
    "completionTokens": 0,
    "totalTokens": 100
  }
}
\`\`\`

## Best Practices

1. **Be specific in your prompts**: The more detailed your prompt, the better the results. Include details about style, lighting, composition, etc.

2. **Experiment with dimensions**: Different aspect ratios can produce different results. Try various width and height combinations.

3. **Generate multiple images**: Since image generation has some randomness, generating multiple images increases the chance of getting a good result.

4. **Consider token usage**: Image generation consumes more tokens than text generation. Monitor your usage to avoid unexpected costs.

## Examples

### Generating a Landscape

\`\`\`typescript
const response = await kushai.generateImage({
  prompt: "A serene mountain landscape at sunset with a lake reflecting the orange sky",
  width: 1920,
  height: 1080
});
\`\`\`

### Creating a Product Mockup

\`\`\`typescript
const response = await kushai.generateImage({
  prompt: "A sleek smartphone mockup on a minimalist desk with soft lighting",
  width: 1024,
  height: 1024,
  numberOfImages: 3
});
\`\`\`

### Artistic Illustration

\`\`\`typescript
const response = await kushai.generateImage({
  prompt: "A watercolor illustration of a bustling market in Tokyo with detailed food stalls",
  width: 1024,
  height: 1536
});
\`\`\`

## Limitations

- Maximum image dimensions are 2048x2048 pixels
- Maximum of 4 images per request
- Some content may be filtered based on safety guidelines
- Results may vary based on the prompt complexity

## Error Handling

Common errors include:

- `invalid_request`: Invalid parameters (e.g., dimensions out of range)
- `rate_limit_exceeded`: Too many requests in a short period
- `content_filtered`: Prompt violates content policy

\`\`\`typescript
try {
  const response = await kushai.generateImage({
    prompt: "A futuristic city"
  });
} catch (error) {
  console.error(`Error: ${error.message}`);
  // Handle specific error codes
  if (error.code === 'rate_limit_exceeded') {
    // Wait and retry
  }
}
