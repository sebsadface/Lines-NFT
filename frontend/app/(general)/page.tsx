import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header"
import { siteConfig } from "@/config/site"
import MainPage from "@/app/main/page"
import React from "react"

export default function HomePage() {
  return (
    <div className="container relative mt-20">
      <PageHeader className="pb-2">
        <PageHeaderHeading>{siteConfig.name}</PageHeaderHeading>
        <PageHeaderDescription>{siteConfig.description}</PageHeaderDescription>
        <MainPage />
      </PageHeader>
    </div>
  )
}
