// Event Categories
export const EVENT_CATEGORIES = {
  AUTH: "auth",
  BLOG: "blog",
  SHOP: "shop",
  GAME: "game",
  USER: "user",
  SYSTEM: "system",
  MARKETING: "marketing",
};

// Frontend (client-side) trackable events
export const CLIENT_EVENTS = {
  // Blog related
  BLOG_VIEW: "blog_view",
  BLOG_SEARCH: "blog_search",
  BLOG_FILTER: "blog_filter",

  // Shop related
  PRODUCT_VIEW: "product_view",
  ADD_TO_CART: "add_to_cart",

  // Game related
  GAME_START: "game_start",
  GAME_PAUSE: "game_pause",

  // User interactions
  PROFILE_VIEW: "profile_view",
  SETTINGS_CHANGE: "settings_change",

  // Banner related
  BANNER_CLICK: "banner_click",

  // Product related
  PRODUCT_CARD_CLICK: "product_card_click",
};

// Backend (server-side) trackable events
export const SERVER_EVENTS = {
  // Purchase related
  PURCHASE_COMPLETE: "purchase_complete",
  REFUND_PROCESSED: "refund_processed",

  // User account related
  USER_REGISTERED: "user_registered",
  EMAIL_VERIFIED: "email_verified",

  // Achievement related
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked",
  REWARD_CLAIMED: "reward_claimed",

  // System events
  ONBOARDING_COMPLETE: "onboarding_complete",
  ADDON_UNLOCKED: "addon_unlocked",
};

// Helper function to check if an event is server-only
export function isServerOnlyEvent(eventName) {
  return Object.values(SERVER_EVENTS).includes(eventName);
}

// Helper function to check if an event is valid client event
export function isValidClientEvent(eventName) {
  return Object.values(CLIENT_EVENTS).includes(eventName);
}

// Helper to get event metadata
export function getEventMetadata(eventName) {
  const allEvents = { ...CLIENT_EVENTS, ...SERVER_EVENTS };
  if (!(eventName in allEvents)) {
    throw new Error(`Invalid event name: ${eventName}`);
  }

  return {
    isSecure: isServerOnlyEvent(eventName),
    category: getEventCategory(eventName),
  };
}

// Helper to get category for an event
function getEventCategory(eventName) {
  const eventCategories = {
    [CLIENT_EVENTS.BLOG_VIEW]: EVENT_CATEGORIES.BLOG,
    [CLIENT_EVENTS.BLOG_SEARCH]: EVENT_CATEGORIES.BLOG,
    [SERVER_EVENTS.PURCHASE_COMPLETE]: EVENT_CATEGORIES.SHOP,
    [CLIENT_EVENTS.BANNER_CLICK]: EVENT_CATEGORIES.MARKETING,
    // Add more mappings as needed
  };

  return eventCategories[eventName] || EVENT_CATEGORIES.SYSTEM;
}
