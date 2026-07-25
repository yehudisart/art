# Yehudis Jacobs — Art Site

Static single-page site. No build step, no dependencies — deploy the folder as-is.

```
index.html          the whole site (markup, styles, script)
404.html            not-found page
vercel.json         cache + security headers
favicon.svg         browser icon
apple-touch-icon.png
robots.txt
sitemap.xml
assets/img/         paintings (jpg + webp, full + -sm variants)
assets/video/       hero video + poster frame
tools/add-image.py  generates image variants for a new painting
```

---

## Before you go live

Three things need real values. All three live in one place — the `SITE` object at
the top of the `<script>` block in `index.html`:

```js
var SITE = {
  email:     'art@yehudis.com',
  instagram: 'https://www.instagram.com/yehudisart',
  facebook:  'https://www.facebook.com/yehudisart',
  instagramHandle: '@yehudisart',
  facebookName:    'Yehudis Art'
};
```

Change them there and every link on every page updates.

Then, if the domain is not `yehudis.art`, search `index.html` for that string and
replace it — it appears in the canonical URL, the Open Graph tags and the
structured data. Also update `sitemap.xml` and `robots.txt`.

---

## Deploy

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR-USER/yehudis-art.git
git push -u origin main
```

Then on vercel.com: **Import project → Framework preset: Other → Deploy.**
No build command, no output directory.

To preview locally:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Open it through a server, not by double-clicking the file — the `file://`
protocol breaks the absolute `/assets/...` paths.

---

## Adding a painting

**1. Generate the image variants.**

```bash
python3 tools/add-image.py ~/Desktop/new-painting.jpg bloom-ii
```

This writes four files into `assets/img/`: a full-size JPEG and WebP for the
lightbox, and 700px versions for the grid.

**2. Add it to `CATEGORIES`** in `index.html`:

```js
{
  id: 'light', label: 'Light', desc: 'Colour as radiance', cover: 'light',
  paintings: [
    { img: 'flower-garden', title: 'Flower Garden', medium: 'Oil & gold leaf on canvas' },
    { img: 'bloom-ii',      title: 'Bloom II',      medium: 'Oil on canvas' }   // new
  ]
}
```

`img` is the slug you passed to the script. Everything else — the gallery grid,
the lightbox, the painting count on the collection card, the home page card —
builds itself from this list.

To add a whole new collection, copy one of the three category blocks, give it a
new `id`, and set `cover` to the slug of the image you want on its card.

---

## How it is put together

**Everything is one file.** Markup, CSS and JavaScript all live in `index.html`.
That is deliberate for a site this size: one request, nothing to bundle.
Images and video are separate files so the browser can cache them independently
and load them lazily.

**Navigation uses the URL hash.** `#gallery`, `#gallery/story`, `#about-page`,
`#contact-page`. Deep links work, and so does the browser back button. Anything
unrecognised falls back to the home page.

**The hero shows a poster image first**, then swaps in the video once the page is
idle. The video is skipped entirely when the visitor has data-saver on, is on a
2G/3G connection, or has asked for reduced motion — in those cases the poster
stays, with a slow zoom that mimics the video.

**The contact form opens the visitor's mail app** with the message pre-filled.
There is no server. If you would rather receive submissions directly, a form
service like Formspree drops in with a few lines — replace the `mailto:` build
in the submit handler with a `fetch()` POST.

---

## Notes for later

- Image sources are modest resolution (424–894px on the long edge). They look
  right at current sizes, but if you ever want a full-screen zoom, re-export the
  originals larger and re-run `add-image.py`.
- The `story` collection's `Matan Torah` is the only image large enough for the
  `-sm` variant to differ meaningfully; the rest are already small.
- Interface text is English throughout, including the wall-colour picker in the
  lightbox. The original had a few Hebrew labels mixed in; they were translated
  for consistency. If the site should be Hebrew, that is a larger change —
  `dir="rtl"` on `<html>` plus mirrored padding.
