import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface CategoryImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  onImageRemove: () => void
}

export function CategoryImageUpload({
  currentImage,
  onImageChange,
  onImageRemove,
}: CategoryImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onImageChange(result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(undefined)
    onImageRemove()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="category-image">Category Image</Label>
      
      {preview ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={preview}
                alt="Category preview"
                className="size-full object-cover"
              />
              <Button
                variant="danger"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8">
              <ImageIcon className="size-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Upload a category image (max 5MB)
              </p>
              <Input
                id="category-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('category-image')?.click()}
              >
                <Upload className="size-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
