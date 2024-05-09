import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploaderProps {
  onImagesUploaded: (images: File[]) => void
  onCustomTokenChange: (token: string) => void
  onCustomInstructionChange: (instruction: string) => void
  onInherentAttributesChange: (attributes: string) => void
  apiKey: string
  onApiKeyChange: (apiKey: string) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesUploaded,
  onCustomTokenChange,
  onCustomInstructionChange,
  onInherentAttributesChange,
  apiKey,
  onApiKeyChange,
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [customToken, setCustomToken] = useState("")
  const [customInstruction, setCustomInstruction] = useState("")
  const [inherentAttributes, setInherentAttributes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const images = Array.from(files)
      setSelectedImages(images)
      onImagesUploaded(images)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Dataset</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-9">
            <Label htmlFor="customToken">Custom Token</Label>
            <Input
              id="customToken"
              type="text"
              value={customToken}
              onChange={(e) => {
                setCustomToken(e.target.value)
                onCustomTokenChange(e.target.value)
              }}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Label htmlFor="inherentAttributes">Inherent Attributes</Label>
            <Input
              id="inherentAttributes"
              type="text"
              value={inherentAttributes}
              onChange={(e) => {
                setInherentAttributes(e.target.value)
                onInherentAttributesChange(e.target.value)
              }}
            />
          </div>
          <div className="flex items-center space-x-1">
            <Label htmlFor="customInstruction">
              Custom Instruction<span className="text-gray-500">*</span>
            </Label>
            <Input
              id="customInstruction"
              type="text"
              value={customInstruction}
              onChange={(e) => {
                setCustomInstruction(e.target.value)
                onCustomInstructionChange(e.target.value)
              }}
            />
          </div>
          <div className="flex items-center space-x-9">
            <Label htmlFor="imageUpload">Upload Images</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </div>
          <div>
            <Label>
              <span className="text-gray-500">*Optional</span>
            </Label>
          </div>
          <Button
            type="button"
            onClick={() => onImagesUploaded(selectedImages)}
          >
            Upload
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ImageUploader
