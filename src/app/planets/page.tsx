import { PlanetsIndexScreen } from '@/screens/codex/planets';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planets',
  description:
    'Worlds of the known galaxy, with climate, terrain, and population from the archive.',
};

export default function PlanetsPage() {
  return <PlanetsIndexScreen />;
}
