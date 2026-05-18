export const site = {
  name: 'Star Wars Archives',
  description: 'A read-only encyclopedia of the Star Wars galaxy.',
  url: 'https://starwars-archives.vercel.app',
  defaultTheme: 'sith',
  author: 'Aleksey Klimenko',
  repository: 'https://github.com/proggarapsody/starwars-archives',
  predecessor: 'https://github.com/proggarapsody/starwars-wiki',
  /**
   * Curated picks surfaced on the home page feature rail. Each value is a
   * canonical slug present in `src/shared/data/*.json` and resolvable via
   * the matching repository's `findBySlug`.
   */
  featuredSlugs: {
    character: 'luke-skywalker',
    film: 'the-empire-strikes-back',
    planet: 'tatooine',
    starship: 'millennium-falcon',
  },
} as const;

export type SiteConfig = typeof site;
