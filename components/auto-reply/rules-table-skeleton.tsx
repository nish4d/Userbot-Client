"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export function RulesTableSkeleton() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Rules</CardTitle>
            <CardDescription>Manage your automatic reply triggers</CardDescription>
          </div>
          <div className="h-8 w-32">
            <LoadingSkeleton className="h-full w-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left w-8">
                  <LoadingSkeleton className="h-4 w-4 rounded" />
                </th>
                <th className="px-4 py-3 text-left">
                  <LoadingSkeleton className="h-4 w-16" />
                </th>
                <th className="px-4 py-3 text-left">
                  <LoadingSkeleton className="h-4 w-20" />
                </th>
                <th className="px-4 py-3 text-center">
                  <LoadingSkeleton className="h-4 w-12 mx-auto" />
                </th>
                <th className="px-4 py-3 text-center">
                  <LoadingSkeleton className="h-4 w-16 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="px-4 py-3">
                    <LoadingSkeleton className="h-4 w-4 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <LoadingSkeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <LoadingSkeleton className="h-4 w-32" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <LoadingSkeleton className="h-6 w-12 mx-auto rounded-full" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                      <LoadingSkeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}