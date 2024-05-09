"use client"

import React, { useEffect, useState } from "react"
import JSZip from "jszip"
import { OpenAI } from "openai"

import { Button } from "@/components/ui/button"
import ApiKeyModal from "@/components/ApiKeyModal"
import GeneratedCaptions from "@/components/GeneratedCaptions"
import ImageCaption from "@/components/ImageCaption"
import ImageUploader from "@/components/ImageUploader"
import SystemPrompt from "@/components/SystemPrompt"

const Home: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [customToken, setCustomToken] = useState("")
  const [imageCaptions, setImageCaptions] = useState<
    { imageSrc: string; caption: string }[]
  >([])
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([])
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [customInstruction, setCustomInstruction] = useState("")
  const [inherentAttributes, setInherentAttributes] = useState("")

  useEffect(() => {
    const storedApiKey = localStorage.getItem("openaiApiKey")
    if (!storedApiKey) {
      setShowApiKeyModal(true)
    } else {
      setApiKey(storedApiKey)
    }
  }, [])

  const saveApiKey = (apiKey: string) => {
    setApiKey(apiKey)
    localStorage.setItem("openaiApiKey", apiKey)
    setShowApiKeyModal(false)
  }

  const handleCloseModal = () => {
    setShowApiKeyModal(false)
  }

  const handleOpenModal = () => {
    setShowApiKeyModal(true)
  }

  const handleCustomTokenChange = (token: string) => {
    setCustomToken(token)
  }

  const handleApiKeyChange = (apiKey: string) => {
    setApiKey(apiKey)
    localStorage.setItem("openaiApiKey", apiKey)
  }

  const handleCaptionChange = (index: number, caption: string) => {
    setImageCaptions((prevCaptions) => {
      const updatedCaptions = [...prevCaptions]
      updatedCaptions[index] = { ...updatedCaptions[index], caption }
      return updatedCaptions
    })
  }

  const handleCustomInstructionChange = (instruction: string) => {
    setCustomInstruction(instruction)
  }

  const handleInherentAttributesChange = (attributes: string) => {
    setInherentAttributes(attributes)
  }

  const handleImagesUploaded = async (images: File[]) => {
    setUploadedImages(images)

    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

    const imageCaptionPromises = images.map(async (image) => {
      const base64Image = await convertToBase64(image)
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `
**System Prompt for LoRA Captioning Guide GPT**

You are an AI assistant that captions images for training purposes. Your task is to create clear, detailed captions that incorporate the custom token \`${customToken}\`. The following guide outlines the captioning approach:

### Captioning Principles:
1. **Avoid Making Main Concepts Variable**: Exclude specific traits of the main teaching point to ensure it remains consistent across the dataset.
2. **Include Detailed Descriptions**: Describe everything except the primary concept being taught.
3. **Use Generic Classes as Tags**:
   - Broad tags (e.g., "man") can bias the entire class toward the training data.
   - Specific tags (e.g., "ohwxman") can reduce impact on the general class while creating strong associations.

### Caption Structure:
1. **Globals**: Rare tokens or uniform tags (e.g., \`${customToken}\`).
1.5. **Natural Language Description**: A concise description shorter than a sentence but longer than a tag describing the entire scene.
2. **Type/Perspective**:
   - Broad description of the image type and perspective (e.g., "photograph," "full body," "from side").
3. **Action Words**:
   - Verbs describing actions or states (e.g., "sitting," "looking at viewer," "smiling").
4. **Subject Descriptions**:
   - Detailed descriptions excluding the main teaching concept (e.g., "short brown hair," "pale pink dress").
5. **Notable Details**:
   - Unique or emphasized elements not classified as background (e.g., "sunlight through windows").
6. **Background/Location**:
   - Layered background context (e.g., "brown couch," "wooden floor," "refrigerator in background").
7. **Loose Associations**:
   - Relevant associations or emotions (e.g., "dreary environment").

### Example Captions:
1. **Training Style:**
   \`\`\` 
   ${customToken}, a woman with teddy bear in a dreary room, anime, drawing, young woman, full body, side view, sitting, looking at viewer, smiling, head tilt, holding a phone, eyes closed, short brown hair, pale pink dress, dark edges, stuffed animal in lap, brown slippers, sunlight through windows, brown couch, red patterned fabric, wooden floor, white water-stained walls, refrigerator, coffee machine, bananas, clock, stuffed chicken on floor, dreary environment
   \`\`\`
2. **Character-Specific Training:**
   \`\`\` 
   ${customToken}, man who is focused in a candid shot at work, portrait, photograph, man, upper body, front view, standing, arms crossed, serious expression, black suit, red tie, brown hair, blue eyes, office background, computer, papers, motivational posters, professional environment
   \`\`\`
   
### Additional Notes:
- **Consistency and Repetition**: Maintain consistent captions to aid model learning and avoid repetition.
- **Ordering and Familiarity**: Tag ordering affects relative weighting. Use familiar terms to leverage model knowledge.

### Inherent Attributes to Avoid:
${inherentAttributes}

${customInstruction}
`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Here is an image for you to describe. Please describe the image in detail and ensure it adheres to the guidelines set out in the System Prompt. Do not include any uncertainty (i.e. I dont know, appears, seems) or any other text. Focus exclusively on visible elements and not concenptual ones. Thank you very much for your help!",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 100,
      })

      const caption = response.choices[0]?.message?.content || ""
      return { imageSrc: URL.createObjectURL(image), caption }
    })

    const captions = await Promise.all(imageCaptionPromises)
    setImageCaptions(captions)

    const generatedCaptionsResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that generates unique captions based on the provided captions.",
        },
        {
          role: "user",
          content: `Generate 5 unique captions based on the following captions:\n\n${captions
            .map((caption) => caption.caption)
            .join("\n")}`,
        },
      ],
      max_tokens: 300,
    })

    const generatedCaptions =
      generatedCaptionsResponse.choices[0]?.message?.content
        ?.split("\n")
        .filter(Boolean) || []
    setGeneratedCaptions(generatedCaptions)
  }

  const handleSave = async () => {
    const zip = new JSZip()
    imageCaptions.forEach(({ imageSrc, caption }, index) => {
      const imageFileName = `image${index.toString().padStart(3, "0")}.png`
      const captionFileName = `image${index.toString().padStart(3, "0")}.txt`
      zip.file(imageFileName, urlToBlob(imageSrc))
      zip.file(captionFileName, caption)
    })
    const zipBlob = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "image_captions.zip"
    link.click()
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result as string
        const base64Data = base64String.split(",")[1]
        resolve(base64Data)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const urlToBlob = (url: string): Promise<Blob> => {
    return fetch(url).then((response) => response.blob())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">GPT4 Vision LoRA Captioner</h1>
      <div className="mb-8">
        <ImageUploader
          onImagesUploaded={handleImagesUploaded}
          onCustomTokenChange={handleCustomTokenChange}
          onCustomInstructionChange={handleCustomInstructionChange}
          onInherentAttributesChange={handleInherentAttributesChange}
          apiKey={apiKey}
          onApiKeyChange={handleApiKeyChange}
        />
      </div>
      <div className="mb-8">
        <SystemPrompt
          customToken={customToken}
          customInstruction={customInstruction}
          inherentAttributes={inherentAttributes}
        />
      </div>
      <div className="mt-8 space-y-4">
        {imageCaptions.map(({ imageSrc, caption }, index) => (
          <ImageCaption
            key={index}
            imageSrc={imageSrc}
            caption={caption}
            onCaptionChange={(caption) => handleCaptionChange(index, caption)}
          />
        ))}
      </div>
      {generatedCaptions.length > 0 && (
        <div className="mt-8">
          <GeneratedCaptions captions={generatedCaptions} />
        </div>
      )}
      <div className="mt-8">
        <Button type="button" onClick={handleSave}>
          Save
        </Button>
      </div>
      <Button onClick={handleOpenModal} className="button mt-4">
        Edit API Key
      </Button>
      {showApiKeyModal && (
        <ApiKeyModal onSave={saveApiKey} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default Home
