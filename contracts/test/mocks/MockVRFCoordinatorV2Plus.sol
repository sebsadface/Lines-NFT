// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract MockVRFCoordinatorV2Plus is IVRFCoordinatorV2Plus, ConfirmedOwner {
    struct Request {
        uint256 id;
        address requester;
        uint32 callbackGasLimit;
        uint32 numWords;
        uint256[] randomWords;
    }

    struct Subscription {
        uint96 balance;
        uint96 nativeBalance;
        uint64 reqCount;
        address owner;
        address[] consumers;
    }

    mapping(uint256 => Request) public requests;
    mapping(uint256 => Subscription) public subscriptions;
    uint256 private requestIdCounter = 1;

    constructor() ConfirmedOwner(msg.sender) {}

    // Mock function for creating a subscription
    function createSubscription() external override returns (uint256) {
        uint256 subId = requestIdCounter++;
        address[] memory emptyArray;
        subscriptions[subId] = Subscription({
            owner: msg.sender,
            balance: 0,
            nativeBalance: 0,
            reqCount: 0,
            consumers: emptyArray
        });
        return subId;
    }

    function getSubscription(
        uint256 subId
    )
        external
        view
        override
        returns (uint96, uint96, uint64, address, address[] memory)
    {
        Subscription memory sub = subscriptions[subId];
        return (
            sub.balance,
            sub.nativeBalance,
            sub.reqCount,
            sub.owner,
            sub.consumers
        );
    }

    function requestRandomWords(
        VRFV2PlusClient.RandomWordsRequest calldata req
    ) external override returns (uint256 requestId) {
        requestId = requestIdCounter++;
        requests[requestId] = Request({
            id: requestId,
            requester: msg.sender,
            callbackGasLimit: req.callbackGasLimit,
            numWords: req.numWords,
            randomWords: new uint256[](req.numWords)
        });
        return requestId;
    }

    function getRequestDetails(
        uint256 requestId
    )
        public
        view
        returns (
            address requester,
            uint32 callbackGasLimit,
            uint32 numWords,
            uint256[] memory randomWords
        )
    {
        Request storage request = requests[requestId];
        return (
            request.requester,
            request.callbackGasLimit,
            request.numWords,
            request.randomWords
        );
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) public {
        Request storage request = requests[requestId];
        require(request.requester != address(0), "Invalid request ID");
        require(
            randomWords.length == request.numWords,
            "Random words count mismatch"
        );

        for (uint i = 0; i < randomWords.length; i++) {
            request.randomWords[i] = randomWords[i];
        }

        VRFConsumerBaseV2Plus consumer = VRFConsumerBaseV2Plus(
            request.requester
        );
        consumer.rawFulfillRandomWords(requestId, request.randomWords);
    }

    // Dummy implementations of other required methods
    function addConsumer(uint256, address) external override {}

    function removeConsumer(uint256, address) external override {}

    function requestSubscriptionOwnerTransfer(
        uint256,
        address
    ) external override {}

    function cancelSubscription(uint256, address) external override {}

    function pendingRequestExists(
        uint256
    ) external pure override returns (bool) {
        return false;
    }

    function acceptSubscriptionOwnerTransfer(uint256) external override {}

    function fundSubscriptionWithNative(uint256) external payable override {}

    function getActiveSubscriptionIds(
        uint256 startIndex,
        uint256 maxCount
    ) external pure returns (uint256[] memory) {
        startIndex;
        maxCount;
        return new uint256[](0);
    }
}
