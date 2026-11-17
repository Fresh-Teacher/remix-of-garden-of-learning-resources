// Maps a document URL to the pre-generated WebP thumbnail that the
// repository GitHub Action stores under a `.thumbs/` folder next to the
// PDFs. Returns null for hosts we cannot map, so callers fall back to the
// client-side pdf.js renderer.

function encodePath(path: string) {
  // URL.pathname is already percent-encoded; decode first so segments are
  // encoded exactly once.
  return path.split('/').map(segment => encodeURIComponent(decodeURIComponent(segment))).join('/');
}

export function staticThumbnailUrl(pdfUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(pdfUrl);
  } catch {
    return null;
  }
  const path = url.pathname;
  if (!/\.pdf$/i.test(path)) return null;

  // raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>.pdf
  if (url.hostname === 'raw.githubusercontent.com') {
    const parts = path.split('/').filter(Boolean);
    if (parts.length < 4) return null;
    const [owner, repo, branch, ...rest] = parts;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/.thumbs/${encodePath(rest.join('/'))}.webp`;
  }

  // <owner>.github.io/<repo>/<path>.pdf
  if (url.hostname.endsWith('.github.io')) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    const [repo, ...rest] = parts;
    return `https://${url.hostname}/${repo}/.thumbs/${encodePath(rest.join('/'))}.webp`;
  }

  return null;
}
