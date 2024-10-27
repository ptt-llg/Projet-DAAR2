// src/components/MyBooster.tsx
import React, { useState } from 'react';
import styles from "../styles.module.css";
import axios from 'axios';

interface Card {
    id: string;
    name: string;
    illustration: string;
}

interface MyBoosterProps {
    addToCollection: (cards: Card[]) => void;
}

const MyBooster: React.FC<MyBoosterProps> = ({ addToCollection }) => {
    const [boosterId, setBoosterId] = useState('');
    const [numberOfCards, setNumberOfCards] = useState(5); // Default number of cards
    const [message, setMessage] = useState('');
    const [redeemedCards, setRedeemedCards] = useState<Card[]>([]);

    const createBooster = async () => {
        try {
            await axios.post('http://localhost:3001/api/boosters', {
                id: boosterId,
                numberOfCards,
            });
            setMessage('Booster created successfully!');
        } catch (error) {
            console.error('Error creating booster:', error);
            setMessage('Failed to create booster.');
        }
    };

    const redeemBooster = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/redeem', {
                boosterId,
            });

            const redeemedCards = response.data.cards;
            setRedeemedCards(redeemedCards); // Show redeemed cards temporarily in this component
            addToCollection(redeemedCards); // Automatically add to collection
            setMessage(`Redeemed booster with ID: ${boosterId}`);
        } catch (error) {
            console.error('Error redeeming booster:', error);
            setMessage('Failed to redeem booster.');
        }
    };

    return (
        <div>
            <h2>My Booster Packs</h2>
            <input
                type="text"
                placeholder="Booster ID"
                value={boosterId}
                onChange={(e) => setBoosterId(e.target.value)}
            />
            <input
                type="number"
                placeholder="Number of Cards"
                value={numberOfCards}
                onChange={(e) => setNumberOfCards(Number(e.target.value))}
                min="1"
                max="10"
            />
            <button onClick={createBooster}>Create Booster</button>
            <button onClick={redeemBooster}>Redeem Booster</button>
            {message && <p>{message}</p>}
            
            {redeemedCards.length > 0 && (
                <div>
                    <h3>Redeemed Cards:</h3>
                    <div className={styles.cardContainer}>
                        {redeemedCards.map(card => (
                            <div key={card.id} className={styles.card}>
                                <img src={card.illustration} alt={card.name} />
                                <h3>{card.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBooster;
