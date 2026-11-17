import { describe, expect, it } from 'vitest';
import { staticThumbnailUrl } from '@/lib/static-thumbs';

describe('staticThumbnailUrl', () => {
  it('maps raw.githubusercontent.com PDFs into the repo .thumbs folder', () => {
    expect(staticThumbnailUrl('https://raw.githubusercontent.com/Fresh-Teacher/p7-past-papers/main/exams/P7-MTC.pdf'))
      .toBe('https://raw.githubusercontent.com/Fresh-Teacher/p7-past-papers/main/.thumbs/exams/P7-MTC.pdf.webp');
  });

  it('maps github.io PDFs into the repo .thumbs folder and keeps encoding', () => {
    expect(staticThumbnailUrl('https://fresh-teacher.github.io/p5/PRIME%20P5%20EOY%203%20MTC.pdf'))
      .toBe('https://fresh-teacher.github.io/p5/.thumbs/PRIME%20P5%20EOY%203%20MTC.pdf.webp');
  });

  it('encodes unescaped spaces in github.io paths', () => {
    expect(staticThumbnailUrl('https://fresh-teacher.github.io/p5/PRIME P5 MTC.pdf'))
      .toBe('https://fresh-teacher.github.io/p5/.thumbs/PRIME%20P5%20MTC.pdf.webp');
  });

  it('returns null for non-PDF documents', () => {
    expect(staticThumbnailUrl('https://fresh-teacher.github.io/p5/notes.docx')).toBeNull();
  });

  it('returns null for hosts outside the document repositories', () => {
    expect(staticThumbnailUrl('https://example.com/exams/paper.pdf')).toBeNull();
  });

  it('returns null for invalid URLs', () => {
    expect(staticThumbnailUrl('not a url')).toBeNull();
  });
});
