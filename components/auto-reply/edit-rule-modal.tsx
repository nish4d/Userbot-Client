"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { MultiTriggerInput } from "@/components/ui/multi-trigger-input"
import { X, Upload, Image as ImageIcon, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useRulesStore } from "@/lib/store/use-rules-store"
import { useToast } from "@/hooks/use-toast"
import type { Rule } from "@/lib/types"
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/utils/cloudinary"

interface EditRuleModalProps {
  isOpen: boolean
  onClose: () => void
  rule?: Rule | null
}

export function EditRuleModal({ isOpen, onClose, rule }: EditRuleModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{
    triggers: string[]
    response: string
    enabled: boolean
    image_url: string
  }>({
    defaultValues: { triggers: [], response: "", enabled: true, image_url: "" },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateRule } = useRulesStore()
  const { toast } = useToast()
  const response = watch("response")
  const imageUrl = watch("image_url")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)

  // Reset form when rule changes
  useEffect(() => {
    if (rule) {
      reset({
        triggers: rule.triggers || (rule.trigger ? [rule.trigger] : []),
        response: rule.response,
        enabled: rule.enabled,
        image_url: rule.image_url || "",
      })
      setOriginalImageUrl(rule.image_url || null)
    }
  }, [rule, reset])

  if (!isOpen || !rule) return null

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const url = await uploadImageToCloudinary(file)
      setValue("image_url", url)
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    const currentImageUrl = imageUrl
    if (currentImageUrl) {
      try {
        // Delete from Cloudinary
        await deleteImageFromCloudinary(currentImageUrl)
        setValue("image_url", "")
        toast({
          title: "Success",
          description: "Image removed successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to remove image",
          variant: "destructive",
        })
      }
    }
  }

  const onSubmit = async (data: { triggers: string[]; response: string; image_url: string; enabled: boolean }) => {
    setIsSubmitting(true)
    try {
      await updateRule(rule.id, {
        triggers: data.triggers || [],
        response: data.response,
        image_url: data.image_url || null,
        enabled: data.enabled,
      })
      toast({
        title: "Success",
        description: "Auto-reply rule updated",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update rule",
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
          <h2 className="text-xl font-bold text-foreground">Edit Auto Reply Rule</h2>
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
            <label className="text-sm font-medium text-foreground">Trigger Keywords (optional)</label>
            <MultiTriggerInput
              value={watch("triggers")}
              onChange={(triggers) => setValue("triggers", triggers)}
              placeholder="Type a keyword and press Enter"
              className="bg-input border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">Press Enter after each keyword. Leave empty for default response</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Response Message</label>
            <textarea
              {...register("response", { required: "Response is required" })}
              placeholder="Your automatic response message..."
              rows={4}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Character count</span>
              <span className={response.length > 1000 ? "text-destructive" : "text-muted-foreground"}>
                {response.length} / 1000
              </span>
            </div>
            {errors.response && <p className="text-xs text-destructive">{errors.response.message}</p>}
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Image Attachment (optional)</label>
            
            {imageUrl ? (
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt="Uploaded preview" 
                  className="w-full h-40 object-cover rounded-lg border border-border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {uploading ? "Uploading..." : "Click to upload an image"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max file size: 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <label className="text-sm font-medium text-foreground">Enable this rule</label>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Switch {...register("enabled")} />
            </motion.div>
          </div>

          {(response || imageUrl) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-primary/10 border border-primary/20 rounded-lg"
            >
              <p className="text-xs text-muted-foreground mb-1">Preview</p>
              <p className="text-sm text-foreground">{response}</p>
              {imageUrl && (
                <div className="mt-2">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded border border-border"
                  />
                </div>
              )}
            </motion.div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-border bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || uploading} className="flex-1 bg-primary hover:bg-primary/90">
              {isSubmitting ? "Updating..." : "Update Rule"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}