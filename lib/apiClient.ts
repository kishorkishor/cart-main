/**
 * Single API client layer - all fetches go through this file
 * Supports seamless switching between mock and external APIs
 */

type ApiOptions = { 
  method?: string; 
  body?: any; 
  headers?: Record<string, string>;
  timeout?: number;
};

type ApiError = {
  status: number;
  message: string;
  data?: any;
};

// Environment-based API switching
const USE_EXTERNAL = process.env.NEXT_PUBLIC_USE_EXTERNAL_API === 'true';
const BASE_URL = USE_EXTERNAL
  ? process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL!
  : ''; // empty = use Next.js route handlers (/api/*)

// Default timeout (10 seconds)
const DEFAULT_TIMEOUT = 10000;

/**
 * Safely parse JSON response
 */
async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Create AbortController with timeout
 */
function createTimeoutController(timeout: number = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return {
    controller,
    cleanup: () => clearTimeout(timeoutId)
  };
}

/**
 * Retry mechanism with exponential backoff
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Main API client function
 */
export async function api(path: string, options: ApiOptions = {}): Promise<any> {
  const { method = 'GET', body, headers = {}, timeout = DEFAULT_TIMEOUT } = options;
  
  // Build URL
  const url = USE_EXTERNAL ? `${BASE_URL}${path}` : `/api${path}`;
  
  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const finalHeaders = { ...defaultHeaders, ...headers };

  // Create timeout controller
  const { controller, cleanup } = createTimeoutController(timeout);

  try {
    const response = await withRetry(async () => {
      const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        next: { revalidate: 0 }, // dev-friendly for Next.js
      });

      // Handle non-2xx responses
      if (!res.ok) {
        const errorData = await safeJson(res);
        const error: ApiError = {
          status: res.status,
          message: errorData?.message || `HTTP ${res.status}: ${res.statusText}`,
          data: errorData
        };
        throw error;
      }

      return res;
    });

    cleanup();
    return await safeJson(response);
  } catch (error) {
    cleanup();
    
    // Handle AbortError (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw {
        status: 408,
        message: 'Request timeout',
        data: null
      } as ApiError;
    }
    
    // Re-throw API errors
    if (typeof error === 'object' && error !== null && 'status' in error) {
      throw error;
    }
    
    // Handle network errors
    throw {
      status: 0,
      message: 'Network error',
      data: error
    } as ApiError;
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const apiClient = {
  get: (path: string, options?: Omit<ApiOptions, 'method'>) => 
    api(path, { ...options, method: 'GET' }),
    
  post: (path: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    api(path, { ...options, method: 'POST', body }),
    
  put: (path: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    api(path, { ...options, method: 'PUT', body }),
    
  patch: (path: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) => 
    api(path, { ...options, method: 'PATCH', body }),
    
  delete: (path: string, options?: Omit<ApiOptions, 'method'>) => 
    api(path, { ...options, method: 'DELETE' }),
};

/**
 * Upload file with progress tracking
 */
export async function uploadFile(
  path: string, 
  file: File, 
  onProgress?: (progress: number) => void
): Promise<any> {
  const url = USE_EXTERNAL ? `${BASE_URL}${path}` : `/api${path}`;
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    // Progress tracking
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });
    }

    // Success handler
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject({
          status: xhr.status,
          message: xhr.statusText,
          data: xhr.responseText
        });
      }
    });

    // Error handler
    xhr.addEventListener('error', () => {
      reject({
        status: 0,
        message: 'Upload failed',
        data: null
      });
    });

    // Add auth header if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    }

    xhr.open('POST', url);
    xhr.send(formData);
  });
}

/**
 * Type definitions for API responses
 */
export type ApiResponse<T = any> = {
  data: T;
  message?: string;
  status: number;
};

export type PaginatedResponse<T = any> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  status: number;
};

export { type ApiError };
