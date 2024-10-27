// src/components/MyCollection.tsx
import React, { useState } from 'react';
import styles from "../styles.module.css";

interface Card {
    id: string;
    name: string;
    illustration: string;
}

interface MyCollectionProps {
    nfts: Card[];
}

const MyCollection: React.FC<MyCollectionProps> = ({ nfts }) => {
    const [selectedCard, setSelectedCard] = useState<Card | null>(null); // State for the selected card

    const handleCardClick = (card: Card) => {
        setSelectedCard(card); // Open modal with the selected card
    };

    const closeModal = () => {
        setSelectedCard(null); // Close modal by setting selected card to null
    };

    return (
        <div>
            <h2>My Collection</h2>
            {nfts.length > 0 ? (
                <div className={styles.cardContainer}>
                    {nfts.map((nft) => (
                        <div
                            key={nft.id}
                            className={styles.card}
                            onClick={() => handleCardClick(nft)} // Handle card click to open modal
                        >
                            <img src={nft.illustration} alt={nft.name} />
                            <h3>{nft.name}</h3>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No NFTs in your collection.</p>
            )}

            {/* Modal for displaying the selected card */}
            {selectedCard && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedCard.illustration} alt={selectedCard.name} className={styles.modalImage} />
                        <h2>{selectedCard.name}</h2>
                        <button onClick={closeModal} className={styles.closeButton}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCollection;
