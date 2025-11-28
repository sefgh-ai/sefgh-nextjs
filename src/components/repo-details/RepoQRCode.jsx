'use client'

import { useState, useEffect } from 'react'
import { QrCode, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function RepoQRCode({ repoFullName }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      generateQRCode()
    }
  }, [isOpen, repoFullName])

  const generateQRCode = async () => {
    // Use public QR code API
    const url = `https://github.com/${repoFullName}`
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
    setQrCodeUrl(qrUrl)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `${repoFullName.replace('/', '-')}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Show QR Code">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Repository QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {qrCodeUrl ? (
            <>
              <div className="p-4 bg-card dark:bg-white rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Scan to visit {repoFullName} on GitHub
              </p>
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </>
          ) : (
            <div className="w-64 h-64 bg-muted animate-pulse rounded-lg" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
