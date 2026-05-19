import { CharacterDetailScreen } from '@/screens/codex/character-detail';
import { characters } from '@/shared/api';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const all = await characters.findAll();
  return all.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const character = await characters.findBySlug(slug);
  if (!character) return { title: 'Character not found' };

  const description = character.description
    ? truncate(character.description, 160)
    : `Archive entry for ${character.name}.`;

  return {
    title: character.name,
    description,
    openGraph: {
      title: character.name,
      description,
      type: 'profile',
      ...(character.image ? { images: [{ url: character.image }] } : {}),
    },
  };
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const character = await characters.findBySlug(slug);
  if (!character) notFound();

  return <CharacterDetailScreen character={character} />;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
