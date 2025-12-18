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
  /** Verse text content from API */
  content: string;
  /** Verse range string (e.g., "1-3", "1,3,5-7") */
  verses: string;
  /** Bible version used */
  version: string;
  /** Human-readable reference (e.g., "John 3:16") */
  reference: string;
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
      verses: reference.verses || undefined,
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

    if (this.config.debug) {
      console.log('[YouVersionClient] Proxy response:', JSON.stringify(data, null, 2));
    }

    // The proxy should return data in the format:
    // { id: "GEN.1.1", content: "In the beginning...", reference: "Genesis 1:1" }
    // The content field contains all requested verses combined (without verse numbers)

    if (!data.content || typeof data.content !== 'string') {
      throw new ApiError(`Invalid API response: Expected 'content' field with verse text. Got: ${JSON.stringify(data)}`);
    }

    // Return the content directly without wrapping in verse objects
    return {
      book: reference.book,
      chapter: reference.chapter,
      content: data.content,
      verses: reference.verses,
      version: data.version || version,
      reference: data.reference || this.formatReference(reference, version)
    };
  }

  /**
   * Format reference for display if not provided by API
   */
  private formatReference(ref: ScriptureReference, version: string): string {
    let result = `${ref.book} ${ref.chapter}`;

    if (ref.verses) {
      result += `:${ref.verses}`;
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
