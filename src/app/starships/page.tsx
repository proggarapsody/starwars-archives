import { StarshipsIndexScreen } from '@/screens/codex/starships';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Starships',
  description:
    'Hyperspace-capable craft of the Star Wars Archives, with class, manufacturer, and hyperdrive ratings.',
};

export default function StarshipsPage() {
  return <StarshipsIndexScreen />;
}
