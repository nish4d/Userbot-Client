// Axios instance with interceptors for API calls
import axios, { type AxiosInstance, type AxiosError } from "axios"

// Create a single axios instance with relative paths to use Next.js API routes as proxies
const apiClient: AxiosInstance = axios.create({
  // Use relative paths so requests go through Next.js API routes (/app/api/*)
  baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

console.log('[API Client] Base URL: Using relative paths for Next.js API routes')

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Check if the request config has suppressErrorLogging flag to avoid logging
    if (error.config?.headers?.['X-Suppress-Error-Logging']) {
      return Promise.reject(error);
    }

    // Only log actual errors, not successful responses
    if (error.response) {
      // Server responded with error status
      console.error("[API Error]", {
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
      })
    } else if (error.request) {
      // Request was made but no response received
      console.error("[API Network Error]", {
        message: "No response received from server",
        url: error.config?.url,
        method: error.config?.method,
      })
    } else {
      // Something else happened
      console.error("[API Error]", {
        message: error.message,
        stack: error.stack,
      })
    }
    return Promise.reject(error)
  },
)

export { apiClient }

// API service functions
export const healthCheck = async () => {
  const response = await apiClient.get("/api/health", {
    headers: {
      'X-Suppress-Error-Logging': 'true'
    }
  })
  return response.data
}

export const getRules = async () => {
  const response = await apiClient.get("/api/rules", {
    headers: {
      'X-Suppress-Error-Logging': 'true'
    }
  })
  return response.data
}

export const createRule = async (rule: {
  triggers: string[]
  response: string
  enabled?: boolean
}) => {
  const response = await apiClient.post("/api/rules", rule, {
    headers: {
      'X-Suppress-Error-Logging': 'true'
    }
  })
  return response.data
}

export const updateRule = async (
  ruleId: string,
  updates: Partial<{
    triggers: string[]
    response: string
    enabled: boolean
  }>,
) => {
  const response = await apiClient.put(`/api/rules/${ruleId}`, updates, {
    headers: {
      'X-Suppress-Error-Logging': 'true'
    }
  })
  return response.data
}

export const deleteRule = async (ruleId: string) => {
  const response = await apiClient.delete(`/api/rules/${ruleId}`, {
    headers: {
      'X-Suppress-Error-Logging': 'true'
    }
  })
  return response.data
}

export const addToBlacklist = async (userId: number) => {
  const response = await apiClient.post("/api/blacklist", { user_id: userId }, {
    headers: {
      'X-Suppress-Error-Logging': 'true'
    }
  })
  return response.data
}

export const getBlacklist = async () => {
  const response = await apiClient.get("/api/blacklist", {
    headers: {
      'X-Suppress-Error-Logging': 'true'
    }
  })
  return response.data
}

export const removeFromBlacklist = async (id: string) => {
  const response = await apiClient.delete(`/api/blacklist/${id}`, {
    headers: {
      'X-Suppress-Error-Logging': 'true'
    }
  })
  return response.data
}