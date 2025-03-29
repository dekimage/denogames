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

  // Checkout related
  INITIATE_CHECKOUT_FROM_PRODUCT: "initiate_checkout_from_product",
  INITIATE_CHECKOUT_FROM_CART: "initiate_checkout_from_cart",

  // Blog card related
  BLOG_CARD_CLICK: "blog_card_click",

  // Blog read related
  BLOG_READ: "blog_read",

  // Generic click
  GENERIC_CLICK: "generic_click",

  // User login related
  USER_LOGIN: "user_login",
  USER_SIGNUP: "user_signup",
  USER_LOGIN_GOOGLE: "user_login_google",
  LOGIN_ERROR: "login_error",
  SIGNUP_ERROR: "signup_error",
  USER_LOGOUT: "user_logout",
  LOGOUT_ERROR: "logout_error",
};

// Backend (server-side) trackable events
export const SERVER_EVENTS = {
  // Purchase related
  PURCHASE_COMPLETE: "purchase_complete",

  // User account related
  USER_REGISTERED: "user_registered",

  // Achievement related
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked",
  REWARD_CLAIMED: "reward_claimed",

  // System events
  ONBOARDING_COMPLETE: "onboarding_complete",
  ADDON_UNLOCKED: "addon_unlocked",

  // New server event
  ACHIEVEMENT_ATTEMPT: "achievement_attempt",

  // Authentication related
  AUTH_SUCCESS: "auth_success",
  AUTH_ERROR: "auth_error",

  // Review related
  REVIEW_CREATE: "review_create",
  REVIEW_UPDATE: "review_update",

  // New server event
  ADDON_CRAFTED: "addon_crafted",

  // New server event
  ORDER_CREATED: "order_created",
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

export const ALLOWED_CLICK_LABELS = {
  PRIVACY_POLICY: "privacy-policy",
  TERMS_CONDITIONS: "terms-conditions",

  // Category Navigation
  CATEGORY_GAMES: "category-games",
  CATEGORY_EXPANSIONS: "category-expansions",
  CATEGORY_ADDONS: "category-addons",

  // Main Navigation
  NAV_HOME: "nav-home",
  NAV_SHOP: "nav-shop",
  NAV_BLOG: "nav-blog",
  NAV_CART: "nav-cart",
  NAV_LOGIN: "nav-login",
  NAV_SIGNUP: "nav-signup",

  // User Menu Navigation
  NAV_ACCOUNT: "nav-account",
  NAV_MY_GAMES: "nav-my-games",
  NAV_ADDONS: "nav-addons",
  NAV_COLLECTION: "nav-collection",
  NAV_ORDERS: "nav-orders",
  NAV_REVIEWS: "nav-reviews",
  NAV_LOGOUT: "nav-logout",

  // New Footer Platform links
  FOOTER_HOW_IT_WORKS: "footer-how-it-works",
  FOOTER_APP_TOOLS: "footer-app-tools",

  // New Footer Company links
  FOOTER_ABOUT: "footer-about",
  FOOTER_CONTACT: "footer-contact",
  FOOTER_FAQ: "footer-faq",

  // New Footer Community links
  FOOTER_NEWSLETTER: "footer-newsletter",
  FOOTER_DISCORD: "footer-discord",
  FOOTER_INSTAGRAM: "footer-instagram",
  FOOTER_PATREON: "footer-patreon",
  FOOTER_TWITTER: "footer-twitter",
};
