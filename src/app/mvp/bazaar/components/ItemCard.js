'use client'
import Image from 'next/image'

const getRomanNumeral = (num) => {
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    return romanNumerals[num - 1] || num;
};

const getElementImage = (power) => {
    if (!power) return null;
    if (power.fire) return '/bazaar/fire.png';
    if (power.water) return '/bazaar/water.png';
    if (power.earth) return '/bazaar/earth.png';
    if (power.air) return '/bazaar/air.png';
    return null;
};

export default function ItemCard({ item }) {
    const elementSrc = getElementImage(item.power);

    return (
        <div className="w-[90px] h-[90px] flex flex-col border-r border-b border-black relative">
            {/* Tier - absolute top left */}
            <div className="absolute top-1 left-1">
                <span className="text-sm font-bold">{getRomanNumeral(item.tier)}</span>
            </div>

            {/* Element - absolute top right */}
            {elementSrc && (
                <div className="absolute top-1 right-1 w-4 h-4">
                    <Image
                        src={elementSrc}
                        alt="element"
                        width={16}
                        height={16}
                        className="object-contain"
                    />
                </div>
            )}

            {/* Main image - centered */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-12 h-12 relative">
                    <Image
                        src="/bazaar/f1.webp"
                        alt="main"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Bottom section: Dots and Squares */}
            <div className="mb-1">
                {/* Dots row */}
                <div className="flex justify-center gap-1 mb-1">
                    {[1, 2, 3].map((_, i) => (
                        <div key={`dot-${i}`} className="w-3 h-3 rounded-full border border-black"></div>
                    ))}
                </div>

                {/* Squares row */}
                <div className="flex justify-center gap-1">
                    {[1, 2, 3].map((_, i) => (
                        <div key={`square-${i}`} className="w-3 h-3 border border-black"></div>
                    ))}
                </div>
            </div>
        </div>
    )
} 