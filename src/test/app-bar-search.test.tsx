import { act, cleanup, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { AppBar } from '@/components/navigation/app-bar';

const mocks = vi.hoisted(() => ({ preload: vi.fn(() => Promise.resolve([])) }));
vi.mock('@/lib/library-search', () => ({ preloadLibrarySearch: mocks.preload }));
vi.mock('@/components/navigation/quick-search', () => ({ QuickSearch: () => null }));
vi.mock('@/components/navigation/install-card', () => ({ InstallCard: () => null }));
vi.mock('@tanstack/react-router', () => ({ Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a> }));

afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals(); Reflect.deleteProperty(navigator, 'connection'); });

function renderAppBar() {
  return render(<AppBar triggerRef={createRef<HTMLButtonElement>()} menuExpanded installOpen={false} onToggleMenu={vi.fn()} onToggleInstall={vi.fn()} onCloseInstall={vi.fn()} />);
}

it('does not download the search index in the background on page load', () => {
  const request = vi.fn();
  vi.stubGlobal('requestIdleCallback', request);
  vi.useFakeTimers();
  renderAppBar();
  vi.advanceTimersByTime(10000);
  expect(request).not.toHaveBeenCalled();
  expect(mocks.preload).not.toHaveBeenCalled();
  vi.useRealTimers();
});

it('does not download the idle index when the user requests reduced data', () => {
  const request = vi.fn();
  vi.stubGlobal('requestIdleCallback', request);
  Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
  renderAppBar();
  expect(request).not.toHaveBeenCalled();
  expect(mocks.preload).not.toHaveBeenCalled();
  Reflect.deleteProperty(navigator, 'connection');
});
