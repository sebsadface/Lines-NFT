interface SiteConfig {
  name: string
  title: string
  emoji: string
  description: string
  localeDefault: string
  links: {
    discord: string
    twitter: string
    github: string
  }
}

export const SITE_CANONICAL = "https://www.sebliu.xyz"

export const siteConfig: SiteConfig = {
  name: "Lines",
  title: "Lines",
  emoji: "⎹",
  description:
    "Explore 10,000 unique, on-chain SVGs, each provably random and meticulously crafted.",
  localeDefault: "en",
  links: {
    discord: "https://discord.gg/sebliu",
    twitter: "https://twitter.com/sebsadface",
    github: "https://github.com/sebsadface",
  },
}

export const DEPLOY_URL =
  "https://vercel.com/"
