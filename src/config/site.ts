import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "LoRA Captioner",
  author: "markuryy",
  description: "Automated GPT-4 Vision API wrapper for image captioning.",
  keywords: ["lora", "gpt-4", "vision", "api"],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://markury.dev",
  },
  links: {
    github: "https://github.com/markuryy",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}
