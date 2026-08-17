# Yehudis Jacobs — Art Site

Six real, separate static pages. No framework, no build tooling beyond one
small Python script — deploy the folder as-is.

```
tools/template.html   the ONE file you edit — every page's markup, styles
                       and script, all in one place (not deployed itself)
tools/build-pages.py  generates the six real pages below from the template
index.html            Home            (generated — do not edit directly)
gallery.html          Gallery         (generated — do not edit directly)
about.html            About           (generated — do not edit directly)
contact.html          Contact         (generated — do not edit directly)
privacy.html          Privacy Policy  (generated — do not edit directly)
accessibility.html    Accessibility Statement (generated)
404.html             not-found page
vercel.json           cache + security headers
apple-touch-icon.png
robots.txt
sitemap.xml
assets/img/favicon.png   browser icon (also apple-touch-icon.png above)
assets/img/         paintings (jpg + webp, full + -sm variants)
assets/video/       hero video + poster frame
tools/add-image.py  generates image variants for a new painting
```

**Each generated page contains only its own content** — gallery.html has
Gallery's markup and nothing else; about.html has only About's, and so on.
Nothing is hidden with CSS. That's what makes each one a genuinely distinct
page to Google (necessary for sitelinks) instead of one page served six
times with five-sixths of it hidden.

---

## Making a change

1. Edit **`tools/template.html`** — never the six generated pages directly;
   they get overwritten every time the build script runs.
2. Run:
   ```bash
   python3 tools/build-pages.py
   ```
3. Commit the template *and* all six generated HTML files together.

---

## Before you go live

Contact details live in one place — the `SITE` object near the top of the
`<script>` block in `tools/template.html`:

```js
var SITE = {
  email: 'yehudisart@gmail.com',
  formEndpoint: '/api/contact',
  whatsapp: '972587706991',        // digits only, international form
  whatsappDisplay: '058-770-6991', // shown on screen
  phone: '+972587706991',
  phoneDisplay: '058-770-6991',
  whatsappText: 'Hello, I have a question about your work.'
};
```

Change any of these, then run `python3 tools/build-pages.py` — every link on
every page updates.

If the domain is not `yehudisjacobs.com`, search `tools/template.html` for
that string and replace it — it appears in the canonical URL, the Open Graph
tags and the structured data — then rebuild. Also update `sitemap.xml` and
`robots.txt`.

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

## Making the contact forms actually send email

Both forms (Contact page, and "Send" on a painting page) post to
`api/contact.js`, a serverless function that runs on Vercel. It relays each
message to **yehudisart@gmail.com** using [Resend](https://resend.com) — a
transactional email API. The visitor never leaves the site and no mail app
opens; they see a confirmation on the page instead.

**One thing must be set up before this works — it will not send without it:**

1. Go to **resend.com** and sign up free using **yehudisart@gmail.com** as
   the account email. (Free tier: 3,000 emails/month — far more than this
   site will ever need.)
2. In the Resend dashboard, open **API Keys → Create API Key**. Copy it.
3. In the **Vercel** project: **Settings → Environment Variables** →
   add a variable named exactly `RESEND_API_KEY`, paste the key as its
   value, and save.
4. Redeploy the project (Vercel → Deployments → ⋯ → Redeploy). Environment
   variables only take effect on the next deploy.
5. Send yourself a test message through the site to confirm it arrives.

No DNS changes and no domain verification are needed: because the account
was created with yehudisart@gmail.com, Resend allows sending to that same
address out of the box. If a different destination address is ever wanted,
Resend will require verifying a sending domain first.

The API key lives only in Vercel's environment variables — it is never
present in any file in this repository and never reaches the browser.

---

## Adding a painting

**1. Generate the image variants.**

```bash
python3 tools/add-image.py ~/Desktop/new-painting.jpg bloom-ii
```

This writes four files into `assets/img/`: a full-size JPEG and WebP for the
lightbox, and 700px versions for the grid.

**2. Add it to `CATEGORIES`** in `tools/template.html`, then run `python3 tools/build-pages.py`:

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

**One template, six real pages.** Markup, CSS and JavaScript for the whole
site live in `tools/template.html`. `tools/build-pages.py` splits that into
six separate files — `index.html`, `gallery.html`, `about.html`,
`contact.html`, `privacy.html`, `accessibility.html` — each containing only
its own page's content, plus the shared header/nav/footer and the site's
script (identical across all six, since every page needs it). Nothing is
hidden with CSS; if a page's markup isn't in a given file, that page simply
doesn't exist there. Images and video are separate files so the browser can
cache them independently and load them lazily.

**Navigation is real URLs**, not hash fragments: `/`, `/gallery`, `/about`,
`/contact`, `/privacy`, `/accessibility`. Vercel's `cleanUrls` maps each path
to its file automatically. A category or a single painting stays a hash on
top of `/gallery` (`/gallery#story`, `/gallery#work/slug`) rather than a URL
of its own, so those never become separately indexable pages — only the six
above are meant to be. Clicking between Gallery's categories or paintings
swaps content in place; clicking between Home/Gallery/About/Contact/the
legal pages is a real navigation to that file, since each one only exists in
its own document. Old-style links from before this change
(`/#about-page`, `/#gallery/story`, `/#work/slug`) still work — the script
recognises them on load and forwards the browser to the real URL.

**The hero shows a poster image first**, then swaps in the video once the
page is idle. The video is skipped entirely when the visitor has data-saver
on, is on a 2G/3G connection, or has asked for reduced motion — in those
cases the poster stays, with a slow zoom that mimics the video.

**Both forms (Contact, and "Send" on a painting page) send directly** via
`api/contact.js`, a Vercel serverless function that relays to the artist's
inbox through Resend — see "Making the contact forms actually send email"
above. The visitor never leaves the page and no mail app opens.

---

## Notes for later

- Image sources are modest resolution (424–894px on the long edge). They look
  right at current sizes, but if you ever want a full-screen zoom, re-export the
  originals larger and re-run `add-image.py`.
- Interface text is English throughout, including the wall-colour picker in the
  lightbox. If the site should be Hebrew, that is a larger change —
  `dir="rtl"` on `<html>` plus mirrored padding.
