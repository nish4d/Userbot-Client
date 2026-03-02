"use client"

import { useState, useCallback } from "react"

interface AsyncActionState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export const useAsyncAction = <T,>() => {
  const [state, setState] = useState<AsyncActionState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (action: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await action()
      setState({ data: result, loading: false, error: null })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error")
      setState({ data: null, loading: false, error })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
