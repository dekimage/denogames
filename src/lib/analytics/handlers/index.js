import { handleBannerClick } from "./bannerClick";
import { handleProductCardClick } from "./productCardClick";
// We'll add more handlers as we add more events

const handlers = {
  banner_click: handleBannerClick,
  product_card_click: handleProductCardClick,
  // We'll add more mappings as we add more events
};

export function getEventHandler(action) {
  return handlers[action];
}
