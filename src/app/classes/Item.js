export class Item {
  constructor(id, type, color) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.level = 1;
  }
}

export class Card extends Item {
  constructor(id, value, color) {
    super(id, "card", color);
    this.value = value;
  }
}

export class Die extends Item {
  constructor(id, sides, color) {
    super(id, "die", color);
    this.sides = sides;
    this.currentValue = null;
  }

  roll() {
    this.currentValue =
      this.sides[Math.floor(Math.random() * this.sides.length)];
    return this.currentValue;
  }
}
