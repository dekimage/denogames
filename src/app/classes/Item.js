export class Item {
  constructor(id, type, color) {
    this.id = id;
    this.type = type;
    this.color = color;
  }
}

export class Card {
  constructor(id, value, color) {
    this.id = id;
    this.value = value;
    this.color = color;
    this.type = "card";
  }
}

export class Die {
  constructor(id, sides, color) {
    this.id = id;
    this.sides = sides;
    this.color = color;
    this.currentValue = null;
    this.type = "die";
  }

  roll() {
    this.currentValue =
      this.sides[Math.floor(Math.random() * this.sides.length)];
    return this.currentValue;
  }
}
