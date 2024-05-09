import React, { useState } from "react"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

interface ApiKeyModalProps {
  onSave: (key: string) => void
  onClose: () => void
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, onClose }) => {
  const [apiKey, setApiKey] = useState("")

  const handleSave = () => {
    onSave(apiKey)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>Enter Your OpenAI API Key</DialogTitle>
        <DialogDescription>
          Please enter your OpenAI API key. You can find your API keys in the{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            OpenAI Platform
          </a>
          . Do not share your API keys with others.
        </DialogDescription>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input"
          placeholder="API Key"
        />
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
          <DialogClose asChild>
            <button className="button">Cancel</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApiKeyModal
