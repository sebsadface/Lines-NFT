# ✨ Lines NFT Collection ✨

The Lines NFT Collection is a Solidity project on the Ethereum blockchain that involves the creation and distribution of a series of unique, randomly generated SVG-based NFTs. Each NFT is registered as intellectual property (IP) using the Story Protocol's IPAssetRegistry. This project leverages the security of Chainlink VRF (Verifiable Random Function) to ensure that the randomness used to generate the NFTs is provably fair.

## Table of Contents 📚
- [**Features**](#features-🌟)
- [**Live Demo**](#live-demo-🚀)
- [**Known Issues**](#known-issues-🐞)
- [**Technical Details**](#technical-details-🕹️)
    - [**Smart Contract Description**](#smart-contract-description-📜)
    - [**Frontend Web App Description**](#frontend-web-app-description-🖥)
- [**Setup**](#setup-🛠)


## Features 🌟

- **ERC721 Compliant**: The NFTs follow the ERC721 standard, making them compatible with a wide range of Ethereum-based NFT marketplaces and wallets.
- **Chainlink VRF**: Utilizes Chainlink's VRF to generate randomness, ensuring that each NFT is unique and fairly distributed without any predictable patterns.
- **IP Registration**: Each minted NFT is registered as intellectual property through the Story Protocol's IPAssetRegistry, associating unique metadata and ownership details securely on-chain.
- **Non-Reentrant Minting**: Ensures that the minting function cannot be called recursively, thus protecting against potential reentrancy attacks which could lead to unexpected behavior or exploits.

## Live Demo 🚀
- **Website**: [https://line-nft-collection.vercel.app/](https://line-nft-collection.vercel.app/)
- **Deployed Smart Contract**: [0x08aA68DD6B50C6f1565A60aD85bFC50f9aD3308b](https://sepolia.etherscan.io/address/0x08aA68DD6B50C6f1565A60aD85bFC50f9aD3308b)

## Known Issues 🐞

## Technical Details 🕹️

### 📜 Smart Contract Description

#### Contracts

- `Line`: The main NFT contract that extends `ERC721URIStorage` for token URI management and `VRFConsumerBaseV2Plus` for handling randomness.

#### Key Functions

- **requestFirstRandomness()**: Initiates the first request for randomness from Chainlink VRF. This function can only be called once to start the minting process.
- **requestMint()**: Mints a new NFT using the latest available randomness. It also triggers a request for new randomness for the next minting, ensuring that minting operations are sequentially dependent on the arrival of fresh randomness.
- **totalSupply()**: Returns the total number of NFTs minted so far.

#### Events

- `IPRegistered`: Emitted when an NFT is registered as IP.
- `RequestSent`: Indicates that a randomness request has been sent to Chainlink VRF.
- `RequestFulfilled`: Indicates that a randomness request has been fulfilled by Chainlink VRF.
- `Minted`: Emitted when a new NFT is minted and its corresponding IP is registered.

### 🖥 Frontend Web App Description

## Setup 🛠

### Prerequisites

- Node.js and npm
- Truffle Suite or Hardhat for smart contract deployment and testing
- An Ethereum wallet like Metamask
- Access to Ethereum testnet (Rinkeby, Ropsten, etc.) and testnet ETH

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repository/line-nft-collection.git
   cd line-nft-collection
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Rename `.env.example` to `.env`.
   - Add your wallet private key and Infura/Alchemy project ID.

4. **Compile the smart contracts:**
   ```sh
   truffle compile
   ```

### Testing

- Run tests using Truffle or Hardhat:
  ```sh
  truffle test
  ```

### Deployment

- Deploy to a testnet using Truffle:
  ```sh
  truffle migrate --network rinkeby
  ```


### Web3 Core

- [WAGMI CLI](https://wagmi.sh/cli/getting-started) - Automatic React Hook Generation
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection manager

### Web2 Frameworks

- [Vercel](https://vercel.com/) - App Infrastructure

### Developer Experience

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### User Interface

- [TailwindCSS](https://tailwindcss.com) – Utility-first CSS framework for rapid UI development
- [Radix](https://www.radix-ui.com/) – Primitives like modal, popover, etc. to build a stellar user experience
- [Framer Motion](https://www.framer.com/motion/) – Motion library for React to animate components with ease
- [React Icons](https://react-icons.github.io/react-icons) – Beautifully simple, pixel-perfect icons

The [ui.shadcn.com](https://ui.shadcn.com) components are included in the `/components/shared/ui` folder.
