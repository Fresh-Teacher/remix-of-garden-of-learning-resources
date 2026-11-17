import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LibraryShell } from '@/components/library-shell';
import { offerInstall } from '@/lib/app-installation';
const routerMock = vi.hoisted(() => ({ navigate: vi.fn(), history: { back: vi.fn() } }));

const location = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => routerMock,
  useRouterState: ({ select }: { select: (state: { status: string }) => unknown }) => select({ status: 'idle' }),
  Link: ({ to, children, ...props }: { to: string; children?: unknown } & Record<string, unknown>) => <a href={to} {...props}>{children as never}</a>,
  useLocation: ({ select }: { select: (value: typeof location) => string }) => select(location),
}));

afterEach(() => { cleanup(); vi.restoreAllMocks(); location.pathname = '/'; offerInstall(null); localStorage.clear(); });

describe('Shared class navigation', () => {
  it('toggles the install card and dismisses it outside or with its close control', () => {
    render(<LibraryShell>Page content</LibraryShell>);
    const install = screen.getByRole('button', { name: 'Install the app' });
    fireEvent.click(install);
    expect(screen.getByRole('dialog', { name: 'Install the app' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close install card' }));
    expect(screen.queryByRole('dialog', { name: 'Install the app' })).not.toBeInTheDocument();
    fireEvent.click(install);
    fireEvent.click(screen.getByText('Page content'));
    expect(screen.queryByRole('dialog', { name: 'Install the app' })).not.toBeInTheDocument();
    fireEvent.click(install);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle class menu' }));
    expect(screen.queryByRole('dialog', { name: 'Install the app' })).not.toBeInTheDocument();
  });

  it('offers the app downloads from the app-bar card', () => {
    render(<LibraryShell>Page content</LibraryShell>);
    fireEvent.click(screen.getByRole('button', { name: 'Install the app' }));
    expect(screen.getByRole('button', { name: /download the fresh app apk/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get the Fresh App on Google Play' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get the Fresh App on the Apple App Store' })).toBeInTheDocument();
  });

  it('dismisses the phone drawer from its backdrop or close control', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
      matches: true, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }));
    render(<LibraryShell>Page content</LibraryShell>);
    const toggle = screen.getByRole('button', { name: 'Toggle class menu' });
    fireEvent.click(toggle);
    fireEvent.click(document.querySelector('.library-menu-backdrop') as HTMLElement);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    fireEvent.click(document.querySelector('.library-mobile-close') as HTMLElement);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('renders menu sections as native disclosures that share one group per level', () => {
    render(<LibraryShell>Page content</LibraryShell>);
    const nursery = screen.getByText('Nursery Section').closest('details');
    const primary = screen.getByText('Primary Section').closest('details');
    expect(nursery).not.toBeNull();
    expect(nursery?.getAttribute('name')).toBe(primary?.getAttribute('name'));
    expect(screen.getByText('Baby Class').closest('details')?.getAttribute('name')).not.toBe(nursery?.getAttribute('name'));
  });

  it('opens the branch for the current page on first load', () => {
    location.pathname = '/BabyAllLessonNotes.html';
    render(<LibraryShell>Page content</LibraryShell>);
    expect(screen.getByText('Nursery Section').closest('details')).toHaveAttribute('open');
    expect(screen.getByText('Primary Section').closest('details')).not.toHaveAttribute('open');
  });

  it('collapses and reopens the desktop class menu', () => {
    render(<LibraryShell>Page content</LibraryShell>);
    const toggle = screen.getByRole('button', { name: 'Toggle class menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the phone menu on Escape and returns focus to its toggle', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
      matches: true, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }));
    render(<LibraryShell>Page content</LibraryShell>);
    const toggle = screen.getByRole('button', { name: 'Toggle class menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('closes an open phone menu when the page changes', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
      matches: true, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    }));
    const view = render(<LibraryShell>Page one</LibraryShell>);
    const toggle = screen.getByRole('button', { name: 'Toggle class menu' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    location.pathname = '/PrimaryFiveEnglishLessonNotes.html';
    view.rerender(<LibraryShell>Page two</LibraryShell>);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
describe('In-app page links', () => {
  it('routes captured page links without reloading and maps /index.html to home', () => {
    routerMock.navigate.mockClear();
    render(<LibraryShell><a href="/p1.html">P1</a><a href="/index.html">Home page</a></LibraryShell>);
    expect(fireEvent.click(screen.getByText('P1'))).toBe(false);
    expect(routerMock.navigate).toHaveBeenLastCalledWith({ href: '/p1.html' });
    fireEvent.click(screen.getByText('Home page'));
    expect(routerMock.navigate).toHaveBeenLastCalledWith({ href: '/' });
  });
  it('sends Return links back through app history when there is any', () => {
    routerMock.history.back.mockClear(); routerMock.navigate.mockClear();
    window.history.replaceState({ __TSR_index: 2 }, '');
    render(<LibraryShell><a href="/index.html">Return to Homepage</a></LibraryShell>);
    fireEvent.click(screen.getByText('Return to Homepage'));
    expect(routerMock.history.back).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).not.toHaveBeenCalled();
    window.history.replaceState(null, '');
  });
});
