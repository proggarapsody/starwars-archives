import { CharactersIndexScreen } from '@/screens/codex/characters';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Characters',
  description:
    'Every named figure in the Star Wars Archives, from junior padawans to imperial command.',
};

export default function CharactersPage() {
  return <CharactersIndexScreen />;
}
