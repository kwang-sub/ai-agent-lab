export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  city: (slug: string) => `/cities/${slug}`,
} as const;
