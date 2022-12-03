// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0;

/// ============ Imports ============

/// @title RandomArray
/// @notice 
library RandomArray {

    /// @notice Get a random index from the NFTsId array 
    function getNextRandomIndex(uint256[] storage array, uint256 entropy) internal view returns (uint256) {
        // Picks a random index between 0 and the amount of IDs minus 1
        return entropy % array.length;
    }

    /// @notice Remove index from array
    /// @dev overwrites the removed element with the last element of the array and pops it.
    /// @param index the number of the index to remove
    function removeIndexFromArray(uint256[] storage array, uint256 index) internal {
        // Ensure to avoid removing and not existing index
        // do we really need this? or the array type performs any checks on the index?
        require(index < array.length);

        // Move the last element to the index of the deleted one 
        array[index] = array[array.length-1];

        // Remove last element
        array.pop();
    }

    function next(uint256 prev) external pure returns (uint256 n) {
        n = prev;
        unchecked {
            n *= 1000003;
        }
        return n;
    }
    function next(uint32 x) external pure returns (uint256 r) {
        uint256 n = x;
        n ^= n << 13;
        n ^= n >> 17;
        n ^= n << 5;
        r = n;
    } 

}
