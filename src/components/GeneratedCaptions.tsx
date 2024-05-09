import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GeneratedCaptionsProps {
  captions: string[]
}

const GeneratedCaptions: React.FC<GeneratedCaptionsProps> = ({ captions }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Generated Captions</h3>
      <ul className="list-inside list-disc space-y-1">
        {captions.map((caption, index) => (
          <li key={index} className="text-sm">
            {caption}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GeneratedCaptions
