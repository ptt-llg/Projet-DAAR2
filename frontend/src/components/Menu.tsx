// src/components/Menu.tsx
import React from 'react';

interface MenuProps {
    onSelect: (view: string) => void; // Function type for the onSelect prop
}

const Menu: React.FC<MenuProps> = ({ onSelect }) => {
    return (
        <nav>
            <button onClick={() => onSelect('all')}>All Collections</button>
            <button onClick={() => onSelect('myCollection')}>My Collection</button>
            <button onClick={() => onSelect('booster')}>Booster Packs</button>
        </nav>
    );
};

export default Menu;
