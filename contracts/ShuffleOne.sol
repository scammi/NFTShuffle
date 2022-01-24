// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //OZ: ERC721
import "@openzeppelin/contracts/utils/Counters.sol"; //OZ: Counter

/// @title ShuffleOne
/// @notice ERC721 randmoized distribution
contract ShuffleOne is ERC721{
    using Counters for Counters.Counter;

    /// ============ Structs ============

    struct Participant {
        uint256 tokenId;
        uint256 randomIdex;
        uint256 minted;
        uint256 ownedTickets; 
    }

    /// ============ Immutable storage ============

    /// @notice Avalible NFTs to be minted
    uint256 public immutable AVAILABLE_SUPPLY;
    /// @notice minimum cost for ticket
    uint256 public immutable MINT_COST;
    /// @notice Maximum tickets per address
    uint256 public immutable MAX_PER_ADDRESS = 1;

    /// ============ Mutable storage ============

    /// @notice Array of NFTs ID to be minted 
    uint256[] public NFTsId;
    /// @notice Source of entropy
    uint256 public entropy = block.timestamp;
    /// @notice Keep track of participants 
    mapping (address => Participant) public participants;
    /// @notice Keeps track of sold tickets 
    Counters.Counter internal _soldTicketsCounter;

    /// ============ Constructor ============

    constructor(
        uint256 _AVAILABLE_SUPPLY,
        uint256 _MINT_COST
    ) 
    ERC721("Random NFT", "rNFT") {
        AVAILABLE_SUPPLY = _AVAILABLE_SUPPLY;
        MINT_COST = _MINT_COST;
    }

    /// ============ Functions ============

    /// @notice Enters raffle 
    function buyTicket() external payable returns (bool){
        require(_soldTicketsCounter.current() < AVAILABLE_SUPPLY, "All tickets sold");
        require(participants[msg.sender].ownedTickets < MAX_PER_ADDRESS, "Address owns ticket");
        require(msg.value >= MINT_COST, "Insufficient payment");

        participants[msg.sender].ownedTickets++;
        _soldTicketsCounter.increment();

        NFTsId.push(_soldTicketsCounter.current()); 

        return true;
    }

    /// @notice Generate rand index for the NFTid, mint NFT and remove it from array 
    function mint() public {
        require(participants[msg.sender].ownedTickets > 0, "Address does not own a ticket");
        require(participants[msg.sender].minted < MAX_PER_ADDRESS, "Max allow per address minted");
        require(_soldTicketsCounter.current() == AVAILABLE_SUPPLY, "Raffle still open");

        uint256 randomIndex = getRandmonIndex();
        uint256 randomNFTsId = NFTsId[randomIndex];

        _mint(msg.sender, randomNFTsId);
        removeIndexFromArray(randomIndex);

        participants[msg.sender].randomIdex = randomIndex;
        participants[msg.sender].tokenId = randomNFTsId;
        participants[msg.sender].minted++;
    }

    /// @notice Get a random index from the NFTsId array 
    function getRandmonIndex() internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(entropy))) % NFTsId.length;
    }

    /// @notice Delete minted id from array 
    /// @param index element to be deleted from NFTsId after bein minted
    function removeIndexFromArray(uint index) internal {
        require(index < NFTsId.length);

        NFTsId[index] = NFTsId[NFTsId.length-1];
        NFTsId.pop();
    }

    function getNFTsIdLength() public view returns (uint256) {
        return NFTsId.length;
    }

    function geSoldTickets() public view returns (uint256) {
        return _soldTicketsCounter.current();
    }

    function _baseURI() internal view override virtual returns (string memory) {
        return "https://ipfs.io/ipfs/QmQxDjEhnYP6QAtLRyLV9N7dn1kDigz7iWnx5psmyXqy35/";
    }
}
