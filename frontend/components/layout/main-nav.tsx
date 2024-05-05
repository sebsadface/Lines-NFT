"use client"

import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden bg-gradient-to-br from-black to-stone-500 bg-clip-text text-2xl font-bold text-transparent dark:from-stone-100 dark:to-blue-200 sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-base font-medium">
        <MainNavMenu />
      </nav>
    </div>
  )
}

function MainNavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList></NavigationMenuList>
    </NavigationMenu>
  )
}
