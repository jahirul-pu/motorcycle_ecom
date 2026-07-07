import { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

export const metadata: Metadata = {
  title: 'Search Products | MotoHub',
  description:
    'Search and filter the best selection of motorcycle parts, gears, and riding accessories at MotoHub.',
  openGraph: {
    title: 'Search Products | MotoHub',
    description: 'Find compatible motorcycle parts and riding gear with custom filter controls.',
    type: 'website',
  },
};

export default function SearchPage() {
  return <SearchPageClient />;
}
