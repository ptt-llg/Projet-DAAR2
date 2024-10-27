// src/components/Collections.tsx
import React from 'react';

interface CollectionsProps {
    collections: string[]; // Assuming collections is an array of string names
}

const Collections: React.FC<CollectionsProps> = ({ collections }) => {
    return (
        <div>
            <h2>Collections</h2>
            {collections.length > 0 ? (
                <ul>
                    {collections.map((collection, index) => (
                        <li key={index}>{collection}</li>
                    ))}
                </ul>
            ) : (
                <p>No collections available.</p>
            )}
        </div>
    );
};

export default Collections;
