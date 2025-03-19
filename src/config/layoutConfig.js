export const routesWithoutHeaderFooter = [
  "/login",
  "/signup",
  "/app",
  "/app/the-last-faire",
  "/mvp/builders-town/test",
  "/mvp/bazaar",
];

export const shouldShowHeaderFooter = (pathname) => {
  return !routesWithoutHeaderFooter.includes(pathname);
};
