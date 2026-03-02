export const validators = {
  isValidTelegramUserId(id: any): boolean {
    return Number.isInteger(id) && id > 0
  },

  isValidTriggers(triggers: string[]): boolean {
    if (triggers.length === 0) return true
    return triggers.every(trigger => trigger.length > 0 && trigger.length <= 100)
  },

  isValidResponse(response: string): boolean {
    return response.length > 0 && response.length <= 4096
  },

  isValidJSON(str: string): boolean {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  },

  isValidCSV(content: string): boolean {
    const lines = content.trim().split("\n")
    if (lines.length === 0) return false

    for (const line of lines) {
      const values = line.split(",")
      for (const value of values) {
        if (!this.isValidTelegramUserId(Number.parseInt(value.trim()))) {
          return false
        }
      }
    }
    return true
  },
}
