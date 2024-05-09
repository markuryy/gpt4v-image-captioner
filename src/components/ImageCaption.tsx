import React from "react"
import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface ImageCaptionProps {
  imageSrc: string
  caption: string
  onCaptionChange: (caption: string) => void
}

const ImageCaption: React.FC<ImageCaptionProps> = ({
  imageSrc,
  caption,
  onCaptionChange,
}) => {
  return (
    <div className="flex items-start space-x-4">
      <Image
        src={imageSrc}
        alt="Uploaded Image"
        width={200}
        height={200}
        className="rounded-md"
      />
      <Textarea
        value={caption}
        onChange={(e) => onCaptionChange(e.target.value)}
        className="flex-1"
        rows={3}
      />
    </div>
  )
}

export default ImageCaption
