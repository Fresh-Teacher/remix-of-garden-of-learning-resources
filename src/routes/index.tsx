import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { homepageShelves, homepageClassNames } from '@/data/homepage-shelves';
import repairCSS from '../styles/import-repairs.css?raw';
import capturedCssUrl from '../styles/captured.css?url';

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Fresh Teacher's Library" },
    { name: "description", content: "Fresh Teacher's e-library of lesson notes, past papers and schemes of work for Ugandan schools." },
    { property: "og:title", content: "Fresh Teacher's Library" },
    { property: "og:description", content: "Explore nursery, primary and secondary school learning resources from Fresh Teacher." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "stylesheet", href: capturedCssUrl }] }),
  component: Index,
});

export function Index() {
  // The door is opened by the inline page script and CSS alone; React holds no door state.
  const doorProps = { variant: 'source' as const, size: 'source' as const, 'aria-label': 'Open library' };
  return <div className="library-homepage">
    <style>{repairCSS}</style>
    <Button {...doorProps} className="leftcurtain">
      <img src="/__l5e/assets-v1/6e8eadae-fabf-419f-874b-e65fa3b22797/7c2eea45ca9862de.webp" alt="" fetchPriority="high" decoding="async" />
    </Button>
    <Button {...doorProps} className="rightcurtain">
      <img src="/__l5e/assets-v1/215f2d5e-fedb-4a8d-88ac-0c2cb7b58d70/d52f1d3e4b7ea8ab.webp" alt="" fetchPriority="high" decoding="async" />
    </Button>
    <Button {...doorProps} className="rope">
      <b className="door-instruction">Tap on the door to enter</b>
      <img className="door-arrow" src="/__l5e/assets-v1/22b55e29-b898-4333-8329-4d0176086f47/243d7d09dd033233.webp" alt="" width="70" fetchPriority="high" decoding="async" />
    </Button>
    <div className="container">
      <p className="homepage-instruction">Choose one class from the shelf to continue.</p>
      <div className="page-wrapper">
        {homepageShelves.map((shelf, shelfIndex) => <span className="shelf-row" key={shelfIndex}>
          <div className="bookshelf">
            <div className="covers">
              {shelf.map(([href, src]) => <div className="thumb book-1" key={href}>
                <a href={href} aria-label={`Open ${homepageClassNames[href ?? '']} resources`}>
                  <img src={src} alt={homepageClassNames[href ?? '']} width="1654" height="2339" loading="lazy" decoding="async" />
                </a>
              </div>)}
            </div>
            <img className="shelf-img" src="/__l5e/assets-v1/fee89318-130d-45f1-afa7-2c7feb29cf16/36bc42cbc31e7907.webp" alt="" width="1000" height="96" decoding="async" />
          </div>
        </span>)}
      </div>
      <audio id="audiocracker" src="/__l5e/assets-v1/0bb89145-e28e-46dd-8335-e61685b09aeb/door.mp3" preload="auto" suppressHydrationWarning />
    </div>
  </div>;
}
