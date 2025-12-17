# Cloudflare Worker Proxy for VerseTagger

This Cloudflare Worker acts as a secure proxy between your website and the YouVersion API, protecting your API key from being exposed in client-side code.

## Features

- ✅ Secure API key storage (never exposed to browser)
- ✅ CORS support for browser requests
- ✅ Optional KV caching for better performance
- ✅ Error handling and validation
- ✅ Rate limit protection

## Prerequisites

1. **Cloudflare Account**: Sign up at [Cloudflare Workers](https://workers.cloudflare.com/)
2. **YouVersion API Key**: Get one from [YouVersion Developers](https://developers.youversion.com/)
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`

## Setup Instructions

### 1. Clone or copy these files

```bash
# Navigate to your project
cd your-project

# Copy the example files
cp -r examples/cloudflare-worker ./my-versetagger-proxy
cd my-versetagger-proxy
```

### 2. Configure the worker

Edit `wrangler.toml` to set your worker name:

```toml
name = "my-versetagger-proxy"  # Change this to your desired worker name
```

### 3. Authenticate with Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate.

### 4. Set your YouVersion API key

```bash
wrangler secret put YOUVERSION_API_KEY
# Enter your API key when prompted
```

### 5. Deploy the worker

```bash
wrangler deploy
```

After deployment, you'll get a URL like:
```
https://my-versetagger-proxy.your-subdomain.workers.dev
```

### 6. Test the deployment

```bash
curl "https://my-versetagger-proxy.your-subdomain.workers.dev?book=JHN&chapter=3&verses=16&version=NIV"
```

You should get a JSON response with the verse content.

## Optional: Enable KV Caching

For better performance, enable Cloudflare KV to cache verse responses:

### 1. Create a KV namespace

```bash
wrangler kv:namespace create "VERSE_CACHE"
wrangler kv:namespace create "VERSE_CACHE" --preview
```

### 2. Update wrangler.toml

Uncomment and update the KV bindings section with the IDs from the previous step:

```toml
[[kv_namespaces]]
binding = "VERSE_CACHE"
id = "abc123..."              # Your production namespace ID
preview_id = "xyz789..."      # Your preview namespace ID
```

### 3. Redeploy

```bash
wrangler deploy
```

Now verse responses will be cached for 1 hour, reducing API calls and improving response times.

## Usage in VerseTagger

Once deployed, use your worker URL in the VerseTagger configuration:

```javascript
const versetagger = new VerseTagger({
  proxyUrl: 'https://my-versetagger-proxy.your-subdomain.workers.dev'
});
```

## API Endpoint

### GET /?book=BOOK&chapter=CHAPTER&verses=VERSES&version=VERSION

**Query Parameters:**
- `book` (required): Book code (e.g., "GEN", "JHN", "MAT")
- `chapter` (required): Chapter number
- `verses` (optional): Comma-separated verse numbers (e.g., "16" or "1,2,3")
- `version` (optional): Bible version (default: "NIV")

**Example:**
```
GET /?book=JHN&chapter=3&verses=16&version=NIV
```

**Response:**
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

## Important Notes

⚠️ **API Key Security**: Never commit your API key to version control. Always use Wrangler secrets.

⚠️ **YouVersion API**: This example includes placeholder code. You must update `worker.ts` to match the actual YouVersion API endpoints and response format based on their official documentation.

⚠️ **CORS Configuration**: The worker allows requests from any origin (`*`). For production, consider restricting this to your specific domains.

⚠️ **Rate Limiting**: The YouVersion API may have rate limits. Consider implementing additional rate limiting in the worker if needed.

## Custom Domain (Optional)

To use a custom domain instead of the workers.dev URL:

1. Add a route in `wrangler.toml`:
```toml
[env.production]
routes = [
  { pattern = "api.yourdomain.com/verses", zone_name = "yourdomain.com" }
]
```

2. Set up DNS in Cloudflare dashboard to point to your worker

3. Deploy: `wrangler deploy --env production`

## Troubleshooting

### "API authentication failed"
- Check that your API key is set correctly: `wrangler secret list`
- Verify the API key is valid with YouVersion

### "CORS error" in browser
- Make sure your worker is deployed and accessible
- Check browser console for the specific CORS error
- Verify the worker is returning CORS headers

### "Verse not found"
- Verify the book code is correct (see book-mappings.ts)
- Check that the chapter and verse exist in that book
- Try a different Bible version

## Development

To test locally:

```bash
wrangler dev
```

This starts a local server at `http://localhost:8787`

## License

This example is provided under the MIT License, same as VerseTagger.
