import { CatalogPage } from '@/components/catalog-page';
import type { ResourcePageData } from '@/lib/resources';

export function ResourcePage({ data }: { data: ResourcePageData }) {
  return <CatalogPage items={data.items} />;
}