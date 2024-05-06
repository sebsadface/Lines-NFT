// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {Lines} from "../src/Lines.sol";
import {MockIPAssetRegistry} from "./mocks/MockIPAssetRegistry.sol";
import {MockVRFCoordinatorV2Plus} from "./mocks/MockVRFCoordinatorV2Plus.sol";

contract LineTest is Test {
    Lines line;
    MockVRFCoordinatorV2Plus vrfCoordinator;
    MockIPAssetRegistry ipAssetRegistry;
    address owner = address(1);

    function setUp() public {
        vrfCoordinator = new MockVRFCoordinatorV2Plus();
        ipAssetRegistry = new MockIPAssetRegistry();

        vm.startPrank(owner);

        line = new Lines(
            address(ipAssetRegistry),
            address(0), // Assuming the resolver is not used
            address(vrfCoordinator),
            1, // Dummy subscription ID
            keccak256("dummyKeyHash")
        );

        ipAssetRegistry.setApprovalForAll(address(line), true);
        vm.stopPrank();
    }

    function testInitialRandomnessRequest() public {
        vm.prank(owner);
        uint256 requestId = line.requestFirstRandomness();

        (address requester, , , ) = vrfCoordinator.getRequestDetails(requestId);
        assertEq(
            requester,
            address(line),
            "Request should come from Line contract"
        );
        console.log(
            "Initial randomness requested successfully with ID:",
            requestId
        );
    }

    function testrequestMint() public {
        vm.prank(owner);
        uint256 requestId = line.requestFirstRandomness();

        // Simulate randomness fulfillment
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = uint256(keccak256("randomness"));
        vrfCoordinator.fulfillRandomWords(requestId, randomWords);

        vm.prank(owner);
        (uint256 tokenId, address ipId) = line.requestMint();
        assertEq(tokenId, 0, "The first token should have ID 0");

        assertEq(
            line.ownerOf(tokenId),
            owner,
            "The owner of the minted token should be the owner address"
        );
        assertTrue(
            ipAssetRegistry.isRegistered(ipId, tokenId),
            "The token should be registered in IPAssetRegistry"
        );

        console.log("NFT minted and IP registered with token ID:", tokenId);
    }

    function testFailureOnMaxSupply() public {
        // Simulate reaching max supply
        for (uint256 i = 0; i < line.MAX_SUPPLY(); i++) {
            vm.prank(owner);
            line.requestFirstRandomness();
            uint256[] memory randomWords = new uint256[](1);
            randomWords[0] = uint256(keccak256(abi.encodePacked(i)));
            vrfCoordinator.fulfillRandomWords(i + 1, randomWords);

            vm.prank(owner);
            line.requestMint();
        }

        vm.expectRevert("Sale has already ended");
        vm.prank(owner);
        line.requestMint();
    }

    function testMintWithUnfulfilledRandomness() public {
        vm.prank(owner);
        line.requestFirstRandomness();

        vm.expectRevert("Previous randomness request not fulfilled");
        vm.prank(owner);
        line.requestMint();
    }

    function testDuplicateRandomnessRequest() public {
        vm.prank(owner);
        line.requestFirstRandomness();

        vm.expectRevert("Initialization Randomness already requested");
        vm.prank(owner);
        line.requestFirstRandomness();
    }
}
