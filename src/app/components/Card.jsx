import React from "react";
import "./card.css";

const Card = ({ item }) => (
  <div className="card" style={{ backgroundColor: item.color }}>
    <div className="card-id">{item.id}</div>
    <div className="card-value">{item.value}</div>
  </div>
);

export default Card;
