import { beforeAll, expect, it } from 'vitest';

beforeAll(async () => {
  document.body.innerHTML = '<div class="library-shell"><button data-early-menu aria-expanded="false">m</button><aside class="library-sidenav"><button data-early-menu-close>x</button></aside><main><p id="out">o</p></main></div>';
  (await import('@/lib/early-tap-queue')).installEarlyTapQueue();
});
const shell = () => document.querySelector('.library-shell')!;

it('opens the side menu on the first tap before the page is interactive', () => {
  (document.querySelector('[data-early-menu]') as HTMLElement).click();
  expect(shell().classList.contains('library-mobile-open')).toBe(true);
});

it('closes the side menu from its close button before the page is interactive', () => {
  (document.querySelector('[data-early-menu-close]') as HTMLElement).click();
  expect(shell().classList.contains('library-mobile-open')).toBe(false);
});

it('closes the side menu when tapping outside it', () => {
  (document.querySelector('[data-early-menu]') as HTMLElement).click();
  (document.getElementById('out') as HTMLElement).click();
  expect(shell().classList.contains('library-mobile-open')).toBe(false);
});
