// Environment configuration for Telegram userbot dashboard
export const config = {
  // API endpoints
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://userbot-blue.vercel.app",
    timeout: 10000,
  },

  // Telegram configuration
  telegram: {
    apiId: process.env.NEXT_PUBLIC_TELEGRAM_API_ID,
    apiHash: process.env.NEXT_PUBLIC_TELEGRAM_API_HASH,
    phone: process.env.TELEGRAM_PHONE,
  },

  // MongoDB configuration
  db: {
    url: process.env.MONGODB_URL,
  },

  // Server configuration
  server: {
    port: process.env.PORT || 8000,
  },
}

// Validate required environment variables
export const validateEnv = () => {
  const required = ["NEXT_PUBLIC_TELEGRAM_API_ID", "NEXT_PUBLIC_TELEGRAM_API_HASH", "TELEGRAM_PHONE", "MONGODB_URL"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.warn("[Config] Missing environment variables:", missing)
  }
}