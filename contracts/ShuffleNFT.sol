//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ShuffleNFT is ERC721{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Random NFT", "rNFT"){}

    uint256[] public shuffle;
    uint256 public entropy = block.timestamp;


    function mint() public {
        _tokenIdCounter.increment();

        uint256 newTokenId = _tokenIdCounter.current();

        _mint(msg.sender, newTokenId);

        shuffle.push(newTokenId);
    }


    function shuffleArray() public {

        for(uint256 i = shuffle.length -1 ; i > 0; i--) {

            uint256 swapIndex = entropy % (shuffle.length - i);

            uint256 currentIndex = shuffle[i];
            uint256 indexToSwap = shuffle[swapIndex];

            shuffle[i] = indexToSwap;
            shuffle[swapIndex] = currentIndex;
        }
    }

    function getTokenRandomNumber(uint256 tokenId) public view returns(uint256) {
        return shuffle[tokenId];
    }

}
