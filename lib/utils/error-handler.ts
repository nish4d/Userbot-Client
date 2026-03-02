import axios, { type AxiosError } from "axios"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    const statusCode = axiosError.response?.status
    const data = axiosError.response?.data

    let message = "An error occurred"

    if (statusCode === 400) message = "Bad request. Please check your input."
    else if (statusCode === 401) message = "Unauthorized. Please log in again."
    else if (statusCode === 403) message = "Forbidden. You do not have permission."
    else if (statusCode === 404) message = "Resource not found."
    else if (statusCode === 409) message = "Conflict. This resource already exists."
    else if (statusCode === 422) message = "Validation failed. Please check your data."
    else if (statusCode === 429) message = "Too many requests. Please try again later."
    else if (statusCode === 500) message = "Server error. Please try again later."
    else if (statusCode === 503) message = "Service unavailable. Please try again later."
    else if (error.message === "Network Error") message = "Network error. Please check your connection."
    else message = error.message || message

    return new ApiError(message, statusCode, data)
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError("An unexpected error occurred")
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred"
}

export const isNetworkError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    return !error.response
  }
  return false
}
