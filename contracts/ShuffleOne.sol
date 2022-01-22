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
        uint256 id;
        bool minted;
        uint256 ownTickets; 
    }

    /// ============ Immutable storage ============

    /// @notice Avalible NFTs to be minted
    uint256 public immutable AVAILABLE_SUPPLY = 5;
    /// @notice Maximum tickets per address
    uint256 public immutable MAX_PER_ADDRESS = 1;

    /// ============ Mutable storage ============

    /// @notice Array of NFTs ID to be minted 
    uint256[] NFTsID;
    /// @notice Source of entropy
    uint256 public entropy = block.timestamp;
    /// @notice Keep track of participants 
    mapping (address => Participant) public participants;
    /// @notice Keeps track of sold tickets 
    Counters.Counter private _ticketsCounter;

    /// ============ Constructor ============

    constructor() ERC721("Random NFT", "rNFT"){}

    /// ============ Functions ============

    /// @notice Enters raffle 
    function buyTicket() public returns (bool){
        require(_ticketsCounter.current() <= AVAILABLE_SUPPLY, "All tickets sold");
        require(participants[msg.sender].ownTickets < MAX_PER_ADDRESS, "Address owns ticket");

        participants[msg.sender].ownTickets++;
        _ticketsCounter.increment();

        NFTsID.push(_ticketsCounter.current()); 

        return true;
    }

    /// @notice Generate rand index for the NFTid, mint NFT and remove it from array 
    function mint() public {
        require(participants[msg.sender].ownTickets > 0, "Address does not own a ticket");
        require(!participants[msg.sender].minted, "Already minted");
        //@todo require(timerDone & allMinted)

        uint256 randomIndex = getRandmonIndex();

        _mint(msg.sender, randomIndex);
        removeIndexFromArray(randomIndex);

        participants[msg.sender].minted = true;
    }

    /// @notice Get a random index from the NFTsID array 
    function getRandmonIndex() internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(entropy))) % NFTsID.length;
    }

    /// @notice Delete minted id from array 
    /// @param index element to be deleted from NFTsID after bein minted
    function removeIndexFromArray(uint index) internal {
        require(index < NFTsID.length);

        NFTsID[index] = NFTsID[NFTsID.length-1];
        NFTsID.pop();
    }

    function _baseURI() internal view override virtual returns (string memory) {
        return "https://ipfs.io/ipfs/QmQxDjEhnYP6QAtLRyLV9N7dn1kDigz7iWnx5psmyXqy35/";
    }
}
