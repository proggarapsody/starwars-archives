import { FilmsIndexScreen } from '@/screens/codex/films';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Films',
  description: 'The skywalker saga in episode order, with directors, release years, and key facts.',
};

export default function FilmsPage() {
  return <FilmsIndexScreen />;
}
