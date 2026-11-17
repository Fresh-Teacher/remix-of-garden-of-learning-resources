import { describe, expect, it } from 'vitest';
import { installEarlyTapQueue } from '@/lib/early-tap-queue';

installEarlyTapQueue();

describe('early tap script (before the page is interactive)', () => {
  it('shows a tapped dropdown at once and a second tap closes it', () => {
    document.body.innerHTML = '<div class="btn-group"><button data-toggle="dropdown">NOTES</button><ul class="dropdown-menu"></ul></div>';
    const button = document.querySelector('button')!;
    button.click();
    expect(button.parentElement!.hasAttribute('data-early-open')).toBe(true);
    button.click();
    expect(button.parentElement!.hasAttribute('data-early-open')).toBe(false);
  });

  it('switching menus leaves only the latest one open', () => {
    document.body.innerHTML = '<div><button data-toggle="dropdown">A</button></div><div><button data-toggle="dropdown">B</button></div>';
    const [a, b] = Array.from(document.querySelectorAll('button'));
    a!.click(); b!.click();
    expect(document.querySelectorAll('[data-early-open]').length).toBe(1);
    expect(b!.parentElement!.hasAttribute('data-early-open')).toBe(true);
  });

  it('closes an early dropdown on an outside tap', () => {
    document.body.innerHTML = '<div><button data-toggle="dropdown">A</button></div><p id="out">x</p>';
    document.querySelector('button')!.click();
    document.getElementById('out')!.click();
    expect(document.querySelector('[data-early-open]')).toBeNull();
  });

  it('closes an early dropdown on Escape and returns focus to its button', () => {
    document.body.innerHTML = '<div><button data-toggle="dropdown">A</button></div>';
    const button = document.querySelector('button')!;
    button.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.querySelector('[data-early-open]')).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it('closes an open class menu when tapping outside it', () => {
    document.body.innerHTML = '<details name="class-resources" data-native-dropdown open><summary>N</summary><a href="/x">x</a></details><p id="out">x</p>';
    const details = document.querySelector('details')!;
    details.querySelector('a')!.addEventListener('click', e => e.preventDefault());
    details.querySelector('a')!.click();
    expect(details.open).toBe(true);
    document.getElementById('out')!.click();
    expect(details.open).toBe(false);
  });

  it('opens the door on the first tap', () => {
    document.documentElement.removeAttribute('data-door-open');
    sessionStorage.clear();
    document.body.innerHTML = '<button class="rope">door</button>';
    document.querySelector<HTMLElement>('.rope')!.click();
    expect(document.documentElement.hasAttribute('data-door-open')).toBe(true);
    expect(sessionStorage.getItem('library-door-open')).toBe('1');
  });

  it('never intercepts real links', () => {
    document.body.innerHTML = '<a href="/notes.html">Notes</a>';
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    document.querySelector('a')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
