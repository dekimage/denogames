'use client'

import { items } from '@/app/app/engine/bazaar/bazaarDB'
import ItemCard from './ItemCard'

export default function MiddleColumn() {
    // Updated to 7 rows and 9 columns
    const rows = 7;
    const cols = 9;
    const totalItems = rows * cols;
    const displayItems = items.slice(0, totalItems);

    const gridRows = Array.from({ length: rows }, (_, rowIndex) => {
        return displayItems.slice(rowIndex * cols, (rowIndex + 1) * cols);
    });

    return (
        <div className="flex-1">
            <div className="border-l border-t border-black">
                {gridRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {row.map((item, colIndex) => (
                            <ItemCard
                                key={`${rowIndex}-${colIndex}`}
                                item={item}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
} 