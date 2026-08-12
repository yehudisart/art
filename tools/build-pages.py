#!/usr/bin/env python3
"""
Generate real, separately-crawlable HTML files for the sub-pages.

The site is a single-page app: every view lives inside index.html and is
shown or hidden by JavaScript. That is fine for visitors, but it meant
/gallery, /about and /contact were all served the *same* HTML — identical
<title>, identical description, and a canonical pointing at the homepage.
Google therefore had no static signal that they were distinct pages, which
is what blocks sitelinks.

This script writes one physical file per sub-page. Each is byte-identical
to index.html except for its <head> SEO block, so there is exactly one
source of truth for markup, styles and behaviour: index.html. Vercel's
`cleanUrls` maps /gallery -> gallery.html automatically, so no rewrites
are needed.

Re-run this after ANY edit to index.html:

    python3 tools/build-pages.py

Nothing else in the project needs to change.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"
ORIGIN = "https://yehudisjacobs.com"

# Per-page SEO. The homepage keeps whatever is already in index.html; the
# others are generated from these.
PAGES = {
    "gallery.html": {
        "path": "/gallery",
        "title": "Gallery | Yehudis Jacobs Fine Art",
        "description": (
            "Browse original paintings by Yehudis Jacobs across three collections "
            "\u2014 Soul, Light and Story. Oil, gold leaf and poured pigment on canvas."
        ),
        "og_image": "/assets/img/birds-of-paradise.jpg",
        "og_image_alt": "Birds of Paradise, an oil painting by Yehudis Jacobs",
    },
    "about.html": {
        "path": "/about",
        "title": "About the Artist | Yehudis Jacobs",
        "description": (
            "Yehudis Jacobs is a painter and art therapist working in Jerusalem, "
            "trained at the Bezalel Academy of Arts and Design. Read about her work "
            "and approach."
        ),
        "og_image": "/assets/img/eyes-of-the-nation.jpg",
        "og_image_alt": "Eyes of the Nation, an oil painting by Yehudis Jacobs",
    },
    "contact.html": {
        "path": "/contact",
        "title": "Contact | Yehudis Jacobs Fine Art",
        "description": (
            "Enquire about original paintings, commissions or availability. "
            "Get in touch with Jerusalem-based artist Yehudis Jacobs."
        ),
        "og_image": "/assets/img/flowers-ii.jpg",
        "og_image_alt": "Flowers of Paradise, an oil painting by Yehudis Jacobs",
    },
}


def replace_once(html, pattern, replacement, label, filename):
    """Substitute exactly one match, or fail loudly.

    A silent no-op here would ship a page carrying the homepage's metadata,
    which is the precise bug this script exists to fix — so a miss must be
    an error, not a warning.
    """
    new, n = re.subn(pattern, lambda _m: replacement, html, count=1)
    if n != 1:
        sys.exit(f"ERROR [{filename}]: expected 1 match for {label}, found {n}. "
                 f"index.html's <head> changed shape; update tools/build-pages.py.")
    return new


def build(filename, cfg, src_html):
    html = src_html
    url = ORIGIN + cfg["path"]
    img = ORIGIN + cfg["og_image"]
    desc = cfg["description"]
    title = cfg["title"]

    html = replace_once(html, r"<title>.*?</title>",
                        f"<title>{title}</title>", "<title>", filename)

    html = replace_once(html, r'<meta name="description" content="[^"]*">',
                        f'<meta name="description" content="{desc}">',
                        "meta description", filename)

    html = replace_once(html, r'<link rel="canonical" href="[^"]*">',
                        f'<link rel="canonical" href="{url}">',
                        "canonical", filename)

    html = replace_once(html, r'<meta property="og:title" content="[^"]*">',
                        f'<meta property="og:title" content="{title}">',
                        "og:title", filename)

    html = replace_once(html, r'<meta property="og:description" content="[^"]*">',
                        f'<meta property="og:description" content="{desc}">',
                        "og:description", filename)

    html = replace_once(html, r'<meta property="og:url" content="[^"]*">',
                        f'<meta property="og:url" content="{url}">',
                        "og:url", filename)

    html = replace_once(html, r'<meta property="og:image" content="[^"]*">',
                        f'<meta property="og:image" content="{img}">',
                        "og:image", filename)

    html = replace_once(html, r'<meta property="og:image:alt" content="[^"]*">',
                        f'<meta property="og:image:alt" content="{cfg["og_image_alt"]}">',
                        "og:image:alt", filename)

    html = replace_once(html, r'<meta name="twitter:title" content="[^"]*">',
                        f'<meta name="twitter:title" content="{title}">',
                        "twitter:title", filename)

    html = replace_once(html, r'<meta name="twitter:description" content="[^"]*">',
                        f'<meta name="twitter:description" content="{desc}">',
                        "twitter:description", filename)

    html = replace_once(html, r'<meta name="twitter:image" content="[^"]*">',
                        f'<meta name="twitter:image" content="{img}">',
                        "twitter:image", filename)

    # og:type is "website" on the homepage; sub-pages are ordinary pages.
    html = replace_once(html, r'<meta property="og:type" content="[^"]*">',
                        '<meta property="og:type" content="article">',
                        "og:type", filename)

    # Preloading the hero image only helps the homepage, which is the only
    # page that shows it above the fold. Elsewhere it is wasted bandwidth
    # competing with the image the visitor actually came to see.
    html = re.sub(
        r'\n<link rel="preload" as="image" href="/assets/img/hero\.webp"[^>]*>', "",
        html, count=1)

    # A breadcrumb tells Google how the page sits under the homepage, which
    # is one of the signals it uses to assemble sitelinks.
    crumb = f'''
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "{ORIGIN}/" }},
    {{ "@type": "ListItem", "position": 2, "name": "{title.split(' | ')[0]}", "item": "{url}" }}
  ]
}}
</script>
'''
    html = replace_once(html, r"</head>", crumb + "</head>", "</head>", filename)

    (ROOT / filename).write_text(html, encoding="utf-8")
    print(f"  wrote {filename:<16} {cfg['path']:<10} {title}")


def main():
    if not SRC.exists():
        sys.exit("ERROR: index.html not found.")
    src_html = SRC.read_text(encoding="utf-8")
    print("Generating sub-pages from index.html:")
    for filename, cfg in PAGES.items():
        build(filename, cfg, src_html)
    print("Done. Homepage (index.html) was not modified.")


if __name__ == "__main__":
    main()
