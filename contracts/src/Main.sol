// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // Import ERC721URIStorage for token URI management
import "@openzeppelin/contracts/utils/Counters.sol"; // For counter utility

contract Main is ERC721URIStorage { // Change to ERC721URIStorage
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public cardCount; // Total number of cards

    struct Booster {
        string id;
        string[] cards; // Store card IDs in the booster
        address owner;  // Owner of the booster
    }
    
    mapping(string => Booster) private boosters; // Store boosters by id

    constructor() ERC721("Pokemon TCG", "PTCG") {
        cardCount = 1000; // Example total card count
    }

    // Function to mint a new card
    function mintCard(address to, string memory tokenURI) public {
        require(_tokenIdCounter.current() < cardCount, "Max card count reached");
        
        uint tokenId = _tokenIdCounter.current();
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI); // Set metadata URI from the URI storage
        _tokenIdCounter.increment(); // Increment token ID for next mint
    }

    function createBooster(string calldata id, string[] calldata cards) external {
        boosters[id] = Booster(id, cards, msg.sender); // Create a new booster
    }

    function redeemBooster(string calldata id) external {
        Booster storage booster = boosters[id];
        require(booster.owner == msg.sender, "Not the owner of the booster");

        // Mint each card contained in the booster
        for (uint i = 0; i < booster.cards.length; i++) {
            mintCard(msg.sender, booster.cards[i]); // Use the existing mintCard function
        }

        // After redeeming, you can delete the booster if desired
        delete boosters[id];
    }
}
