# Cloudflare Worker Proxy for VerseTagger

This Cloudflare Worker acts as a secure proxy between your website and the YouVersion API, protecting your API key from being exposed in client-side code.

## Prerequisites

1. **Cloudflare Account**: Sign up at [Cloudflare Workers](https://workers.cloudflare.com/)
2. **YouVersion API Key**: Get one from [YouVersion Developers](https://developers.youversion.com/)
3. **Wrangler CLI**: Install globally with `npm install -g wrangler`

## Setup Instructions

### 1. Authenticate with Cloudflare

```bash
wrangler login
# Follow the link/instructions to authenticate
```

### 2. Deploy the worker to production

```bash
wrangler deploy
```

### 3. Set your YouVersion API key

```bash
wrangler secret put YOUVERSION_API_KEY
# Enter your API key when prompted
```

### 4. Test the deployment

After deployment, you'll get a URL like: `https://versetagger-proxy.your-subdomain.workers.dev`.

Visit that URL and you should see output similar to this:

```json
{"error":"Missing required parameters: book, chapter, and verses are required"}
```
