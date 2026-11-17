import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Index } from '@/routes/index';
import { installEarlyTapQueue } from '@/lib/early-tap-queue';

installEarlyTapQueue();

afterEach(() => { cleanup(); sessionStorage.clear(); document.documentElement.removeAttribute('data-door-open'); vi.restoreAllMocks(); });

function mountDoor() {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const { container } = render(<Index />);
  return { door: container.querySelector<HTMLElement>('.rope')!, shelves: container.querySelector('.page-wrapper')! };
}

describe('Homepage door (vanilla, no React state)', () => {
  it('opens on the first tap, plays the sound once and remembers it', () => {
    const { door } = mountDoor();
    door.click();
    door.click();
    expect(document.documentElement.hasAttribute('data-door-open')).toBe(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem('library-door-open')).toBe('1');
  });

  it('never locks the shelves', () => {
    const { shelves } = mountDoor();
    expect(shelves.hasAttribute('inert')).toBe(false);
  });
});
