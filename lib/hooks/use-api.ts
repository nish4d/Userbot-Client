"use client"

// Custom hook for API calls with loading and error states
import { useState, useCallback } from "react"

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export const useApi = <T,>(apiFunction: () => Promise<T>): ApiState<T> & { refetch: () => Promise<void> } => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await apiFunction()
      setState({ data: result, loading: false, error: null })
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err : new Error("Unknown error"),
      })
    }
  }, [apiFunction])

  return {
    ...state,
    refetch,
  }
}
