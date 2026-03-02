"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useBlacklistStore } from "@/lib/store/use-blacklist-store"
import { useToast } from "@/hooks/use-toast"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { userId: "", reason: "" },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToBlacklist } = useBlacklistStore()
  const { toast } = useToast()
  const userId = watch("userId")

  if (!isOpen) return null

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await addToBlacklist(Number.parseInt(data.userId, 10))
      toast({
        title: "Success",
        description: "User added to blacklist",
      })
      reset()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.2 }}
        className="bg-card border border-border rounded-lg max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Block User</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Telegram User ID</label>
            <Input
              {...register("userId", {
                required: "User ID is required",
                pattern: { value: /^\d+$/, message: "Must be a valid number" },
              })}
              placeholder="e.g., 123456789"
              className="bg-input border-border text-foreground"
              type="number"
            />
            {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason for Blocking</label>
            <select
              {...register("reason")}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Optional</option>
              <option value="Spam">Spam</option>
              <option value="Abuse">Abuse</option>
              <option value="Harassment">Harassment</option>
              <option value="Malicious">Malicious Activity</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Additional Notes (optional)</label>
            <textarea
              {...register("notes")}
              placeholder="Add any additional information..."
              rows={3}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {userId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-primary/10 border border-primary/20 rounded-lg"
            >
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm text-foreground font-medium">User ID valid ✓</p>
            </motion.div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-border bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Blocking...
                </span>
              ) : (
                "Block User"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
