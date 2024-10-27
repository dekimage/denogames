export class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.personalDeck = [];
    this.personalDiscardPile = [];
    this.personalCentralBoard = [];
  }

  addToHand(item) {
    this.hand.push(item);
  }

  removeFromHand(itemId) {
    const index = this.hand.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      return this.hand.splice(index, 1)[0];
    }
    return null;
  }

  clearHand() {
    const discarded = [...this.hand];
    this.hand = [];
    return discarded;
  }

  shufflePersonalDeck() {
    for (let i = this.personalDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.personalDeck[i], this.personalDeck[j]] = [
        this.personalDeck[j],
        this.personalDeck[i],
      ];
    }
  }

  drawItems(count) {
    const drawnItems = [];
    for (let i = 0; i < count; i++) {
      if (this.personalDeck.length === 0) {
        this.reshuffleDiscardPile();
        if (this.personalDeck.length === 0) break;
      }
      const item = this.personalDeck.pop();
      drawnItems.push(item);
    }
    this.personalCentralBoard.push(...drawnItems);
    return drawnItems; // Always return an array, even if empty
  }

  reshuffleDiscardPile() {
    this.personalDeck = [...this.personalDiscardPile];
    this.shufflePersonalDeck();
    this.personalDiscardPile = [];
  }

  discardCentralBoard() {
    this.personalDiscardPile.push(...this.personalCentralBoard);
    this.personalCentralBoard = [];
  }
}
