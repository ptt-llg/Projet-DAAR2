// api/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store all cards in memory
let allCards = [];
const boosters = []; // Store boosters in memory

// Fetch all cards for a specific set and save their data
const fetchAllPokémonCards = async (setCode) => {
    try {
        const response = await axios.get(`https://api.pokemontcg.io/v2/cards?setCode=${setCode}`);
        const cards = response.data.data;
        allCards = cards.map(card => ({ id: card.id, name: card.name, illustration: card.images.small }));
        console.log('Fetched cards:', allCards);
    } catch (error) {
        console.error(`Error fetching cards for set ${setCode}:`, error);
    }
};

// Fetch cards when server starts (you can change the set code if needed)
fetchAllPokémonCards('base1'); // Example for Base Set

// API to get Pokémon card info
const getPokémonCardInfo = async (id) => {
    try {
        const response = await axios.get(`https://api.pokemontcg.io/v2/cards/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching card info for ID ${id}:`, error);
        return null;
    }
};

// API to get card details by ID
app.get('/api/nft/:id', async (req, res) => {
    const nftId = req.params.id;
    const cardInfo = await getPokémonCardInfo(nftId);

    if (cardInfo) {
        res.json({
            name: cardInfo.name,
            illustration: cardInfo.images.small,
        });
    } else {
        res.status(404).json({ error: "NFT not found" });
    }
});

// Create booster endpoint
app.post('/api/boosters', (req, res) => {
    const { id, numberOfCards } = req.body; // Booster ID and number of cards requested
    if (allCards.length === 0) {
        return res.status(500).json({ error: "No cards available to create booster" });
    }

    // Shuffle and pick random cards
    const shuffledCards = allCards.sort(() => 0.5 - Math.random());
    const selectedCards = shuffledCards.slice(0, Math.min(numberOfCards, shuffledCards.length));

    // Create booster and store it
    const booster = { id, cards: selectedCards };
    boosters.push(booster);

    res.status(201).json({ message: 'Booster created', booster });
});

// Redeem booster endpoint
app.post('/api/redeem', (req, res) => {
    const { boosterId } = req.body;
    const booster = boosters.find(b => b.id === boosterId);

    if (!booster) {
        return res.status(404).json({ error: "Booster not found" });
    }

    // Return the cards in the booster and remove it from memory
    res.json({ message: 'Booster redeemed', cards: booster.cards });
    boosters.splice(boosters.indexOf(booster), 1); // Remove the booster after redeeming
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
