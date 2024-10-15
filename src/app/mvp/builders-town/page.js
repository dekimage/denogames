"use client";
import { useEffect, useState } from "react";
// import { jsPDF } from "jspdf";
import Image from "next/image";

const tradeCards = [
  { id: 1, faction: "Red", cost: "[wheat][wood]", gain: "[wood]" },
  { id: 2, faction: "Blue", cost: "[water]", gain: "[steel]" },
  { id: 3, faction: "Green", cost: "[fish]", gain: "[bricks]" },
  { id: 4, faction: "Yellow", cost: "[meat]", gain: "[wood]" },
  { id: 5, faction: "Red", cost: "[water][fish]", gain: "[steel]" },
  { id: 6, faction: "Blue", cost: "[wheat][meat]", gain: "[bricks]" },
  { id: 7, faction: "Green", cost: "[fish][water]", gain: "[wood]" },
  { id: 8, faction: "Yellow", cost: "[wheat][meat]", gain: "[steel]" },
  { id: 9, faction: "Red", cost: "[water][meat]", gain: "[bricks]" },
  { id: 10, faction: "Blue", cost: "[wheat][fish]", gain: "[wood]" },
  { id: 11, faction: "Green", cost: "[meat][wheat]", gain: "[steel]" },
  { id: 12, faction: "Yellow", cost: "[water][meat]", gain: "[bricks]" },
  { id: 13, faction: "Red", cost: "[wheat][fish]", gain: "[steel]" },
  { id: 14, faction: "Blue", cost: "[fish][meat]", gain: "[wood]" },
  {
    id: 15,
    faction: "Red",
    cost: "[wheat][water][meat]",
    gain: "[wood][steel]",
  },
  {
    id: 16,
    faction: "Blue",
    cost: "[water][fish][meat]",
    gain: "[steel][bricks]",
  },
  {
    id: 17,
    faction: "Green",
    cost: "[wheat][wheat][fish]",
    gain: "[wood][bricks]",
  },
  {
    id: 18,
    faction: "Yellow",
    cost: "[meat][water][fish]",
    gain: "[steel][bricks]",
  },
  {
    id: 19,
    faction: "Red",
    cost: "[wheat][fish][water]",
    gain: "[wood][steel]",
  },
  {
    id: 20,
    faction: "Blue",
    cost: "[water][meat][wheat]",
    gain: "[bricks][steel]",
  },
  {
    id: 21,
    faction: "Green",
    cost: "[meat][meat][fish]",
    gain: "[wood][bricks]",
  },
  {
    id: 22,
    faction: "Yellow",
    cost: "[fish][wheat][water]",
    gain: "[steel][bricks]",
  },
  {
    id: 23,
    faction: "Red",
    cost: "[water][meat][fish]",
    gain: "[wood][steel]",
  },
  {
    id: 24,
    faction: "Blue",
    cost: "[wheat][meat][fish]",
    gain: "[bricks][steel]",
  },
  {
    id: 25,
    faction: "Green",
    cost: "[meat][fish][water]",
    gain: "[wood][bricks]",
  },
  {
    id: 26,
    faction: "Yellow",
    cost: "[wheat][wheat][meat]",
    gain: "[steel][bricks]",
  },
  {
    id: 27,
    faction: "Red",
    cost: "[water][fish][meat]",
    gain: "[wood][steel]",
  },
  {
    id: 28,
    faction: "Blue",
    cost: "[meat][wheat][fish]",
    gain: "[steel][bricks]",
  },
  {
    id: 29,
    faction: "Green",
    cost: "[wheat][water][meat]",
    gain: "[wood][bricks]",
  },
  {
    id: 30,
    faction: "Yellow",
    cost: "[fish][wheat][water]",
    gain: "[steel][bricks]",
  },
];

const iconMapping = {
  wheat: "builders-town/wheat.jpeg",
  water: "builders-town/water.jpeg",
  fish: "builders-town/fish.jpeg",
  meat: "builders-town/meat.jpeg",
  wood: "builders-town/wood.jpeg",
  steel: "builders-town/steel.jpeg",
  bricks: "builders-town/bricks.jpeg",
  xxxx: "builders-town/arrow.jpeg",
};

const parseEffectString = (effectString) => {
  const parts = effectString.split(/(\[[^\]]+\])/); // Split the string by brackets
  return parts.map((part, index) => {
    const match = part.match(/\[([^\]]+)\]/);
    if (match) {
      const key = match[1];
      if (iconMapping[key]) {
        return (
          <Image
            key={index}
            src={`/${iconMapping[key]}`}
            alt={key}
            width={24}
            height={24}
            className="inline-block w-8 h-8 mx-1"
          />
        );
      }
    }
    return (
      <span className="text-black font-strike uppercase" key={index}>
        {part}
      </span>
    );
  });
};

