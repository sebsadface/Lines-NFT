// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@story-protocol/protocol-core/contracts/interfaces/registries/IIPAssetRegistry.sol";
import "@story-protocol/protocol-core/contracts/interfaces/registries/IModuleRegistry.sol";
import "@story-protocol/protocol-core/contracts/interfaces/modules/IRegistrationModule.sol";

contract MockIPAssetRegistry is IIPAssetRegistry {
    mapping(uint256 => address) public registeredIPs;
    mapping(address => mapping(address => bool))
        public
        override isApprovedForAll;

    // Mock implementations for missing methods
    address public override IP_ACCOUNT_IMPL;
    bytes32 public override IP_ACCOUNT_SALT;
    IModuleRegistry public override MODULE_REGISTRY;
    IRegistrationModule public override REGISTRATION_MODULE;

    constructor() {
        IP_ACCOUNT_IMPL = address(this); // Dummy address
        IP_ACCOUNT_SALT = keccak256("IP_ACCOUNT_SALT");
        MODULE_REGISTRY = IModuleRegistry(address(this)); // Dummy
        REGISTRATION_MODULE = IRegistrationModule(address(this)); // Dummy
    }

    function register(
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        address resolverAddr,
        bool createAccount,
        bytes calldata metadata_
    ) external override returns (address newIpId) {
        createAccount;
        newIpId = address(
            uint160(
                uint256(keccak256(abi.encodePacked(tokenId, block.timestamp)))
            )
        );
        registeredIPs[tokenId] = newIpId;
        emit IPRegistered(
            newIpId,
            chainId,
            tokenContract,
            tokenId,
            resolverAddr,
            address(this),
            metadata_
        );
        return newIpId;
    }

    // Implementation of the overloaded register function with licensing and royalty context
    function register(
        uint256[] calldata licenseIds,
        bytes calldata royaltyContext,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        address resolverAddr,
        bool createAccount,
        bytes calldata metadata_
    ) external override returns (address newIpId) {
        createAccount;
        newIpId = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            tokenId,
                            block.timestamp,
                            licenseIds,
                            royaltyContext
                        )
                    )
                )
            )
        );
        registeredIPs[tokenId] = newIpId;
        emit IPRegistered(
            newIpId,
            chainId,
            tokenContract,
            tokenId,
            resolverAddr,
            address(this),
            metadata_
        );
        return newIpId;
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) external override {
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function ipId(
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external view returns (address) {
        chainId;
        tokenContract;
        return registeredIPs[tokenId];
    }

    function isRegistered(
        address id,
        uint256 tokenId
    ) external view returns (bool) {
        return registeredIPs[tokenId] == id;
    }

    // Dummy implementations for other methods
    function isRegistered(address id) external pure returns (bool) {
        id;
        return false; // Dummy implementation
    }

    function resolver(address id) external pure returns (address) {
        id;
        return address(0); // Dummy implementation
    }

    function metadataProvider() external view override returns (address) {
        return address(this); // Dummy implementation
    }

    function totalSupply() external pure returns (uint256) {
        return 0; // Dummy implementation
    }

    function metadataProvider(address id) external view returns (address) {
        id;
        return address(this); // Dummy implementation
    }

    function metadata(address id) external pure returns (bytes memory) {
        id;
        return ""; // Dummy implementation
    }

    function setMetadata(
        address id,
        address prov,
        bytes calldata data
    ) external {
        // Intentionally empty for mock
    }

    function setResolver(address id, address resolverAddr) external {
        // Intentionally empty for mock
    }

    function ERC6551_PUBLIC_REGISTRY() external pure returns (address) {
        return address(0); // Dummy implementation
    }

    function registerIpAccount(
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external pure returns (address) {
        chainId;
        tokenContract;
        tokenId;
        return address(0); // Dummy implementation
    }

    function ipAccount(
        uint256 chainId,
        address tokenContract,
        uint256 tokenId
    ) external pure returns (address) {
        chainId;
        tokenContract;
        tokenId;
        return address(0); // Dummy implementation
    }

    function getIPAccountImpl() external view returns (address) {
        return IP_ACCOUNT_IMPL;
    }
}
