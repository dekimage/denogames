"use client";

import CardDrawEngine from "../engines/CardDrawEngine";

const gameConfig = {
  rows: 3,
  cols: 3,
  cardsToDraw: 3,
};

const MyCardGame = () => {
  return <CardDrawEngine config={gameConfig} />;
};

export default MyCardGame;
