// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //OZ: ERC721
import "@openzeppelin/contracts/utils/Counters.sol"; //OZ: Counter

/// @title SuffleNFT
/// @notice ERC721 randmoized distribution
contract ShuffleOne is ERC721{
    using Counters for Counters.Counter;

    /// ============ Immutable storage ============

    /// @notice Avalible NFTs to be minted
    uint256 public immutable AVAILABLE_SUPPLY = 5;
    /// @notice Maximum tickets per address
    uint256 public immutable MAX_PER_ADDRESS = 1;

    /// ============ Mutable storage ============

    /// @notice Array of NFTs ID to be minted 
    uint256[] NFTsID = [0,1,2,3,4];
    /// @notice Source of entropy
    uint256 public entropy = block.timestamp;
    /// @notice Keep track of what address bough a ticket 
    mapping (address => uint256) public Tickets;
    /// @notice Keeps track of sold tickets 
    Counters.Counter private _ticketsCounter;

    /// ============ Constructor ============

    constructor() ERC721("Random NFT", "rNFT"){}


    /// ============ Functions ============

    /// @notice Enters raffle 
    function buyTicket() public {
        require(_ticketsCounter.current() < AVAILABLE_SUPPLY, "no more tickets");
        require(Tickets[msg.sender] != MAX_PER_ADDRESS, "Address owns ticket");

        Tickets[msg.sender] = 1;
        _ticketsCounter.increment();
    }

    /// @notice Generate rand index for the NFTid, mint NFT and remove it from array 
    function mint() public {
        require(Tickets[msg.sender] > 0, "Address does not own a ticket");
        
        uint randId = getRandmonIndex();

        _mint(msg.sender, randId);

        removeIndex(randId);
    }

    /// @notice Get a random index from the NFTsID array 
    function getRandmonIndex() public view returns (uint){
        uint random = uint(keccak256(abi.encodePacked(entropy)));
        return random % NFTsID.length;
    }

    /// @notice Delete minted id from array 
    /// @param index element to be deleted from NFTsID after bein minted
    function removeIndex(uint index) public {
        require(index < NFTsID.length);
        NFTsID[index] = NFTsID[NFTsID.length-1];
        NFTsID.pop();
    }
}
