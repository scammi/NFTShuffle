// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //OZ: ERC721
import "@openzeppelin/contracts/access/Ownable.sol"; // OZ: Ownership
import "@openzeppelin/contracts/utils/Counters.sol"; //OZ: Counter

/// @title ShuffleOne
/// @author Santiago Cammi (scammi)
/// @notice ERC721 randmoized distribution
contract ShuffleOne is ERC721, Ownable{
    using Counters for Counters.Counter;

    /// ============ Structs ============
    
    /// @notice Users participants data
    struct Participant {
        // NFT token ID granted to be mint
        uint256 tokenId;
        // Index used to select token id
        uint256 randomIndex;
        // Number minted tokens
        uint256 minted;
        // Count of tickets bought
        uint256 ownedTickets; 
    }

    /// ============ Immutable storage ============

    /// @notice Avalible NFTs to be minted
    uint256 public immutable AVAILABLE_SUPPLY;
    /// @notice Minimum cost for ticket
    uint256 public immutable MINT_COST;
    /// @notice Maximum tickets per address
    uint256 public immutable MAX_PER_ADDRESS = 1;

    /// ============ Mutable storage ============

    /// @notice Keep track of participants 
    mapping (address => Participant) public participants;
    /// @notice Array of NFTs ID to be minted 
    uint256[] public NFTsId;
    /// @notice Source of entropy
    uint256 public entropy = block.timestamp;
    /// @notice Owner has claimed raffle proceeds
    bool public proceedsClaimed = false;

    /// @notice Keeps track of sold tickets 
    Counters.Counter internal _soldTicketsCounter;

    /// ============ Events ============

    /// @notice Emitted after a successful ticket sell 
    /// @param user Address of raffle participant
    /// @param ticketId Number of the ticket sold
    event TicketSold(address indexed user, uint256 ticketId);

    /// @notice Emitted after a successful mint 
    /// @param user Address of raffle participant
    /// @param tokenId Number of the ticket sold
    event Minted(address indexed user, uint256 tokenId);

    /// ============ Constructor ============

    /// @notice Creates a new NFT distribution contract
    /// @param _AVAILABLE_SUPPLY total NFTs to sell
    /// @param _MINT_COST in wei per ticket
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
    function buyTicket() external payable{
        //Ensure there are tickets to be sell
        require(_soldTicketsCounter.current() < AVAILABLE_SUPPLY, "All tickets sold");
        // Ensure participant owns no more than allow
        require(participants[msg.sender].ownedTickets < MAX_PER_ADDRESS, "Address owns ticket");
        // Ensure sufficient raffle ticket payment
        require(msg.value >= MINT_COST, "Insufficient payment");

        // Participant gets ticket
        participants[msg.sender].ownedTickets++;
        
        // Total sold tickets counter updated
        _soldTicketsCounter.increment();

        // Add NFT ID to be minted
        NFTsId.push(_soldTicketsCounter.current()); 
        
        // Emmit succesfull entry
        emit TicketSold(msg.sender, _soldTicketsCounter.current());
    }

    /// @notice Generate rand index for the NFTid, mint NFT and remove it from array 
    function mint() public {
        // Ensure participant owns ticket
        require(participants[msg.sender].ownedTickets > 0, "Address does not own a ticket");
        // Ensure minted amount < max allow
        require(participants[msg.sender].minted < MAX_PER_ADDRESS, "Max allow per address minted");
        // Ensure raffle is closed
        require(_soldTicketsCounter.current() == AVAILABLE_SUPPLY, "Raffle still open");

        // Pick index from NFTsIds
        uint256 randomIndex = getRandmonIndex();
        
        // Get random ID value from NFTsIds
        uint256 randomNFTsId = NFTsId[randomIndex];

        // Mint random NFT
        _mint(msg.sender, randomNFTsId);

        // Remove minted ID from NFTsIds array
        removeIndexFromArray(randomIndex);

        // Update participants data
        participants[msg.sender].randomIndex = randomIndex;
        participants[msg.sender].tokenId = randomNFTsId;
        participants[msg.sender].ownedTickets--;
        participants[msg.sender].minted++;

        // Emit minted NFT
        emit Minted(msg.sender, randomNFTsId);
    }

    /// @notice Get a random index from the NFTsId array 
    function getRandmonIndex() internal view returns (uint) {
        // Picks a random index between 0 and NFTsIDs length
        return uint(keccak256(abi.encodePacked(entropy))) % NFTsId.length;
    }

    /// @notice Delete minted id from array, gas efficient, no re-ordering of indexs
    /// @param index element to be deleted from NFTsId after bein minted
    function removeIndexFromArray(uint index) internal {
        // Ensure to avoid removing and not existing index
        require(index < NFTsId.length);

        // Move the last element to the index of the deleted one 
        NFTsId[index] = NFTsId[NFTsId.length-1];

        // Remove last element
        NFTsId.pop();
    }

    /// @notice Get the lengths of the NFTsIds array
    function getNFTsIdLength() public view returns (uint256) {
        return NFTsId.length;
    }

    /// @notice Get total numbers of tickets sold 
    function geSoldTickets() public view returns (uint256) {
        return _soldTicketsCounter.current();
    }

    /// @notice Allows contract owner to withdraw proceeds of tickets
    function withdrawRaffleProceeds() external onlyOwner {
        // Ensure raffle has ended
        require(_soldTicketsCounter.current() == AVAILABLE_SUPPLY, "Raffle still open");
        // Ensure proceeds have not already been claimed
        require(!proceedsClaimed, "Proceeds already claimed");

        // Toggle proceeds being claimed
        proceedsClaimed = true;

        // Pay owner proceeds
        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}(""); 
        require(sent, "Unsuccessful in payout");
    }

    // @Notice overrides base url
    function _baseURI() internal view override virtual returns (string memory) {
        return "https://ipfs.io/ipfs/QmQxDjEhnYP6QAtLRyLV9N7dn1kDigz7iWnx5psmyXqy35/";
    }
}
