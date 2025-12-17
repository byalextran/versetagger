# Cloudflare Proxy Setup Guide

This guide will walk you through setting up a Cloudflare Worker proxy for VerseTagger. The proxy securely handles API requests to YouVersion, keeping your API key safe from client-side exposure.

## Why a Proxy?

VerseTagger requires a server-side proxy for security:

1. **API Key Protection**: Your YouVersion API key never gets exposed in browser code
2. **CORS Support**: Handles cross-origin requests properly
3. **Rate Limiting**: You can implement your own rate limiting
4. **Caching**: Optional caching to improve performance and reduce API calls
5. **Request Validation**: Validate and sanitize requests before hitting the API

## Prerequisites

Before you begin, you'll need:

1. **Cloudflare Account** (free tier is fine)
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - No credit card required for Workers free tier

2. **YouVersion API Key**
   - Get one at [developers.youversion.com](https://developers.youversion.com)
   - Follow their registration process

3. **Wrangler CLI** (Cloudflare's deployment tool)
   ```bash
   npm install -g wrangler
   ```

## Quick Setup (5 Minutes)

### Step 1: Get the Worker Code

Copy the example worker from the VerseTagger repository:

```bash
# If you installed via npm
cp -r node_modules/versetagger/examples/cloudflare-worker ./my-versetagger-proxy
cd my-versetagger-proxy
```

Or download from GitHub:
- [worker.ts](https://github.com/yourusername/versetagger/blob/main/examples/cloudflare-worker/worker.ts)
- [wrangler.toml](https://github.com/yourusername/versetagger/blob/main/examples/cloudflare-worker/wrangler.toml)

### Step 2: Configure the Worker

Edit `wrangler.toml` and set your worker name:

```toml
name = "my-versetagger-proxy"  # Change this to your preferred name
main = "worker.ts"
compatibility_date = "2024-01-01"
```

### Step 3: Authenticate with Cloudflare

```bash
wrangler login
```

This opens your browser to authenticate. You'll need to allow Wrangler to access your Cloudflare account.

### Step 4: Set Your API Key

Store your YouVersion API key as a secret (it won't be visible in code):

```bash
wrangler secret put YOUVERSION_API_KEY
```

When prompted, paste your YouVersion API key and press Enter.

### Step 5: Deploy

```bash
wrangler deploy
```

You'll get a URL like:
```
https://my-versetagger-proxy.your-subdomain.workers.dev
```

**Save this URL** - you'll use it in your VerseTagger configuration!

### Step 6: Test It

```bash
curl "https://my-versetagger-proxy.your-subdomain.workers.dev?book=JHN&chapter=3&verses=16&version=NIV"
```

You should see a JSON response with verse content.

### Step 7: Use in VerseTagger

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-versetagger-proxy.your-subdomain.workers.dev'
});
```

That's it! Your proxy is live and VerseTagger can now fetch verses.

## Advanced Setup

### Enable Caching with Cloudflare KV

Cloudflare KV (Key-Value storage) can cache verse responses, reducing API calls and improving performance.

#### 1. Create a KV Namespace

```bash
# Create production namespace
wrangler kv:namespace create "VERSE_CACHE"

# Create preview namespace (for testing)
wrangler kv:namespace create "VERSE_CACHE" --preview
```

You'll get output like:
```
{ binding = "VERSE_CACHE", id = "abc123..." }
{ binding = "VERSE_CACHE", preview_id = "xyz789..." }
```

#### 2. Update wrangler.toml

Add the KV binding to your `wrangler.toml`:

```toml
name = "my-versetagger-proxy"
main = "worker.ts"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "VERSE_CACHE"
id = "abc123..."              # Your production ID from step 1
preview_id = "xyz789..."      # Your preview ID from step 1
```

#### 3. Update worker.ts

Add KV caching to your worker. Update the `Env` interface:

```typescript
interface Env {
  YOUVERSION_API_KEY: string;
  VERSE_CACHE: KVNamespace;  // Add this line
}
```

Add caching logic to the fetch handler:

```typescript
// Before fetching from YouVersion API, check cache
const cacheKey = `${params.book}_${params.chapter}_${params.verses}_${params.version}`;

if (env.VERSE_CACHE) {
  const cached = await env.VERSE_CACHE.get(cacheKey);
  if (cached) {
    return jsonResponse(JSON.parse(cached), { headers: CORS_HEADERS });
  }
}

// Fetch from API
const verseData = await fetchFromYouVersion(params, env.YOUVERSION_API_KEY);

// Cache the result (1 hour TTL)
if (env.VERSE_CACHE) {
  await env.VERSE_CACHE.put(cacheKey, JSON.stringify(verseData), {
    expirationTtl: 3600  // 1 hour
  });
}

return jsonResponse(verseData, { headers: CORS_HEADERS });
```

#### 4. Redeploy

```bash
wrangler deploy
```

Now verse responses will be cached for 1 hour, dramatically reducing API calls!

### Custom Domain Setup

Instead of using the `*.workers.dev` domain, you can use your own domain.

#### Prerequisites
- A domain registered with Cloudflare (or transferred to Cloudflare)

#### Setup

1. Add a route in `wrangler.toml`:

```toml
[env.production]
routes = [
  { pattern = "api.yourdomain.com/verses", zone_name = "yourdomain.com" }
]
```

2. Deploy to production environment:

```bash
wrangler deploy --env production
```

3. Update your DNS in Cloudflare dashboard:
   - Add a CNAME record for `api.yourdomain.com` pointing to your worker

4. Use custom domain in VerseTagger:

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://api.yourdomain.com/verses'
});
```

### Rate Limiting

Protect your proxy from abuse by adding rate limiting:

```typescript
// Add to your worker
const RATE_LIMIT = 100;  // Requests per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// In your fetch handler
const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
if (!checkRateLimit(clientIp)) {
  return jsonResponse(
    { error: 'Rate limit exceeded' },
    { status: 429, headers: CORS_HEADERS }
  );
}
```

### Restricting Origins

For production, restrict which domains can use your proxy:

```typescript
const ALLOWED_ORIGINS = [
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

function getCorsHeaders(origin: string | null): HeadersInit {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
  }

  // Reject requests from unknown origins
  return {};
}

// In your fetch handler
const origin = request.headers.get('Origin');
const corsHeaders = getCorsHeaders(origin);

if (Object.keys(corsHeaders).length === 0) {
  return new Response('Forbidden', { status: 403 });
}
```

## API Endpoint Reference

Your proxy accepts GET requests with these parameters:

### Request Parameters

| Parameter | Type   | Required | Description                     | Example      |
|-----------|--------|----------|---------------------------------|--------------|
| `book`    | string | Yes      | Book code (see book mappings)   | `JHN`        |
| `chapter` | number | Yes      | Chapter number                  | `3`          |
| `verses`  | string | No       | Comma-separated verse numbers   | `16` or `1,2,3` |
| `version` | string | No       | Bible version (default: NIV)    | `ESV`        |

### Example Requests

```bash
# Single verse
curl "https://your-proxy.workers.dev?book=JHN&chapter=3&verses=16&version=NIV"

# Multiple verses
curl "https://your-proxy.workers.dev?book=ROM&chapter=8&verses=28,29,30&version=ESV"

# Entire chapter
curl "https://your-proxy.workers.dev?book=PSA&chapter=23&version=NIV"
```

### Response Format

```json
{
  "verses": [
    {
      "number": 16,
      "text": "For God so loved the world that he gave his one and only Son..."
    }
  ],
  "reference": "John 3:16 NIV",
  "version": "NIV"
}
```

### Error Responses

```json
{
  "error": "Missing required parameters: book and chapter are required"
}
```

Status codes:
- `400` - Bad request (missing parameters)
- `404` - Verse not found
- `429` - Rate limit exceeded
- `500` - Server error
- `502` - YouVersion API error

## Monitoring and Debugging

### View Logs

```bash
# Stream live logs
wrangler tail

# View recent logs in dashboard
# Visit: https://dash.cloudflare.com → Workers & Pages → Your Worker → Logs
```

### Test Locally

```bash
# Run worker locally
wrangler dev

# Test locally
curl "http://localhost:8787?book=JHN&chapter=3&verses=16&version=NIV"
```

### Analytics

View usage analytics in Cloudflare dashboard:
- Requests per second
- Success rate
- Error rate
- Geographic distribution

## Troubleshooting

### "API authentication failed"

**Cause:** API key not set or invalid

**Solution:**
```bash
# Check if secret is set
wrangler secret list

# Update the secret
wrangler secret put YOUVERSION_API_KEY
```

### "CORS error" in browser

**Cause:** CORS headers not configured properly

**Solutions:**
- Verify worker is deployed: `wrangler deploy`
- Check worker URL is correct
- Ensure CORS_HEADERS are returned in all responses

### "Verse not found"

**Cause:** Invalid reference or YouVersion API issue

**Solutions:**
- Verify book code is correct (see `src/parser/book-mappings.ts`)
- Check chapter and verse exist in that book
- Try a different Bible version
- Check YouVersion API status

### "Rate limit exceeded"

**Cause:** Too many requests to YouVersion API

**Solutions:**
- Implement KV caching (see Advanced Setup)
- Add rate limiting to your worker
- Upgrade your YouVersion API plan if needed

### Worker not deploying

**Cause:** Various configuration issues

**Solutions:**
```bash
# Check for syntax errors
wrangler deploy --dry-run

# Verify wrangler.toml is valid
cat wrangler.toml

# Ensure you're logged in
wrangler whoami
```

## Security Best Practices

1. **Never commit API keys** - Always use `wrangler secret put`
2. **Restrict origins** - Don't use `Access-Control-Allow-Origin: *` in production
3. **Implement rate limiting** - Protect against abuse
4. **Monitor usage** - Set up alerts for unusual activity
5. **Use HTTPS only** - Workers automatically use HTTPS
6. **Validate input** - Sanitize all query parameters
7. **Keep dependencies updated** - Regularly update worker code

## Cost

Cloudflare Workers free tier includes:
- 100,000 requests per day
- 10ms CPU time per request
- KV: 100,000 reads/day, 1,000 writes/day

This is usually sufficient for small to medium sites. For higher traffic:
- Workers Paid: $5/month for 10M requests
- See [Cloudflare pricing](https://workers.cloudflare.com/pricing)

## Alternative Proxy Options

While we recommend Cloudflare Workers, you can use other platforms:

### Vercel Edge Functions
- Similar to Workers
- Good integration with Next.js
- Free tier: 100GB bandwidth

### AWS Lambda
- More complex setup
- Pay per request
- Requires API Gateway

### Your Own Server
- Node.js, Python, PHP, etc.
- Full control
- Requires server management

See the worker code for implementation examples that can be adapted to any platform.

## Next Steps

- [Getting Started Guide](./getting-started.md) - Integrate VerseTagger
- [Configuration Guide](./configuration.md) - Configure VerseTagger
- [API Reference](./api-reference.md) - VerseTagger API docs

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Issues](https://github.com/yourusername/versetagger/issues)
