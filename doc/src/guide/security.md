# Security Guide

This guide covers the security features and best practices implemented in Kushai.

## Authentication

Kushai uses a multi-layered authentication system:

### API Key Authentication

All API requests to Kushai require a valid API key. API keys are generated when you create an account and can be managed through the dashboard.

\`\`\`typescript
import { Kushai } from '@kushai/sdk';

// Initialize with your Kushai API key
const kushai = new Kushai('your-kushai-api-key');
\`\`\`

### User Authentication

For the web dashboard, Kushai uses JWT (JSON Web Token) authentication. Passwords are securely hashed using bcrypt before being stored in the database.

## Rate Limiting

Kushai implements rate limiting to protect against abuse and ensure fair usage:

- **Free Tier**: 10 requests per minute, 100 requests per day
- **Pro Tier**: 60 requests per minute, 1,000 requests per day
- **Enterprise Tier**: 300 requests per minute, 10,000 requests per day

Resource-intensive operations like image and video generation have more restrictive limits.

## Data Protection

### Password Security

User passwords are hashed using bcrypt with a cost factor of 10 before being stored in the database. This ensures that even if the database is compromised, passwords remain protected.

### API Key Management

- API keys are generated with a secure random algorithm
- Keys follow the format `ksh_(live|test)_[24 random characters]`
- Keys can be revoked at any time from the dashboard
- Last usage time is tracked for security monitoring

### Gemini API Key Protection

Kushai manages a pool of Google Gemini API keys internally. Users never interact directly with these keys, which provides several benefits:

1. Your application only needs to manage a single Kushai API key
2. We handle quota management and key rotation automatically
3. If a key becomes exhausted, requests are transparently retried with a different key

## Monitoring and Logging

Kushai implements comprehensive logging and monitoring:

- All API requests are logged with relevant metadata (excluding sensitive information)
- Failed authentication attempts are tracked and logged
- Slow requests are identified and logged for performance monitoring
- Usage statistics are collected for monitoring and optimization

## Best Practices

When using Kushai, follow these security best practices:

1. **Never hardcode API keys** in your application code
2. Use environment variables to store your Kushai API key
3. Implement proper error handling in your application
4. Regularly rotate your API keys, especially after team member changes
5. Use the minimum required permissions for your API keys

## Reporting Security Issues

If you discover a security vulnerability in Kushai, please report it by emailing security@kushai.com. We take security issues seriously and will respond promptly.
