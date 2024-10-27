import React from "react";
import "./dice.css";

const Die = ({ item }) => (
  <div className="die" style={{ backgroundColor: item.color }}>
    <div className="die-id">{item.id}</div>
    <div className="die-value">{item.value || "?"}</div>
    <div className="die-range">
      {Math.min(...item.sides)}-{Math.max(...item.sides)}
    </div>
  </div>
);

export default Die;
