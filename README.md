# ✨ Lines NFT Collection ✨
 Lines is a NFT collection that consists of 10,000 unique, randomly generated SVG-based NFTs. Each NFT is registered as an IP on Story Protocol during the minting process.

 This project consists of two main components: a [Solidity smart contract](#smart-contract-description-) and a [simple nextjs web app](https://github.com/sebsadface/24-swe-intern-exercise-seb/tree/main?tab=readme-ov-file#frontend-web-app-description-%EF%B8%8F)


## Table of Contents 📚

- [Table of Contents 📚](#table-of-contents-)
- [Live Demo 🚀](#live-demo-)
- [Smart Contract Description 📜](#smart-contract-description-)
- [Frontend Web App Description 🖥️](https://github.com/sebsadface/24-swe-intern-exercise-seb/tree/main?tab=readme-ov-file#frontend-web-app-description-%EF%B8%8F)
- [Known Issues 🐞](#known-issues-)
- [Setup \& Usage 🛠](#setup--usage-)
- [Acknowledgements 🙏](#acknowledgements-)


## Live Demo 🚀

- **Website**: [https://lines-nft-collection.vercel.app/](https://lines-nft-collection.vercel.app/)
- **Deployed Smart Contract**: [0x08aA68DD6B50C6f1565A60aD85bFC50f9aD3308b](https://sepolia.etherscan.io/address/0x08aA68DD6B50C6f1565A60aD85bFC50f9aD3308b)
- **OpenSea**: [https://testnets.opensea.io/collection/lines-14](https://testnets.opensea.io/assets/sepolia/0x08aA68DD6B50C6f1565A60aD85bFC50f9aD3308b)
- **Story Protocol**: [https://explorer.storyprotocol.xyz/collections/0x08aA68DD6B50C6f1565A60aD85bFC50f9aD3308b](https://explorer.storyprotocol.xyz/collections/0x08aA68DD6B50C6f1565A60aD85bFC50f9aD3308b)


## Smart Contract Description 📜

### Overview

This contract extends `ERC721URIStorage` for token URI storage, utilizes Chainlink VRF V2.5 for provable randomness, and registers minted tokens as IPs using Story Protocol's IPAssetRegistry. This contract supports non-reentrant minting operations and ensures IP registration is handled seamlessly on mint.

**For more details, please refer to the [source code](https://github.com/sebsadface/24-swe-intern-exercise-seb/blob/main/contracts/src/Lines.sol).**

### State Variables ([**source**](https://github.com/sebsadface/24-swe-intern-exercise-seb/blob/main/contracts/src/Lines.sol))

- **`IP_RESOLVER`**: An immutable public variable of type `IPResolver`. This contract is used for IP registration-related functionalities.

- **`IP_ASSET_REGISTRY`**: An immutable public variable of type `IPAssetRegistry`. This contract handles the registration of minted tokens as intellectual properties.

- **`VRF_COORDINATOR`**: An immutable public variable of type `IVRFCoordinatorV2Plus`. It interfaces with the Chainlink VRF Coordinator contract for provable randomness necessary for NFT minting.

- **`MAX_SUPPLY`**: A public constant that defines the maximum supply of Lines NFTs, set to 10,000.

- **`requestIdToVRFRequest`**: A private mapping that tracks each Chainlink VRF request ID to its corresponding `VRFRequest` struct, which includes whether a request has been fulfilled, if it exists, and the randomness generated.

- **`numWords`**: A private constant that specifies the number of random words requested from Chainlink VRF, set to 1.

- **`requestConfirmations`**: A private constant specifying the number of confirmations required for a Chainlink VRF request, set to 3.

- **`callbackGasLimit`**: A private constant that defines the gas limit for the VRF callback function, set to 2,500,000 gas.

- **`lastRequestId`**: A private variable that stores the ID of the last Chainlink VRF request, used to track and manage randomness retrieval for minting.

- **`nextTokenId`**: A private variable that stores the ID of the next token to be minted, starting from 0 and incrementing with each mint up to `MAX_SUPPLY`.

- **`chainlinkSubscriptionId`**: A private variable that holds the Chainlink VRF subscription ID necessary for making randomness requests.

- **`keyHash`**: A private variable that stores the Chainlink VRF 30 gwei Key Hash, used in randomness requests.

- **`firstRandomnessRequested`**: A public boolean flag to ensure that the initial randomness request to start the minting process is made only once.

- **`VRFRequest`**: A struct used to store details for each VRF request, including:
  - **`fulfilled`**: A boolean indicating whether the minting request associated with the VRF request has been fulfilled.
  - **`exists`**: A boolean to check if the VRF request was made.
  - **`randomness`**: A uint256 to store the randomness provided by Chainlink VRF, initially set to 0 until fulfilled.




### Functions ([**source**](https://github.com/sebsadface/24-swe-intern-exercise-seb/blob/main/contracts/src/Lines.sol))

#### Public and External Functions

- **`requestFirstRandomness`**: Requests initial randomness from Chainlink VRF to prepare for the first minting process. The call to this function will revert if this function has already been called once, or if the caller is not the contract owner.

- **`requestMint`**: Generates and mints a new token, registers it as an IP, and requests randomness for the next minting operation. This function only supports minting one token at a time, the following minting operation will need to wait for Chainlink VRF call back to complete. Since the NFT is completely stored on-chain, the SVG generation and IP registration process made minting operations fairly expensive and exceeded Chainlink VRF's call back gas limit. To mitigate this, I split the randomness generation into two parts. The first request (`requestFirstRandomness`) initializes the randomness for the next mint operation, and the second request is made after the mint operation to ensure the randomness is available for the next mint.

- **`totalSupply`**: Returns the total supply of the collection, which is capped at 10,000.

#### Internal Functions

- **`fulfillRandomWords`**: Callback function called by Chainlink VRF Coordinator when randomness is generated. This function updates the `VRFRequest` struct in the `requestIdToVRFRequest` mapping with the randomness generated by Chainlink VRF.

- **`_registerIp`**: Registers a new IP at the `IPAssetRegistry` contract, and emits an `IPRegistered` event. It is only called internally during the minting process assumes the caller has already approved the Lines contract to register IP on their behalf.

- **`_requestRandomness`**: Requests randomness from Chainlink VRF and stores the request details in the `requestIdToVRFRequest` mapping. This function updates the `lastRequestId` with the identifier of the Chainlink VRF request. This function is called by `requestFirstRandomness` and `requestMint`.

- **`_baseURI`**: Returns the base URI used for the tokenURI of each token. Specifically set for base64 encoded JSON data.

- **`_generateSVG`**: Generates a random SVG image based on the randomness provided by Chainlink VRF. Used internally during the minting process to create unique visual designs for each NFT.

- **`_formatTokenURI`**: Encodes the SVG image and metadata as a base64 string and constructs the complete token URI.

- **`_bytesToHexString`**: Converts a bytes32 buffer into a hexadecimal string. Used internally to format hashes.


### Events ([**source**](https://github.com/sebsadface/24-swe-intern-exercise-seb/blob/main/contracts/src/Lines.sol))

- **`IPRegistered(address ipId)`**: Emitted after successfully registering an IP in the IP Asset Registry, providing the identifier for the registered IP.

- **`RequestSent(uint256 requestId)`**: Emitted when a randomness request is sent to the Chainlink VRF.

- **`RequestFulfilled(uint256 requestId)`**: Emitted when a randomness request is fulfilled by Chainlink VRF.

- **`Minted(uint256 tokenId, address ipId)`**: Emitted when a new token is minted and the associated IP is registered, providing the token ID and the registered IP ID.


### Tests ([**source**](https://github.com/sebsadface/24-swe-intern-exercise-seb/tree/main/contracts/test))

#### Mocks

- **`MockIPAssetRegistry`**: A mock of the IPAssetRegistry used for testing IP registration without interacting with the live blockchain.

- **`MockVRFCoordinatorV2Plus`**: A mock of the Chainlink VRF Coordinator to test randomness request and fulfillment in a controlled environment.


#### Test Cases

- **`testInitialRandomnessRequest`**: Tests the initial randomness request functionality to ensure it can only be called once and only by the contract owner.

- **`testRequestMint`**: Tests the NFT minting process, ensuring it correctly uses Chainlink VRF randomness, registers the IP, and emits the appropriate events.

- **`testFailureOnMaxSupply`**: Ensures the contract correctly handles attempts to mint beyond the maximum supply.

- **`testMintWithUnfulfilledRandomness`**: Tests that the mint function reverts if randomness is not yet available or if the previous randomness has not been fulfilled.

- **`testDuplicateRandomnessRequest`**: Ensures that the contract properly handles attempts to make a duplicate randomness request.


## Frontend Web App Description 🖥️

This web app is a simple Next.js application that allows users to seamlessly interact with the Lines NFT collection smart contract and delegate IP registration to Lines smart contract.

The app uses WAGMI CLI to generate React hooks, RainbowKit for wallet connection management, ethers.js for blockchain interaction, tailwindcss for styling, Radix, React Icons, and Framer Motion for UI components.

Main components include 1. Minting modal: dynamically reacting to wallet connection status and minting status, includes descriptions to guide users through the minting process. 2. Minting button: dynamically changing the button text and color based on minting status, includes a loading spinner.

- [**Source**](https://github.com/sebsadface/24-swe-intern-exercise-seb/tree/main/frontend)

- [**Deployed App**](https://lines-nft-collection.vercel.app/)

## Known Issues 🐞

- **Chainlink VRF Dependency**: The minting process is heavily dependent on Chainlink VRF to function timely and correctly. If the VRF requests are not fulfilled, the minting process will be halted. Normally, a request will take around 1 minue to be fulfilled, which means two consecutive mints have to be at least 1 minute apart.

- **Unconditional SetApprovalForAll**: The frontend will call `setApprovalForAll` on the contract address unconditionally, even if the user has already approved the contract. This will result in unnecessary gas costs.

- **More tests**: The smart contract tests are not comprehensive enough due to time constraints. More tests should be written to cover edge cases and ensure the contract's robustness.

## Setup & Usage 🛠

### Smart Contract

#### Documentation

<https://book.getfoundry.sh/>


#### Build

```shell
forge build
```

#### Test

```shell
forge test
```

#### Format

```shell
forge fmt
```

#### Gas Snapshots

```shell
forge snapshot
```

#### Anvil

```shell
anvil
```

#### Cast

```shell
cast <subcommand>
```

#### Help

```shell
forge --help
anvil --help
cast --help
```

### Frontend
The `pnpm` CLI is the recommended package manager but `npm` and `yarn` should work too.

```bash
pnpm install
```

#### Development

```bash
pnpm dev
```

#### Build

```bash
pnpm build
```

## Acknowledgements 🙏
Orginal templates for smart contract: [story-protocol-boilerplate](https://github.com/storyprotocol/story-protocol-boilerplate)

Orginal templates for frontend: [TurboETH](https://github.com/turbo-eth/template-web3-app?tab=readme-ov-file)
