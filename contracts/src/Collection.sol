// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin ERC721 implementation
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Collection is ERC721URIStorage {
    using Counters for Counters.Counter;

    string public collectionName;
    uint public cardCount;
    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to card number
    mapping(uint => uint) public cardNumber;

    constructor(string memory _name, uint _cardCount) ERC721(_name, "CARD") {
        collectionName = _name;
        cardCount = _cardCount;
    }

    // Function to mint a new card
    function mintCard(address to, string memory tokenURI) public {
        require(_tokenIdCounter.current() < cardCount, "Max card count reached");
        
        uint tokenId = _tokenIdCounter.current();
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI); // Set metadata URI
        cardNumber[tokenId] = tokenId; // Associate token ID with card number

        _tokenIdCounter.increment(); // Increment token ID for next mint
    }
}
