import { useDeferredValue, useMemo, useState } from 'react';
import { DocumentGallery } from '@/components/document-gallery';
import { DocumentSearchInput } from '@/components/document-search-input';
import { filterResources, type ResourceRecord } from '@/lib/resources';
import styles from '@/styles/document-gallery.css?raw';

// Catalogs use a small SSR layout, not a parsed copy of the legacy HTML shell.
export function CatalogPage({ items, missingData, infinite = false }: { items: ResourceRecord[]; missingData?: string | null; infinite?: boolean }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [viewerError, setViewerError] = useState('');
  const filtered = useMemo(() => filterResources(items, deferredQuery), [items, deferredQuery]);
  const view = async (element: HTMLElement, item: ResourceRecord) => {
    try {
      setViewerError('');
      const { openResourceViewer } = await import('@/lib/resource-viewer');
      await openResourceViewer(element, item, infinite);
    } catch {
      void import('@/lib/viewer-loading').then(module => module.hideViewerLoading());
      setViewerError('The file viewer could not load. You can still download the file.');
    }
  };
  return <section className="catalog-page">
    <style>{styles}</style>
    <DocumentSearchInput query={query} onChange={setQuery} items={items} />
    {missingData ? <p role="status">This page’s original file list is currently unavailable.</p> :
      <DocumentGallery items={filtered} sourceItems={items} query={deferredQuery} onQueryChange={setQuery} onClear={() => setQuery('')} onView={(element, item) => void view(element, item)} />}
    {viewerError && <p role="alert">{viewerError}</p>}
  </section>;
}