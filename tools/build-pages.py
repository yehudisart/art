#!/usr/bin/env python3
"""
Generate every real, separately-crawlable page of the site from one
master template.

WHY THIS EXISTS
----------------
The site used to be a true single-page app: every view (Home, Gallery,
About, Contact, the legal pages) lived in index.html as a hidden <div>,
shown or hidden by JavaScript. That caused two problems:

  1. SEO: /gallery, /about and /contact were all served the exact same
     HTML, so Google had no static signal that they were distinct pages —
     which is what blocks sitelinks.
  2. Every single page's source contained the *entire* site's markup,
     just with five-sixths of it sitting there hidden.

This script solves both: `tools/template.html` is the one file you ever
edit — it still contains all the markup, styles and behaviour for every
page. Running this script reads that template and writes out six real,
separate HTML files, each containing ONLY that page's own content in
<main> (plus the shared header/nav/footer chrome and the site's script,
which every page needs regardless). Nothing is hidden by CSS anymore —
if a page's markup isn't in that file, it's because that file doesn't
need it.

USAGE
-----
Edit tools/template.html (never the generated files directly), then:

    python3 tools/build-pages.py

This overwrites index.html, gallery.html, about.html, contact.html,
privacy.html and accessibility.html at the project root. Commit all of
them together.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "tools" / "template.html"
ORIGIN = "https://yehudisjacobs.com"

PAGES = {
    "index.html": {
        "path": "/",
        "keep_divs": ["home"],
        "seo": None,  # keep whatever is already in the template's <head>
    },
    "gallery.html": {
        "path": "/gallery",
        "keep_divs": ["gallery", "painting-page"],
        "seo": {
            "title": "Gallery | Yehudis Jacobs Fine Art",
            "description": (
                "Browse original paintings by Yehudis Jacobs across three collections "
                "\u2014 Soul, Light and Story. Oil, gold leaf and poured pigment on canvas."
            ),
            "og_image": "/assets/img/birds-of-paradise.jpg",
            "og_image_alt": "Birds of Paradise, an oil painting by Yehudis Jacobs",
        },
    },
    "about.html": {
        "path": "/about",
        "keep_divs": ["about-page"],
        "seo": {
            "title": "About the Artist | Yehudis Jacobs",
            "description": (
                "Yehudis Jacobs is a painter and art therapist working in Jerusalem, "
                "trained at the Bezalel Academy of Arts and Design. Read about her work "
                "and approach."
            ),
            "og_image": "/assets/img/eyes-of-the-nation.jpg",
            "og_image_alt": "Eyes of the Nation, an oil painting by Yehudis Jacobs",
        },
    },
    "contact.html": {
        "path": "/contact",
        "keep_divs": ["contact-page"],
        "seo": {
            "title": "Contact | Yehudis Jacobs Fine Art",
            "description": (
                "Enquire about original paintings, commissions or availability. "
                "Get in touch with Jerusalem-based artist Yehudis Jacobs."
            ),
            "og_image": "/assets/img/flowers-ii.jpg",
            "og_image_alt": "Flowers of Paradise, an oil painting by Yehudis Jacobs",
        },
    },
    "privacy.html": {
        "path": "/privacy",
        "keep_divs": ["privacy-page"],
        "seo": {
            "title": "Privacy Policy | Yehudis Jacobs",
            "description": "Privacy policy for yehudisjacobs.com.",
            "og_image": "/assets/img/hero.jpg",
            "og_image_alt": "Detail of an oil and gold-leaf painting by Yehudis Jacobs",
        },
    },
    "accessibility.html": {
        "path": "/accessibility",
        "keep_divs": ["accessibility-page"],
        "seo": {
            "title": "Accessibility Statement | Yehudis Jacobs",
            "description": "Accessibility statement for yehudisjacobs.com.",
            "og_image": "/assets/img/hero.jpg",
            "og_image_alt": "Detail of an oil and gold-leaf painting by Yehudis Jacobs",
        },
    },
}


def replace_once(html, pattern, replacement, label, filename):
    new, n = re.subn(pattern, lambda _m: replacement, html, count=1)
    if n != 1:
        sys.exit(f"ERROR [{filename}]: expected 1 match for {label}, found {n}. "
                  f"tools/template.html's <head> changed shape; update this script.")
    return new


def extract_div(html, start_idx):
    """Given the index of a div's opening '<div', return (start, end) so
    that html[start:end] is that div's complete, balanced contents —
    correctly skipping over every div nested inside it.
    """
    tag_re = re.compile(r"<div\b|</div>")
    depth = 0
    pos = start_idx
    while True:
        m = tag_re.search(html, pos)
        if not m:
            raise ValueError(f"Unbalanced <div> nesting starting at index {start_idx}")
        depth += 1 if m.group() == "<div" else -1
        pos = m.end()
        if depth == 0:
            return start_idx, pos


def extract_all_page_divs(html, filename):
    try:
        main_start = html.index('<main id="main">') + len('<main id="main">')
        main_end = html.index("</main>")
    except ValueError:
        sys.exit(f"ERROR: couldn't find <main id=\"main\">...</main> in {filename}")

    divs = {}
    for m in re.finditer(r'<div id="([a-z-]+)" class="page[^"]*">', html[main_start:main_end]):
        div_id = m.group(1)
        abs_start = main_start + m.start()
        s, e = extract_div(html, abs_start)
        divs[div_id] = html[s:e]
    return divs, main_start, main_end


def apply_seo(html, seo, path, filename):
    url = ORIGIN + path
    img = ORIGIN + seo["og_image"]
    desc = seo["description"]
    title = seo["title"]

    html = replace_once(html, r"<title>.*?</title>", f"<title>{title}</title>", "<title>", filename)
    html = replace_once(html, r'<meta name="description" content="[^"]*">',
                         f'<meta name="description" content="{desc}">', "meta description", filename)
    html = replace_once(html, r'<link rel="canonical" href="[^"]*">',
                         f'<link rel="canonical" href="{url}">', "canonical", filename)
    html = replace_once(html, r'<meta property="og:title" content="[^"]*">',
                         f'<meta property="og:title" content="{title}">', "og:title", filename)
    html = replace_once(html, r'<meta property="og:description" content="[^"]*">',
                         f'<meta property="og:description" content="{desc}">', "og:description", filename)
    html = replace_once(html, r'<meta property="og:url" content="[^"]*">',
                         f'<meta property="og:url" content="{url}">', "og:url", filename)
    html = replace_once(html, r'<meta property="og:image" content="[^"]*">',
                         f'<meta property="og:image" content="{img}">', "og:image", filename)
    html = replace_once(html, r'<meta property="og:image:alt" content="[^"]*">',
                         f'<meta property="og:image:alt" content="{seo["og_image_alt"]}">',
                         "og:image:alt", filename)
    html = replace_once(html, r'<meta name="twitter:title" content="[^"]*">',
                         f'<meta name="twitter:title" content="{title}">', "twitter:title", filename)
    html = replace_once(html, r'<meta name="twitter:description" content="[^"]*">',
                         f'<meta name="twitter:description" content="{desc}">',
                         "twitter:description", filename)
    html = replace_once(html, r'<meta name="twitter:image" content="[^"]*">',
                         f'<meta name="twitter:image" content="{img}">', "twitter:image", filename)
    html = replace_once(html, r'<meta property="og:type" content="[^"]*">',
                         '<meta property="og:type" content="article">', "og:type", filename)

    html = re.sub(r'\n<link rel="preload" as="image" href="/assets/img/hero\.webp"[^>]*>',
                   "", html, count=1)

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
    return html


def build(filename, cfg, template_html):
    html = template_html

    if cfg["seo"]:
        html = apply_seo(html, cfg["seo"], cfg["path"], filename)

    divs, main_start, main_end = extract_all_page_divs(html, filename)

    missing = [d for d in cfg["keep_divs"] if d not in divs]
    if missing:
        sys.exit(f"ERROR [{filename}]: expected page div(s) {missing} not found in template.")

    kept_html = "\n\n".join(divs[d] for d in cfg["keep_divs"] if d in divs)
    html = html[:main_start] + "\n\n" + kept_html + "\n\n" + html[main_end:]

    (ROOT / filename).write_text(html, encoding="utf-8")
    label = cfg["seo"]["title"] if cfg["seo"] else "(homepage — unchanged SEO)"
    print(f"  wrote {filename:<20} {cfg['path']:<14} {label}")


def main():
    if not TEMPLATE.exists():
        sys.exit(f"ERROR: {TEMPLATE} not found. That file is the one source of truth — "
                  f"edit it, not the generated pages.")
    template_html = TEMPLATE.read_text(encoding="utf-8")
    print("Generating every page from tools/template.html:")
    for filename, cfg in PAGES.items():
        build(filename, cfg, template_html)
    print("Done.")


if __name__ == "__main__":
    main()
