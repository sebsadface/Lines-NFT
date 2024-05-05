import React, { useState } from "react"

import ContractInteraction from "@/components/blockchain/contract-interaction"
import { WalletConnect } from "@/components/blockchain/wallet-connect"
import { IsWalletConnected } from "@/components/shared/is-wallet-connected"
import { IsWalletDisconnected } from "@/components/shared/is-wallet-disconnected"

export interface ModalProps {
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 md:inset-0">
      <div
        className="relative w-full max-w-2xl rounded-lg bg-white p-8 dark:bg-zinc-900"
        style={{ width: "650px", height: "450px" }}
      >
        <button
          className="absolute right-4 top-4 text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={onClose}
        >
          😵
        </button>
        <div className="flex h-full flex-col items-center justify-center gap-y-8">
          <IsWalletConnected>
            <h1 className="text-left text-lg font-bold text-gray-900 dark:text-gray-200 ">
              ✨ When you click "Confirm and Mint", two txs need to be signed:
            </h1>
            <p className=" text-left text-gray-700 dark:text-gray-300">
              &nbsp;&nbsp;1. Delegating the NFT contract to register your NFT's
              IP on our behalf. <br />
              <br />
              &nbsp;&nbsp;2. Minting your NFT and register its IP on Story
              Protocol.
            </p>
            <h1 className="text-center font-bold text-gray-900 dark:text-gray-200">
              👇
            </h1>
            <ContractInteraction setStatus={setStatus} setError={setError} />
            {status.text && (
              <div>
                <p>{status.text}</p>
                {status.links.map((link) => (
                  <p key={link.url} className=" underline hover:to-blue-500">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </p>
                ))}
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </IsWalletConnected>
          <IsWalletDisconnected>
            <h1 className="text-center font-bold text-gray-900 dark:text-gray-200">
              Please connect your wallet to continue <br /> <br /> 👇
            </h1>
            <WalletConnect />
          </IsWalletDisconnected>
        </div>
      </div>
    </div>
  )
}

export { Modal }
