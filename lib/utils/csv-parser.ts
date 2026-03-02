export const csvParser = {
  parseCSV(content: string): number[] {
    return content
      .trim()
      .split("\n")
      .map((line) => Number.parseInt(line.trim()))
      .filter((id) => !isNaN(id) && id > 0)
  },

  exportToCSV(userIds: number[]): string {
    return userIds.join("\n")
  },

  exportRulesToCSV(rules: any[]): string {
    const headers = ["ID", "Triggers", "Response", "Enabled"]
    const rows = rules.map((rule) => [rule.id, (rule.triggers || []).join(", ") || rule.trigger || "", rule.response, rule.enabled ? "Yes" : "No"])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => (typeof cell === "string" ? `"${cell.replace(/"/g, '"')}"` : cell)).join(","),
      ),
    ].join("\n")

    return csvContent
  },

  downloadFile(content: string, filename: string, type = "text/plain"): void {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },
}
