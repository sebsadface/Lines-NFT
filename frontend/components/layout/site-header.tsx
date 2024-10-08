"use client"

import useScroll from "@/lib/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { WalletConnect } from "@/components/blockchain/wallet-connect"
import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ModeToggle } from "@/components/shared/mode-toggle"

export function SiteHeader() {
  const scrolled = useScroll(0)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur transition-all",
        scrolled && "bg-background/50 "
      )}
    >
      <div className="container flex h-20 items-center">
        <MainNav />
        <MobileNav />
        <div className="hidden flex-1 items-center justify-between space-x-2 md:flex md:justify-end">
          <WalletConnect />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
