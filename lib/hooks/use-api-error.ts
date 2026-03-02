"use client"

import { useState, useCallback } from "react"

interface ApiErrorState {
  error: Error | null
  isError: boolean
  showError: boolean
}

export const useApiError = () => {
  const [state, setState] = useState<ApiErrorState>({
    error: null,
    isError: false,
    showError: true,
  })

  const setError = useCallback((error: Error | null) => {
    setState({
      error,
      isError: !!error,
      showError: !!error,
    })
  }, [])

  const clearError = useCallback(() => {
    setState((s) => ({
      ...s,
      showError: false,
    }))
  }, [])

  const dismissError = useCallback(() => {
    setState({
      error: null,
      isError: false,
      showError: false,
    })
  }, [])

  return {
    ...state,
    setError,
    clearError,
    dismissError,
  }
}
