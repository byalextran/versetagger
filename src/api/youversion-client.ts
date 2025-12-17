/**
 * YouVersion API client
 * Handles communication with YouVersion API through user-provided proxy
 */

import type { ScriptureReference } from '../parser/reference-parser';

/**
 * Verse content from API
 */
export interface VerseContent {
  /** Book code (e.g., "GEN", "MAT") */
  book: string;
  /** Chapter number */
  chapter: number;
  /** Array of verse objects with verse number and text */
  verses: VerseData[];
  /** Bible version used */
  version: string;
  /** Human-readable reference (e.g., "John 3:16") */
  reference: string;
}

/**
 * Individual verse data
 */
export interface VerseData {
  /** Verse number */
  number: number;
  /** Verse text content */
  text: string;
}

/**
 * API error types
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * YouVersion API client configuration
 */
export interface YouVersionClientConfig {
  /** Proxy URL that forwards requests to YouVersion */
  proxyUrl: string;
  /** Default Bible version */
  defaultVersion: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * YouVersion API client
 * Fetches verse content through a user-provided proxy server
 */
export class YouVersionClient {
  private config: Required<YouVersionClientConfig>;

  constructor(config: YouVersionClientConfig) {
    this.config = {
      timeout: 10000, // 10 seconds default
      debug: false,
      ...config
    };
  }

  /**
   * Fetch verse content for a scripture reference
   */
  async fetchVerse(reference: ScriptureReference): Promise<VerseContent> {
    const version = reference.version || this.config.defaultVersion;

    // Build request parameters
    const params = {
      book: reference.book,
      chapter: reference.chapter.toString(),
      verses: reference.verses.length > 0 ? reference.verses.join(',') : undefined,
      version: version
    };

    if (this.config.debug) {
      console.log('[YouVersionClient] Fetching verse:', params);
    }

    try {
      const response = await this.makeRequest(params);
      return this.parseResponse(response, reference, version);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Failed to fetch verse: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        error
      );
    }
  }

  /**
   * Make HTTP request to proxy
   */
  private async makeRequest(params: Record<string, string | undefined>): Promise<any> {
    // Build query string
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    }

    const url = `${this.config.proxyUrl}?${queryParams.toString()}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');

        if (response.status === 404) {
          throw new ApiError(
            `Verse not found. The reference may be invalid or not available in this version.`,
            404
          );
        }

        if (response.status === 429) {
          throw new ApiError(
            `Rate limit exceeded. Please try again later.`,
            429
          );
        }

        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}. ${errorText}`,
          response.status
        );
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(
          `Request timed out after ${this.config.timeout}ms`,
          undefined,
          error
        );
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          `Network error: Unable to connect to proxy server at ${this.config.proxyUrl}`,
          undefined,
          error
        );
      }

      throw error;
    }
  }

  /**
   * Parse API response into normalized format
   */
  private parseResponse(
    data: any,
    reference: ScriptureReference,
    version: string
  ): VerseContent {
    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new ApiError('Invalid API response: Expected JSON object');
    }

    // The proxy should return a standardized format:
    // {
    //   verses: [
    //     { number: 1, text: "In the beginning..." },
    //     { number: 2, text: "And the earth was..." }
    //   ],
    //   reference: "Genesis 1:1-2",
    //   version: "NIV"
    // }

    if (!Array.isArray(data.verses)) {
      throw new ApiError('Invalid API response: Missing or invalid verses array');
    }

    // Parse verses
    const verses: VerseData[] = data.verses.map((v: any) => {
      if (typeof v !== 'object' || v === null) {
        throw new ApiError('Invalid API response: Verse must be an object');
      }

      const number = typeof v.number === 'number' ? v.number : parseInt(v.number, 10);
      const text = typeof v.text === 'string' ? v.text : String(v.text);

      if (isNaN(number) || !text) {
        throw new ApiError('Invalid API response: Verse missing number or text');
      }

      return { number, text };
    });

    if (verses.length === 0) {
      throw new ApiError('Invalid API response: No verses found in response');
    }

    return {
      book: reference.book,
      chapter: reference.chapter,
      verses,
      version: data.version || version,
      reference: data.reference || this.formatReference(reference, version)
    };
  }

  /**
   * Format reference for display if not provided by API
   */
  private formatReference(ref: ScriptureReference, version: string): string {
    let result = `${ref.book} ${ref.chapter}`;

    if (ref.verses && ref.verses.length > 0) {
      if (ref.verses.length === 1) {
        result += `:${ref.verses[0]}`;
      } else {
        const min = Math.min(...ref.verses);
        const max = Math.max(...ref.verses);
        if (min === max) {
          result += `:${min}`;
        } else {
          result += `:${min}-${max}`;
        }
      }
    }

    result += ` ${version}`;
    return result;
  }

  /**
   * Update client configuration
   */
  updateConfig(config: Partial<YouVersionClientConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }
}
