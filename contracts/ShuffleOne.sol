// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //OZ: ERC721
import "@openzeppelin/contracts/access/Ownable.sol"; // OZ: Ownership

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

/// @title ShuffleOne
/// @author Rloot
/// @notice ERC721 randomized distribution
contract ShuffleOne is VRFConsumerBaseV2, ERC721, Ownable {

    enum Status {
        OPEN,
        CLOSED,
        REQUESTING,
        FINISHED
    }

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

    struct Participant2 {
        // address addr;
        uint40 timestamp;
        uint32 redeemableTickets;
    }

    /// ============ Immutable storage ============

    /// @notice Blocknumber raffle ends at.
    uint256 public immutable FINALIZATION_BLOCKNUMBER;
    /// @notice Avalible NFTs to be minted
    uint256 public immutable TICKETS_AMOUNT;
    /// @notice Minimum cost for ticket
    uint256 public immutable MINT_COST;
    /// @notice Maximum tickets per address
    uint256 public immutable MAX_PER_ADDRESS = 1;

    /// ============ Mutable storage ============

    /// @notice Keep track of participants 
    mapping (address => Participant2) public participants;
    /// @notice Array of NFTs ID to be minted 
    uint256[] public NFTsId;
    /// @notice Source of entropy
    uint256 public entropy;
    /// @notice Owner has claimed raffle proceeds
    bool public proceedsClaimed = false;

    /// @notice Keeps track of sold tickets 
    uint256 internal _soldTicketsCounter;

    // VRF v2
    bytes32 internal immutable _keyHash;
    uint64 internal immutable _subId;
    address internal immutable _vrfCoordinator;
    
    uint256 internal _requestId;

    uint16 public constant MINIMUM_CONFIRMATIONS = 3;
    uint32 public constant CALLBACK_GAS_LIMIT = 1_200_000;
    uint32 public constant WORDS_AMOUNT = 10;

    /// ============ Events ============

    /// @notice Emitted after a successful ticket sell 
    /// @param user Address of raffle participant
    /// @param ticketId Number of the ticket sold
    event TicketSold(address indexed user, uint256 ticketId);

    /// @notice Emitted after a successful mint 
    /// @param user Address of raffle participant
    /// @param tokenId Number of the ticket sold
    event Minted(address indexed user, uint256 tokenId);

    /// ============ Errors ============
    // error 

    /// ============ Constructor ============

    /// @notice Creates a new NFT distribution contract
    constructor(
        address vrfCoordinator,
        bytes32 keyHash,
        uint64 subId,
        uint256 _TICKETS_AMOUNT,
        uint256 _MINT_COST,
        uint256 _FINALIZATION_BLOCKNUMBER
    )
        ERC721("Random NFT", "rNFT")
        VRFConsumerBaseV2(vrfCoordinator)
    {
        TICKETS_AMOUNT = _TICKETS_AMOUNT;
        MINT_COST = _MINT_COST;
        FINALIZATION_BLOCKNUMBER = block.number + _FINALIZATION_BLOCKNUMBER; 

        _keyHash = keyHash;
        _subId = subId;
        _vrfCoordinator = vrfCoordinator;
    }

    /// ============ Functions ============

    /// @notice Enters raffle 
    function buyTicket() external payable {
        // Ensure there are tickets to be sell
        require(_soldTicketsCounter < TICKETS_AMOUNT, "All tickets sold");
        // Ensure participant owns no more than allow
        require(participants[msg.sender].redeemableTickets < MAX_PER_ADDRESS, "Address owns ticket");
        // Ensure sufficient raffle ticket payment
        require(msg.value == MINT_COST, "Insufficient payment");
        // Ensure raffle is open
        require(block.number <= FINALIZATION_BLOCKNUMBER, "Raffle has ended");

        // Participant gets ticket
        // participants[msg.sender].ownedTickets++;
        participants[msg.sender].redeemableTickets++;
        
        // Total sold tickets counter updated
        _soldTicketsCounter++;

        // Add NFT ID to be minted
        NFTsId.push(_soldTicketsCounter); 
        
        // Emmit succesfull entry
        emit TicketSold(msg.sender, _soldTicketsCounter);
    }

    function requestRandomness() external {
        // This can be set only.

        require(_requestId == 0, 'random already requested');
        require(!isRaffleOpen(), "Raffle still open");

        _requestId = VRFCoordinatorV2Interface(_vrfCoordinator).requestRandomWords(
            _keyHash, _subId, MINIMUM_CONFIRMATIONS, CALLBACK_GAS_LIMIT, WORDS_AMOUNT
        );
    }

    function getRequestId() external view returns(uint256) {
        return _requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // verify requestId
        require(_requestId == requestId, "requestId do not match");
        require(entropy == 0, "entropy already set");
        // set entropy
        entropy = randomWords[0];
    }


    /// @notice Generate rand index for the NFTid, mint NFT and remove it from array 
    function mint() public {
        // Ensure raffle is closed
        require(!isRaffleOpen(), "Raffle still open");
        // Ensure entropy is set
        require(entropy != 0, "Entropy is not set");

        // // Ensure participant owns ticket
        // require(participants[msg.sender].ownedTickets > 0, "Address does not own a ticket");
        // // Ensure minted amount < max allow
        // require(participants[msg.sender].minted < MAX_PER_ADDRESS, "Max allow per address minted");

        require(participants[msg.sender].redeemableTickets > 0, "caller have 0 redeemable tickets");

        // Pick index from NFTsIds
        uint256 randomIndex = getRandomIndex();
        
        // Get random ID value from NFTsIds
        uint256 randomNFTsId = NFTsId[randomIndex];

        // Mint random NFT
        _mint(msg.sender, randomNFTsId);

        // Remove minted ID from NFTsIds array
        removeIndexFromArray(randomIndex);
        // Update participants data
        // participants[msg.sender].randomIndex = randomIndex;
        // participants[msg.sender].tokenId = randomNFTsId;
        // participants[msg.sender].ownedTickets--;
        // participants[msg.sender].minted++;
        participants[msg.sender].redeemableTickets--;

        // Emit minted NFT
        emit Minted(msg.sender, randomNFTsId);
    }

    /// @notice Get a random index from the NFTsId array 
    function getRandomIndex() internal view returns (uint) {
        // Picks a random index between 0 and NFTsIDs length
        return entropy % NFTsId.length;
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
    function getSoldTickets() public view returns (uint256) {
        return _soldTicketsCounter;
    }

    /// @notice Allows contract owner to withdraw proceeds of tickets
    function withdrawRaffleProceeds() external onlyOwner {
        // Ensure raffle has ended
        require(!isRaffleOpen(), "Raffle still open");        // Ensure proceeds have not already been claimed
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

    function isRaffleOpen() internal view returns (bool) {
        return _soldTicketsCounter < TICKETS_AMOUNT && block.number <= FINALIZATION_BLOCKNUMBER;
    }

    function getStatus() public view returns (Status status) {
        if (entropy != 0) {
            status = Status.FINISHED;
        } else if (_requestId != 0) {
            status = Status.REQUESTING;
        } else if (_soldTicketsCounter >= TICKETS_AMOUNT || block.number >= FINALIZATION_BLOCKNUMBER) {
            status = Status.CLOSED;
        } else {
            status = Status.OPEN;
        }
        
    }
}
