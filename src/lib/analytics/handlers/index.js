import { CLIENT_EVENTS } from "../events";
import { handleBannerClick } from "./bannerClick";
import { handleProductCardClick } from "./productCardClick";
import { handleAddToCart } from "./addToCart";
import { handleInitiateCheckoutFromProduct } from "./initiateCheckoutFromProduct";
import { handleInitiateCheckoutFromCart } from "./initiateCheckoutFromCart";
// We'll add more handlers as we add more events

export function getEventHandler(action) {
  const handlers = {
    [CLIENT_EVENTS.BANNER_CLICK]: handleBannerClick,
    [CLIENT_EVENTS.PRODUCT_CARD_CLICK]: handleProductCardClick,
    [CLIENT_EVENTS.ADD_TO_CART]: handleAddToCart,
    [CLIENT_EVENTS.INITIATE_CHECKOUT_FROM_PRODUCT]:
      handleInitiateCheckoutFromProduct,
    [CLIENT_EVENTS.INITIATE_CHECKOUT_FROM_CART]: handleInitiateCheckoutFromCart,
    // We'll add more mappings as we add more events
  };

  return handlers[action];
}
