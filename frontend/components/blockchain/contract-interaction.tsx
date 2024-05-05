import React, { useEffect, useState } from "react"
import {
  IPAssetRegistryABI,
  ipAssetRegistryAddress,
} from "@/contract-info/ipAssetRegistry_contract_info"
import { LinesABI, linesAddress } from "@/contract-info/line_contract_info"
import { ethers } from "ethers"

import { Button } from "../ui/button"

const ContractInteraction = ({ setStatus, setError }) => {
  const [signer, setSigner] = useState(null)
  const [isLoadingTx, setIsLoadingTx] = useState(false)
  const [isAwaitingSignature, setIsAwaitingSignature] = useState(false)

  useEffect(() => {
    if ((window as any).ethereum) {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      )
      setSigner((provider as any).getSigner())
    }
  }, [])

  const handleConfirmAndPay = async () => {
    setError("")
    setStatus({ text: "", links: [] })
    if (!signer) {
      setError("Please connect your wallet first.")
      return
    }

    try {
      setIsLoadingTx(true)
      setIsAwaitingSignature(true)

      const ipAssetRegistry = new ethers.Contract(
        ipAssetRegistryAddress,
        IPAssetRegistryABI,
        signer
      )
      const lines = new ethers.Contract(linesAddress, LinesABI, signer)

      const requestTxApprove = await ipAssetRegistry.setApprovalForAll(
        linesAddress,
        true
      )
      setIsAwaitingSignature(false)
      setStatus({
        text: "🫡 Delegating IP Registration...",
        links: [
          {
            url: `https://sepolia.etherscan.io/tx/${requestTxApprove.hash}`,
            label: "📜 View transaction on Etherscan",
          },
        ],
      })

      await requestTxApprove.wait()

      setIsAwaitingSignature(true)
      const requestTxMint = await lines.requestMint()
      setIsAwaitingSignature(false)
      setStatus({
        text: "🏃 Minting & Registering for new IP...",
        links: [
          {
            url: `https://sepolia.etherscan.io/tx/${requestTxMint.hash}`,
            label: "📜 View transaction on Etherscan",
          },
        ],
      })

      const receipt = await requestTxMint.wait()
      setIsLoadingTx(false)

      const mintedEvent = receipt.events?.find((e) => e.event === "Minted")
      if (mintedEvent) {
        const tokenId = mintedEvent.args.tokenId.toString()
        const ipId = mintedEvent.args.ipId
        setStatus({
          text: "🎉 NFT minted successfully!",
          links: [
            {
              url: `https://testnets.opensea.io/assets/sepolia/${linesAddress}/${tokenId}`,
              label: "🌊 View your NFT on Opensea",
            },
            {
              url: `https://explorer.storyprotocol.xyz/ipa/${ipId}`,
              label: "🧚 View your IP on Story Protocol",
            },
          ],
        })
      } else {
        setError("Minting transaction completed, but no mint event found.")
      }
    } catch (err) {
      console.error(err)
      setError(
        `Error: ${
          err.code === "ACTION_REJECTED"
            ? "Transaction rejected"
            : err.code === "UNPREDICTABLE_GAS_LIMIT"
            ? "Gas estimation failed - transaction may fail or may require manual gas limit."
            : err.message
        }`
      )
      setStatus({ text: "", links: [] })
      setIsLoadingTx(false)
      setIsAwaitingSignature(false)
    }
  }

  return (
    <div className="items-center">
      <Button
        onClick={handleConfirmAndPay}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        disabled={isLoadingTx}
      >
        {isLoadingTx && isAwaitingSignature ? (
          "👆 Confirm in wallet"
        ) : isLoadingTx ? (
          <div role="status">
            <svg
              aria-hidden="true"
              role="status"
              className="mr-3 inline size-4 animate-spin text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="white"
              />
            </svg>{" "}
            Processing...
          </div>
        ) : (
          "Confirm and Mint"
        )}
      </Button>
      <div className="flex h-full flex-col items-center justify-center "></div>
    </div>
  )
}

export default ContractInteraction
