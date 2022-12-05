// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //OZ: ERC721
import "@openzeppelin/contracts/access/Ownable.sol"; // OZ: Ownership

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

import "./RandomArray.sol";

/// @title SingleShuffle
/// @author rloot
/// @notice ERC721 randomized distribution
contract ShuffleOne is VRFConsumerBaseV2, ERC721, Ownable {
    enum Status {
        OPEN,
        CLOSED,
        REQUESTING,
        FINISHED
    }

    /// ============ Structs ============

    struct Participant {
        uint40 timestamp;
        uint32 redeemableTickets;
    }

    struct ParticipantB {
        uint40 timestamp;
        uint32[] ownedTickets;
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
    mapping(address => Participant) public participants;
    /// @notice Array of participant addresses
    address[] public tickets;

    /// @notice Source of entropy
    uint256 public _entropy;

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
    error TicketsSoldOut();
    error MaxTicketsPerAddress();
    error NotEnoughEther();
    error NoRedeemableTickets();

    error RaffleStillOpen(); // same as open
    error RaffleHasEnded(); // same as closed

    error RandomnessAlreadyRequested(); // same as requesting
    error InvalidRequestId();

    error EntropyNotSet(); // same as not requesting
    error EntropyAlreadySet(); // same as finished

    /// ============ Constructor ============

    /// @notice Creates a new NFT distribution contract
    constructor(
        address vrfCoordinator,
        bytes32 keyHash,
        uint64 subId,
        uint256 _TICKETS_AMOUNT,
        uint256 _MINT_COST,
        uint256 _FINALIZATION_BLOCKNUMBER
    ) ERC721("Random NFT", "rNFT") VRFConsumerBaseV2(vrfCoordinator) {
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
        if (_soldTicketsCounter >= TICKETS_AMOUNT) {
            revert TicketsSoldOut();
        }
        // Ensure participant owns no more than allow
        if (participants[msg.sender].redeemableTickets >= MAX_PER_ADDRESS) {
            revert MaxTicketsPerAddress();
        }
        // Ensure sufficient raffle ticket payment
        if (msg.value != MINT_COST) {
            revert NotEnoughEther();
        }
        // Ensure raffle is open
        if (block.number >= FINALIZATION_BLOCKNUMBER) {
            revert RaffleHasEnded();
        }
        // Participant gets ticket
        participants[msg.sender].redeemableTickets++;

        // Total sold tickets counter updated
        _soldTicketsCounter++;

        // Add NFT ID to be minted
        tickets.push(msg.sender);

        // Emmit succesfull entry
        emit TicketSold(msg.sender, _soldTicketsCounter);
    }

    /// @notice Generate rand index for the NFTid, mint NFT and remove it from array
    function mint(uint256 ticket) public {
        // Ensure entropy is set
        if (_entropy == 0) {
            revert EntropyNotSet();
        }

        if (participants[msg.sender].redeemableTickets == 0) {
            revert NoRedeemableTickets();
        }
        if (tickets[ticket] != msg.sender) {
            revert();
        }

        // Pick index from NFTsIds
        uint256 randomIndex = RandomArray.getNextRandomIndex(
            tickets,
            _entropy,
            ticket
        );

        // Mint random NFT
        _mint(msg.sender, randomIndex);

        participants[msg.sender].redeemableTickets--;

        // todo : if we store `tickets.length` when raffle is closed
        //         i think we can remove the element from the array of tickets

        // Emit minted NFT
        emit Minted(msg.sender, randomIndex);
    }

    function requestRandomness() external {
        if (_requestId != 0) {
            revert RandomnessAlreadyRequested();
        }
        if (isOpen()) {
            revert RaffleStillOpen();
        }

        // This can be set only once.
        _requestId = VRFCoordinatorV2Interface(_vrfCoordinator)
            .requestRandomWords(
                _keyHash,
                _subId,
                MINIMUM_CONFIRMATIONS,
                CALLBACK_GAS_LIMIT,
                WORDS_AMOUNT
            );
    }

    function getRequestId() external view returns (uint256) {
        return _requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        // verify requestId
        if (_requestId != requestId) {
            revert InvalidRequestId();
        }

        if (_entropy != 0) {
            revert EntropyAlreadySet();
        }

        // set entropy
        _entropy = randomWords[0];
    }

    /// @notice Get total numbers of tickets sold
    function getSoldTickets() public view returns (uint256) {
        return _soldTicketsCounter;
    }

    /// @notice Allows contract owner to withdraw proceeds of tickets
    function withdrawTo(address to) external onlyOwner {
        // if (getStatus() != Status.FINISHED) {
        //     revert 'cant withdraw'
        // }

        // Pay owner proceeds
        (bool sent, ) = payable(to).call{value: address(this).balance}("");
        require(sent, "Unsuccessful in payout");
    }

    // @Notice overrides base url
    function _baseURI() internal view virtual override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmQxDjEhnYP6QAtLRyLV9N7dn1kDigz7iWnx5psmyXqy35/";
    }

    function isOpen() internal view returns (bool) {
        return
            _soldTicketsCounter < TICKETS_AMOUNT &&
            block.number <= FINALIZATION_BLOCKNUMBER;
    }

    function isClosed() internal view returns (bool) {
        return
            _soldTicketsCounter >= TICKETS_AMOUNT &&
            block.number <= FINALIZATION_BLOCKNUMBER;
    }

    function isFinished() internal view returns (bool) {
        return _entropy != 0;
    }

    // open => closed => requesting => finished
    function getStatus() public view returns (Status status) {
        if (_entropy != 0) {
            status = Status.FINISHED;
        } else if (_requestId != 0) {
            status = Status.REQUESTING;
        } else if (
            _soldTicketsCounter >= TICKETS_AMOUNT ||
            block.number >= FINALIZATION_BLOCKNUMBER
        ) {
            status = Status.CLOSED;
        } else {
            status = Status.OPEN;
        }
    }
}
