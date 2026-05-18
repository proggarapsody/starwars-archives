export const routes = {
  home: '/',

  characters: '/characters',
  character: (slug: string) => `/characters/${slug}`,

  films: '/films',
  film: (slug: string) => `/films/${slug}`,

  planets: '/planets',
  planet: (slug: string) => `/planets/${slug}`,

  species: '/species',
  speciesEntry: (slug: string) => `/species/${slug}`,

  starships: '/starships',
  starship: (slug: string) => `/starships/${slug}`,

  vehicles: '/vehicles',
  vehicle: (slug: string) => `/vehicles/${slug}`,

  about: '/about',
  sources: '/sources',
  api: '/api',
} as const;

export const primaryNav = [
  { label: 'Characters', href: routes.characters },
  { label: 'Films', href: routes.films },
  { label: 'Planets', href: routes.planets },
  { label: 'Species', href: routes.species },
  { label: 'Starships', href: routes.starships },
  { label: 'Vehicles', href: routes.vehicles },
] as const;