const Card = ({ faction, effect }) => {
  const cardStyle = {
    width: "150px",
    height: "200px",
    border: "1px solid black",
    backgroundColor: "#fff",
    margin: "10px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  return (
    <div style={cardStyle}>
      <div className="faction">
        <p className="text-xl font-bold">{faction}</p>
      </div>
      <div className="effect">
        <p>{parseEffectString(effect)}</p>
      </div>
    </div>
  );
};

const loadJSPDF = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.3.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf); // Resolve with jsPDF object once the script is loaded
    script.onerror = reject;
    document.body.appendChild(script); // Append script to document
  });
};

export default function Home() {
  const [selectedCards, setSelectedCards] = useState([]);

  const handleGeneratePDF = async () => {
    const selected = shuffleAndSelectCards(tradeCards);
    setSelectedCards(selected);
    await generatePDF(selected); // Make sure to wait for the PDF generation to complete
  };

  useEffect(() => {
    loadJSPDF(); // Load jsPDF when the component mounts
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trade Cards Prototype</h1>

      <button onClick={handleGeneratePDF}>Generate PDF</button>
      <div style={{ marginTop: "20px" }}>
        <h2>Selected Cards:</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          {selectedCards.map((card) => (
            <div
              key={card.id}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              <p>Faction: {card.faction}</p>
              <p>{parseEffectString(card.effect)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const shuffleAndSelectCards = (cards, num = 24) => {
  const shuffled = [...cards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const generatePDF = async (selectedCards) => {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const margin = 5; // Page margin
  const cardMargin = 2; // Card margin (roughly 4px)
  const cardWidth = (pageWidth - 2 * margin) / 4 - 2 * cardMargin;
  const cardHeight = (pageHeight - 2 * margin) / 6 - 2 * cardMargin;

  const loadImageAsBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  for (let index = 0; index < selectedCards.length; index++) {
    const card = selectedCards[index];
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = margin + col * (cardWidth + 2 * cardMargin) + cardMargin;
    const y = margin + row * (cardHeight + 2 * cardMargin) + cardMargin;

    // Draw card border
    doc.rect(x, y, cardWidth, cardHeight);

    // Add Faction
    doc.setFontSize(8);
    doc.text(`Faction: ${card.faction}`, x + 2, y + 5);

    // Icon rendering variables
    const iconSize = cardWidth / 6;
    const iconsPerRow = Math.floor(cardWidth / iconSize);

    // Render "Cost" (what you pay)
    let currentX = x + 2;
    let currentY = y + 15; // Start below faction text

    const costItems = card.cost.split(/(\[[^\]]+\])/);
    for (let i = 0; i < costItems.length; i++) {
      const part = costItems[i].match(/\[([^\]]+)\]/);
      if (part) {
        const key = part[1];
        const imgSrc = `/builders-town/${key}.jpeg`;

        try {
          const imgBase64 = await loadImageAsBase64(imgSrc);

          // Move to next row if necessary
          if (i % iconsPerRow === 0 && i !== 0) {
            currentX = x + 2;
            currentY += iconSize + 2;
          }

          doc.addImage(
            imgBase64,
            "JPEG",
            currentX,
            currentY,
            iconSize,
            iconSize
          );
          currentX += iconSize + 2; // Add small gap between icons
        } catch (error) {
          console.error(`Failed to load image: ${imgSrc}`, error);
        }
      }
    }

    // Render "Gain" (what you get)
    currentX = x + 2; // Reset to the left side of the card
    currentY += iconSize + 5; // Move below the cost row

    const gainItems = card.gain.split(/(\[[^\]]+\])/);
    for (let i = 0; i < gainItems.length; i++) {
      const part = gainItems[i].match(/\[([^\]]+)\]/);
      if (part) {
        const key = part[1];
        const imgSrc = `/builders-town/${key}.jpeg`;

        try {
          const imgBase64 = await loadImageAsBase64(imgSrc);

          // Move to next row if necessary
          if (i % iconsPerRow === 0 && i !== 0) {
            currentX = x + 2;
            currentY += iconSize + 2;
          }

          doc.addImage(
            imgBase64,
            "JPEG",
            currentX,
            currentY,
            iconSize,
            iconSize
          );
          currentX += iconSize + 2; // Add small gap between icons
        } catch (error) {
          console.error(`Failed to load image: ${imgSrc}`, error);
        }
      }
    }

    // Add a new page after every 24 cards (4x6 grid)
    if ((index + 1) % 24 === 0 && index < selectedCards.length - 1) {
      doc.addPage();
    }
  }

  doc.save("trade-cards.pdf");
};
