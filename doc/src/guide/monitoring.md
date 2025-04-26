# Monitoring and Logging

Kushai provides comprehensive monitoring and logging capabilities to help you track usage, diagnose issues, and optimize performance.

## Usage Tracking

All API requests are tracked with the following information:

- Request method and path
- Response status code
- Request duration
- User ID (if authenticated)
- API key (partially masked for security)

This data is used to generate usage statistics and identify performance bottlenecks.

## Rate Limit Monitoring

Kushai tracks rate limit usage for each API key. When a rate limit is exceeded, the following information is logged:

- API key (partially masked)
- Endpoint that was rate limited
- Timestamp of the rate limit event

This helps identify patterns of high usage and adjust rate limits accordingly.

## Error Tracking

Errors are tracked with detailed information to help diagnose issues:

- Error code and message
- Stack trace (in development environments)
- Request context (method, path, etc.)
- Timestamp

## Performance Monitoring

Kushai monitors the performance of API requests and logs slow requests (those taking more than 1 second to complete). This helps identify performance bottlenecks and optimize the system.

## Admin Dashboard

Enterprise customers have access to an admin dashboard that provides real-time monitoring of:

- API usage by endpoint
- Error rates
- Rate limit events
- Gemini API key pool status

## Logging

Kushai uses structured logging with the following log levels:

- **DEBUG**: Detailed information for debugging purposes
- **INFO**: General information about system operation
- **WARN**: Warning events that might require attention
- **ERROR**: Error events that might still allow the application to continue running

Logs are formatted as JSON for easy parsing and analysis.

## Integration with Monitoring Tools

Kushai can be integrated with popular monitoring tools:

### Prometheus

Kushai exposes metrics in Prometheus format at the `/metrics` endpoint (requires admin authentication).

### ELK Stack

Logs can be shipped to Elasticsearch for analysis with Kibana using Filebeat or similar tools.

### Custom Monitoring

For custom monitoring solutions, you can use the admin API to fetch usage statistics:

\`\`\`bash
curl -X GET https://api.kushai.com/v1/admin/stats \
  -H "X-Admin-Key: your-admin-key"
\`\`\`

## Best Practices

1. Regularly review usage statistics to optimize your application
2. Set up alerts for high error rates or rate limit events
3. Monitor API key usage to detect potential security issues
4. Use structured logging in your application for consistent log formats
