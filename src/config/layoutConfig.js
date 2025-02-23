export const routesWithoutHeaderFooter = [
  "/login",
  "/signup",
  "/app",
  "/cart",
  "/app/the-last-faire",
  "/mvp/builders-town/test",
  "/mvp/bazaar",
];

export const shouldShowHeaderFooter = (pathname) => {
  return !routesWithoutHeaderFooter.includes(pathname);
};
