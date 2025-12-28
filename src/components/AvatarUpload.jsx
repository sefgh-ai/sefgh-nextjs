'use client'

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, Camera, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { useSendNotification, NotificationTemplates } from '@/hooks/useSendNotification'

export function AvatarUpload({ currentAvatarUrl, userInitials, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const { refreshUser } = useAuth()
  const { sendFromTemplate } = useSendNotification()

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please upload a JPEG, PNG, GIF, or WebP image.',
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 5MB.',
      })
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', selectedFile)

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      console.log('✅ Upload API returned:', data.avatar_url)
      
      // Small delay to ensure metadata is propagated (reduced from 500ms to 200ms)
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Refresh user data to get updated avatar
      const updatedUser = await refreshUser()
      console.log('🔄 After refresh, avatar_url:', updatedUser?.user_metadata?.avatar_url)

      toast.success('Avatar updated! 🎉', {
        description: 'Your profile picture has been updated successfully.',
      })
      
      // Send notification
      await sendFromTemplate(null, NotificationTemplates.avatarUpdated())

      // Clear preview
      setPreviewUrl(null)
      setSelectedFile(null)
      
      // Call callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(data.avatar_url)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed', {
        description: error.message || 'Failed to upload avatar. Please try again.',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayUrl = previewUrl || currentAvatarUrl

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
          <AvatarImage src={displayUrl} alt="Profile picture" />
          <AvatarFallback className="text-4xl">{userInitials}</AvatarFallback>
        </Avatar>
        
        {!previewUrl && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="h-8 w-8 text-white" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {previewUrl ? (
        <div className="flex gap-2">
          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            size="sm"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
          <Button 
            onClick={handleCancel} 
            disabled={uploading}
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          size="sm"
        >
          <Camera className="h-4 w-4 mr-2" />
          Change Photo
        </Button>
      )}

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        JPG, PNG, GIF or WebP. Max size 5MB.
      </p>
    </div>
  )
}
