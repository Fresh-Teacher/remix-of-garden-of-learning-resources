import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DocumentGallery } from '@/components/document-gallery';

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/PrimaryFiveClassPastPapers.html' }),
  Link: ({ children, params }: { children: React.ReactNode; params: { slug: string } }) => <a href={`/doc/${params.slug}`}>{children}</a>,
}));
const thumbnails = vi.hoisted(() => ({ load: vi.fn(async (): Promise<string | null> => null) }));
vi.mock('@/lib/pdf-thumbs', () => ({ pdfThumbnail: thumbnails.load, pdfPageCount: () => undefined, preloadPdfJs: () => undefined }));
vi.mock('@/lib/file-sizes', () => ({ fileSize: async () => null, formatSize: () => '' }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); thumbnails.load.mockReset(); });

it('opens catalog PDFs through the original overlay callback but keeps Word viewing on its dedicated page', async () => {
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
  const pdf = { pdfUrl: 'https://fresh-teacher.github.io/lesson.pdf', description: '', price: 5000 };
  const word = { ...pdf, pdfUrl: 'https://fresh-teacher.github.io/lesson.docx' };
  const onView = vi.fn();
  await act(async () => { render(<DocumentGallery items={[pdf, word]} onView={onView} />); });
  const view = screen.getByRole('button', { name: /^View$/ });
  fireEvent.click(view);
  expect(onView).toHaveBeenCalledWith(view, pdf);
  expect(screen.getByRole('link', { name: /^View$/ }).getAttribute('href')).toMatch(/^\/doc\//);
  expect(onView).toHaveBeenCalledTimes(1);
});


it('loads a PDF thumbnail only after the card stays on screen briefly', async () => {
  vi.useFakeTimers();
  let fire: (visible: boolean) => void = () => {};
  vi.stubGlobal('IntersectionObserver', class { constructor(cb: (e: unknown[]) => void) { fire = v => cb([{ isIntersecting: v, target: document.querySelector('.dg-thumb') }]); } observe() {} unobserve() {} disconnect() {} });
  await act(async () => { render(<DocumentGallery items={[{ pdfUrl: 'https://fresh-teacher.github.io/lesson.pdf', description: '', price: 5000 }]} />); });
  fire(true); fire(false);
  await act(async () => { vi.advanceTimersByTime(500); });
  expect(thumbnails.load).not.toHaveBeenCalled();
  fire(true);
  await act(async () => { vi.advanceTimersByTime(400); });
  expect(thumbnails.load).toHaveBeenCalledTimes(1);
});

it('shows instant format badges for PDF cards without loading PDF thumbnails or spinners', async () => {
  await act(async () => { render(<DocumentGallery items={[{ pdfUrl: 'https://fresh-teacher.github.io/lesson.pdf', description: '', price: 5000 }]} />); });
  expect(thumbnails.load).not.toHaveBeenCalled();
  expect(screen.queryByRole('status', { name: 'Loading document thumbnail…' })).toBeNull();
  expect(screen.getByText('PDF')).toBeTruthy();
});

it('never starts PDF thumbnail work or its spinner for Office files', async () => {
  await act(async () => { render(<DocumentGallery items={['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].map(extension => ({ pdfUrl: `https://fresh-teacher.github.io/lesson.${extension}`, description: '', price: 5000 }))} />); });
  expect(thumbnails.load).not.toHaveBeenCalled();
  expect(screen.queryByRole('status', { name: 'Loading document thumbnail…' })).toBeNull();
});

