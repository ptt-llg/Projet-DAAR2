// src/components/Card.tsx
import React from 'react';

interface CardProps {
    name: string;
    illustration: string; // Use 'string' for the URL or an optional type if it might be undefined
}

const Card: React.FC<CardProps> = ({ name, illustration }) => {
    return (
        <div>
            <h3>{name}</h3>
            {illustration && <img src={illustration} alt={name} />}
        </div>
    );
};

export default Card;
