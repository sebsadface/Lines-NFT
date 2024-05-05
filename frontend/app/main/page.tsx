"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import { fadeDownVariant } from "@/lib/utils/motion"
import { buttonVariants } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { linesAddress } from "@/contract-info/line_contract_info"

export default function MainPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const onclose = () => {
    setModalOpen(false)
  }

  return (
    <>
      <div className="mt-20 content-center">
        <motion.button
          variants={fadeDownVariant()}
          className={buttonVariants({ variant: "default", size: "lg" })}
          onClick={() => setModalOpen(true)}
        >
          ✻ Mint Now ✻
        </motion.button>
      </div>

      <div className="mt-20 content-center">
        <Link
          href={"https://testnets.opensea.io/collection/" + linesAddress}
          target="_blank"
          rel="noreferrer noopenner"
          className={buttonVariants({ variant: "default" }) + " mx-2 my-2"}
        >
          🌊 View Collection on Opensea
        </Link>

        <Link
          href={"https://sepolia.etherscan.io/token/" + linesAddress}
          target="_blank"
          rel="noreferrer noopenner"
          className={buttonVariants({ variant: "default" }) + " mx-2 my-2"}
        >
          📜 View on Etherscan
        </Link>

        <Link
          href={
            "https://explorer.storyprotocol.xyz/collections/" + linesAddress
          }
          target="_blank"
          rel="noreferrer noopenner"
          className={buttonVariants({ variant: "default" }) + " mx-2 my-2"}
        >
          🧚 View IPs on Story Protocol
        </Link>
      </div>

      {modalOpen && <Modal onClose={() => onclose()}>Hidden</Modal>}
    </>
  )
}
