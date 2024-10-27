export class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.personalDeck = [];
    this.personalDiscardPile = [];
    this.personalCentralBoard = [];
  }

  initializePersonalDeck(initialDeck) {
    // Create deep copies of items with unique IDs for this player
    this.personalDeck = initialDeck.map((item) => ({
      ...item,
      id: `player${this.id}-item${item.id}`, // Make the ID format more distinct
    }));
    this.shufflePersonalDeck();
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
    this.personalCentralBoard = drawnItems; // Replace the central board instead of adding to it
    return drawnItems;
  }

  reshuffleDiscardPile() {
    this.personalDeck.push(...this.personalDiscardPile);
    this.shufflePersonalDeck();
    this.personalDiscardPile = [];
  }

  discardCentralBoard() {
    this.personalDiscardPile.push(...this.personalCentralBoard);
    this.personalCentralBoard = [];
  }

  addMarketplaceItemToDiscardPile(item) {
    this.personalDiscardPile.push(item);
  }

  upgradeItem(itemId) {
    // itemId should now be the full unique ID (e.g., "player1-item3")
    const upgradeItem = (item) => {
      // Exact match on the full unique ID
      if (item.id === itemId) {
        return {
          ...item,
          level: (item.level || 1) + 1,
          value: item.type === "card" ? item.value + 2 : item.value,
          sides:
            item.type === "die"
              ? item.sides.map((side) => side + 1)
              : item.sides,
        };
      }
      return item;
    };

    this.personalDeck = this.personalDeck.map(upgradeItem);
    this.personalCentralBoard = this.personalCentralBoard.map(upgradeItem);
    this.personalDiscardPile = this.personalDiscardPile.map(upgradeItem);
  }
}
