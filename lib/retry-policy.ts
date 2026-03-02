export interface RetryOptions {
  maxRetries: number
  delayMs: number
  backoffMultiplier: number
  maxDelayMs: number
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 10000,
}

export async function withRetry<T>(fn: () => Promise<T>, options: Partial<RetryOptions> = {}): Promise<T> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options }
  let lastError: Error | null = null
  let delay = config.delayMs

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < config.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs)
      }
    }
  }

  throw lastError
}

export const retryableStatusCodes = new Set([408, 429, 500, 502, 503, 504])

export const isRetryableError = (error: any): boolean => {
  if (!error?.response) return true // Network errors are retryable
  return retryableStatusCodes.has(error.response.status)
}
