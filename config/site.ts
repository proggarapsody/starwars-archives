export const site = {
  name: 'Star Wars Archives',
  description: 'A read-only encyclopedia of the Star Wars galaxy.',
  url: 'https://starwars-archives.vercel.app',
  defaultTheme: 'sith',
  author: 'Aleksey Klimenko',
  repository: 'https://github.com/proggarapsody/starwars-archives',
  predecessor: 'https://github.com/proggarapsody/starwars-wiki',
} as const;

export type SiteConfig = typeof site;
