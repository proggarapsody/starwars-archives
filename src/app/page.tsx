import { site } from '@/config/site';
import { HomeScreen } from '@/screens/home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: site.description,
};

export default function HomePage() {
  return <HomeScreen />;
}
