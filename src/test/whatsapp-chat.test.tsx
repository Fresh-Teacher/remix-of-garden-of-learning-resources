import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WhatsAppChat } from '@/components/whatsapp-chat';
import { installEarlyTapQueue } from '@/lib/early-tap-queue';

installEarlyTapQueue();
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function openChat() {
  const { container } = render(<WhatsAppChat />);
  const chat = container.querySelector('details');
  if (!chat) throw new Error('Missing chat disclosure');
  fireEvent.click(screen.getByLabelText('Show Chat'));
  chat.open = true;
  return chat;
}

describe('Native WhatsApp actions', () => {
  it('mounts and opens without scheduling React timers', () => {
    const timers = vi.spyOn(window, 'setTimeout');
    openChat();
    expect(timers.mock.calls.filter(([, delay]) => Number(delay) > 0)).toHaveLength(0);
  });

  it('closes the chat and restores keyboard focus', () => {
    const chat = openChat();
    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(chat.open).toBe(false);
    expect(document.activeElement).toBe(screen.getByLabelText('Show Chat'));
  });

  it('opens encryption information and Escape dismisses it before closing chat', () => {
    const chat = openChat();
    fireEvent.click(chat.querySelector('[data-chat-info-open]') ?? chat);
    const info = screen.getByRole('dialog', { name: 'About end-to-end encryption' });
    expect(info.hidden).toBe(false);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(info.hidden).toBe(true);
    expect(chat.open).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(chat.open).toBe(false);
  });

  it('blocks empty sends and encodes the actual message for the existing WhatsApp number', () => {
    openChat();
    const send = screen.getByLabelText('Send message on WhatsApp');
    expect(fireEvent.click(send)).toBe(false);
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'P5 notes & exams?' } });
    send.addEventListener('click', event => event.preventDefault(), { once: true });
    fireEvent.click(send);
    expect(send.getAttribute('href')).toBe('https://web.whatsapp.com/send?phone=+256750687790&text=P5%20notes%20%26%20exams%3F');
  });
});