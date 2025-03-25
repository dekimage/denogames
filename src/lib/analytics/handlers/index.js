import { CLIENT_EVENTS } from "../events";
import { handleBannerClick } from "./bannerClick";
import { handleProductCardClick } from "./productCardClick";
// We'll add more handlers as we add more events

export function getEventHandler(action) {
  const handlers = {
    [CLIENT_EVENTS.BANNER_CLICK]: handleBannerClick,
    [CLIENT_EVENTS.PRODUCT_CARD_CLICK]: handleProductCardClick,
    // We'll add more mappings as we add more events
  };

  return handlers[action];
}
