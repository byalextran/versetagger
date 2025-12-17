/**
 * Cloudflare Worker Proxy for YouVersion API
 *
 * This worker acts as a secure proxy between your website and the YouVersion API.
 * It protects your API key from being exposed in client-side code.
 *
 * Setup:
 * 1. Sign up for Cloudflare Workers: https://workers.cloudflare.com/
 * 2. Get a YouVersion API key: https://developers.youversion.com/
 * 3. Deploy this worker using Wrangler CLI
 * 4. Set the YOUVERSION_API_KEY secret in your worker settings
 *
 * Deploy:
 * $ npm install -g wrangler
 * $ wrangler secret put YOUVERSION_API_KEY
 * $ wrangler deploy
 */

/**
 * Environment bindings for Cloudflare Worker
 */
interface Env {
  /** YouVersion API key (stored as a secret) */
  YOUVERSION_API_KEY: string;
  /** YouVersion API base URL (configured per environment) */
  YOUVERSION_API_BASE_URL: string;
}

/**
 * CORS headers for browser requests
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
};

/**
 * Main worker handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return jsonResponse(
        { error: 'Method not allowed. Use GET.' },
        { status: 405, headers: CORS_HEADERS }
      );
    }

    try {
      // Parse request parameters
      const url = new URL(request.url);
      const params = {
        book: url.searchParams.get('book'),
        chapter: url.searchParams.get('chapter'),
        verses: url.searchParams.get('verses'),
        version: url.searchParams.get('version') || 'NIV'
      };

      // Validate required parameters
      if (!params.book || !params.chapter) {
        return jsonResponse(
          { error: 'Missing required parameters: book and chapter are required' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      // Check API key
      if (!env.YOUVERSION_API_KEY) {
        console.error('YOUVERSION_API_KEY not configured');
        return jsonResponse(
          { error: 'Server configuration error' },
          { status: 500, headers: CORS_HEADERS }
        );
      }

      // Fetch from YouVersion API
      const verseData = await fetchFromYouVersion(params, env);

      return jsonResponse(verseData, {
        headers: CORS_HEADERS
      });

    } catch (error) {
      console.error('Worker error:', error);

      if (error instanceof ApiError) {
        return jsonResponse(
          { error: error.message },
          { status: error.statusCode, headers: CORS_HEADERS }
        );
      }

      return jsonResponse(
        { error: 'Internal server error' },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch verse data from YouVersion API
 */
async function fetchFromYouVersion(
  params: {
    book: string | null;
    chapter: string | null;
    verses: string | null;
    version: string;
  },
  env: Env
): Promise<any> {
  // Build YouVersion API URL
  // Note: This is a placeholder. You'll need to adjust based on actual YouVersion API endpoints
  // The actual API endpoint structure depends on YouVersion's API documentation

  // Construct the API request URL based on YouVersion's actual API structure
  // This is an example format - adjust according to actual API docs
  const verseQuery = params.verses
    ? `${params.book}.${params.chapter}.${params.verses}`
    : `${params.book}.${params.chapter}`;

  const apiUrl = `${env.YOUVERSION_API_BASE_URL}/verses?reference=${verseQuery}&version=${params.version}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${env.YOUVERSION_API_KEY}`,
        'Accept': 'application/json',
        'User-Agent': 'VerseTagger-Proxy/1.0'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError(
          'Verse not found. The reference may be invalid or not available in this version.',
          404
        );
      }

      if (response.status === 429) {
        throw new ApiError('Rate limit exceeded. Please try again later.', 429);
      }

      if (response.status === 401 || response.status === 403) {
        throw new ApiError('API authentication failed. Check your API key.', 500);
      }

      throw new ApiError(
        `YouVersion API error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();

    // Transform YouVersion API response to normalized format
    // This transformation depends on the actual YouVersion API response structure
    return normalizeYouVersionResponse(data, params);

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.message.includes('fetch')) {
      throw new ApiError('Failed to connect to YouVersion API', 502);
    }

    throw new ApiError('Error fetching from YouVersion API', 500);
  }
}

/**
 * Normalize YouVersion API response to consistent format
 */
function normalizeYouVersionResponse(
  data: any,
  params: {
    book: string | null;
    chapter: string | null;
    verses: string | null;
    version: string;
  }
): any {
  // This function transforms the YouVersion API response into the format
  // expected by the VerseTagger client.
  //
  // Expected output format:
  // {
  //   verses: [
  //     { number: 1, text: "In the beginning..." },
  //     { number: 2, text: "And the earth was..." }
  //   ],
  //   reference: "Genesis 1:1-2",
  //   version: "NIV"
  // }

  // Example transformation (adjust based on actual YouVersion API structure):
  if (!data || !data.verses) {
    throw new ApiError('Invalid response from YouVersion API', 502);
  }

  const verses = Array.isArray(data.verses)
    ? data.verses.map((v: any) => ({
        number: v.verse_number || v.number,
        text: v.text || v.content || ''
      }))
    : [];

  if (verses.length === 0) {
    throw new ApiError('No verses found in API response', 404);
  }

  return {
    verses,
    reference: data.reference || buildReference(params),
    version: data.version || params.version
  };
}

/**
 * Build reference string from parameters
 */
function buildReference(params: {
  book: string | null;
  chapter: string | null;
  verses: string | null;
  version: string;
}): string {
  let ref = `${params.book} ${params.chapter}`;
  if (params.verses) {
    ref += `:${params.verses}`;
  }
  ref += ` ${params.version}`;
  return ref;
}

/**
 * Helper to create JSON response with proper headers
 */
function jsonResponse(data: any, options: { status?: number; headers?: HeadersInit } = {}): Response {
  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
}
