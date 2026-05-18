import { SpeciesIndexScreen } from '@/screens/codex/species';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Species',
  description:
    'Sentient peoples and creatures of the galaxy, with their classifications and tongues.',
};

export default function SpeciesPage() {
  return <SpeciesIndexScreen />;
}
