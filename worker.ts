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
      if (!params.book || !params.chapter || !params.verses) {
        return jsonResponse(
          { error: 'Missing required parameters: book, chapter, and verses are required' },
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
 * Map common Bible version abbreviations to YouVersion bible_id
 * Default is 206 (NIV) as per API documentation
 */
const VERSION_MAP: Record<string, number> = {
  'NIV': 206,
  'KJV': 1,
  'ESV': 59,
  'NLT': 116,
  'NKJV': 114,
  'NASB': 100,
  // Add more versions as needed
};

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
  // Get bible_id from version map (default to NIV if not found)
  const bibleId = VERSION_MAP[params.version.toUpperCase()] || VERSION_MAP['NIV'];

  // Build passage_id in USFM format (e.g., "JHN.3.16" for John 3:16)
  // Verses are required - chapter-only references are not supported
  const passageId = `${params.book}.${params.chapter}.${params.verses}`;

  // Construct YouVersion API URL: /v1/bibles/{bible_id}/passages/{passage_id}
  const apiUrl = `${env.YOUVERSION_API_BASE_URL}/bibles/${bibleId}/passages/${passageId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-YVP-App-Key': `${env.YOUVERSION_API_KEY}`,
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

    // Return YouVersion API response as-is
    // VerseTagger will use the 'content' field directly
    return data;

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
