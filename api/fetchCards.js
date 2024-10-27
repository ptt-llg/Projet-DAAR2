// api/fetchCards.js
const axios = require('axios');

const getPokémonCards = async (setCode) => {
    try {
        const response = await axios.get(`https://api.pokemontcg.io/v2/cards?setCode=${setCode}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching cards for set ${setCode}:`, error);
        return [];
    }
};

const fetchAllCards = async () => {
    const sets = ['base1', 'jungle', 'fossil']; // Add more set codes as needed
    const allCards = {};

    for (const set of sets) {
        const cards = await getPokémonCards(set);
        allCards[set] = cards.length; // Store the card count
        console.log(`Set: ${set}, Card Count: ${cards.length}`);
    }

    console.log(allCards);
};

fetchAllCards();
