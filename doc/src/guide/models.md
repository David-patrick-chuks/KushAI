# Models

Kushai provides access to multiple AI models with different capabilities and performance characteristics. This guide explains the available models and how to select the right one for your use case.

## Available Models

Kushai offers several model versions, each with different capabilities:

### Kushai 1.0 Series

Based on Google Gemini 1.0, these models provide solid performance for a variety of tasks:

- **kush-1.0-pro**: General purpose model with strong reasoning capabilities
- **kush-1.0-flash**: Fast and efficient model for simple tasks
- **kush-1.0-vision**: Specialized model for image understanding and multimodal tasks

### Kushai 2.0 Series

Based on Google Gemini 1.5, these models offer improved performance and larger context windows:

- **kush-2.0-pro**: Advanced model with extended context window (128K tokens) and improved reasoning
- **kush-2.0-vision**: Advanced vision model with image generation capabilities

### Kushai 2.5 Series (Beta)

Our latest models with cutting-edge capabilities:

- **kush-2.5-pro**: State-of-the-art model with comprehensive capabilities and 256K token context window
- **kush-2.5-flash**: High-performance model optimized for speed and efficiency
- **kush-2.5-creative**: Specialized model for creative content generation, including images and videos

## Model Capabilities

Each model supports different capabilities:

| Capability | Description |
|------------|-------------|
| text | Text generation from prompts |
| chat | Interactive chat conversations |
| image-generation | Creating images from text descriptions |
| image-understanding | Analyzing and understanding images |
| video-understanding | Analyzing and understanding videos |
| audio-understanding | Transcribing and understanding audio |
| function-calling | Structured function calls for specific tasks |
| structured-output | Generating structured data (JSON) |
| multimodal | Processing text and images together |
| video-generation | Creating videos from text descriptions |

## Selecting a Model

You can specify which model to use in your API requests:

### SDK

\`\`\`typescript
import { Kushai } from '@kushai/sdk';

// Specify a default model for all requests
const kushai = new Kushai('your-api-key', {
  defaultModel: 'kush-2.0-pro'
});

// Or specify a model for a specific request
const response = await kushai.generate({
  prompt: 'Explain quantum computing',
  model: 'kush-2.5-pro'
});
\`\`\`

### CLI

\`\`\`bash
# List all available models
kushai models list

# Get detailed information about a specific model
kushai models info kush-2.0-pro

# Use a specific model for text generation
kushai generate --prompt "Explain quantum computing" --model kush-2.5-pro
\`\`\`

### REST API

\`\`\`bash
curl -X POST https://api.kushai.com/v1/generate \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing",
    "model": "kush-2.5-pro"
  }'
\`\`\`

## Model Selection Best Practices

1. **Start with kush-2.0-pro**: This model provides a good balance of performance and cost for most use cases.

2. **Use specialized models for specific tasks**:
   - For image generation: `kush-2.5-creative`
   - For multimodal tasks: `kush-2.0-vision`
   - For high-performance needs: `kush-2.5-flash`

3. **Consider context length requirements**: If you need to process long documents, use models with larger context windows like `kush-2.5-pro` (256K tokens).

4. **Balance cost and performance**: Higher-capability models typically cost more per token. Use the most cost-effective model that meets your needs.

5. **Test beta models**: Our beta models (kush-2.5 series) offer cutting-edge capabilities but may change without notice. Test them for your use case before using in production.

## Model Versioning

Kushai follows a semantic versioning approach for models:

- **Major version** (e.g., 1.x, 2.x): Represents significant architecture changes
- **Minor version** (e.g., 2.0, 2.5): Represents meaningful improvements within the same architecture
- **Model variant** (e.g., pro, flash, vision): Represents specialization for different use cases

## Model Lifecycle

Models go through several phases:

1. **Beta**: New models with cutting-edge capabilities but may change without notice
2. **Stable**: Production-ready models with guaranteed stability
3. **Deprecated**: Models that will be removed in the future (typically after 6 months notice)

We recommend monitoring our changelog and documentation for updates on model availability and capabilities.

\`\`\`

Let's add a comprehensive README for the hackathon:
