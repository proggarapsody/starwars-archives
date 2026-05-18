import { VehiclesIndexScreen } from '@/screens/codex/vehicles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vehicles',
  description:
    'Sub-orbital and ground transports of the Star Wars Archives, from speeders to walkers.',
};

export default function VehiclesPage() {
  return <VehiclesIndexScreen />;
}
