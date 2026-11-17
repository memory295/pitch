# White-Label Support Services — Client Pitch Site

A single-page, scroll-driven pitch website built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step, no npm dependencies.

## Files

```
index.html          Page markup (13 sections)
styles.css          Design system, layout and responsive rules
script.js           CONFIG, content rendering, navigation and animations
README.md           This file
assets/
  images/           Put the client images here (see below)
```

## Preview locally

Option 1 — fastest:

1. Double-click `index.html` (or right-click and open with your browser).
2. Everything works from the local file system. The only network request is for the Montserrat font from Google Fonts, so the font falls back to the system font when offline.

Option 2 — local web server (recommended for checking mobile behaviour):

```bash
cd path/to/pitch
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Change the client

Open `script.js` and edit the `CONFIG` object at the very top:

```js
const CONFIG = {
  clientName: "Ministry of Trade",
  clientShort: "MoT",
  preparedDate: "October 28, 2026",
  demoUrl: "#",
  contact: {
    location: "Blantyre, Malawi",
    email: "sales@mitra.mw",
    website: "www.mitrasystems.africa",
    websiteUrl: "https://www.mitrasystems.africa"
  }
};
```

| Field | Where it appears |
| --- | --- |
| `clientName` | Page title, meta description, cover logo alt text, "Prepared for …" |
| `clientShort` | "Let's See It Live, …" and "Ready to Start, …" headings |
| `preparedDate` | Cover footer line |
| `demoUrl` | "Launch Live Helpdesk" button (opens in a new tab) |
| `contact.location` | Closing contact row |
| `contact.email` | Closing contact row and `mailto:` link |
| `contact.website` / `websiteUrl` | Closing contact row link text and URL |

To rebrand the platform name ("Mitra Helpdesk", "Powered by Mitra Systems"), edit the matching text directly in `index.html`.

## Swap the images

Put the images in `assets/images/` using these filenames (PNG preferred):

```
logo.png            logo-transparent.png  cover.png
thanks.png          platform.png          chaos.png
brand-whitelabel.png  brand-domains.png   brand-email.png
ai-efficiency.png   ai-alerts.png         ai-approval.png
ai-audit.png        revenue.png           demo.png
closing.png
```

JPG/JPEG files with the same base names also work: if a PNG is not found, the page automatically tries `.jpg` (and vice versa). For example, `cover.jpg` will load even if `cover.png` is missing.

Recommended formats and crops:

- **logo.png** — the main cover logo; a wide horizontal lockup works best.
- **logo-transparent.png** — transparent brand mark, shown as a small fixed badge in the top-right corner on every section.
- **cover.png** — portrait or square, high resolution; it fills the right side of the cover at full viewport height (object-fit: cover).
- **thanks.png / demo.png / closing.png** — square images; they are displayed as circles (210px, 380px and 300px respectively on desktop).
- **ai-*.png** — portrait or landscape works; they fill the full-height right-hand panel.
- **chaos.png** — fills the left half of the problem section.
- **platform.png / brand-*.png / revenue.png** — landscape, ideally 4:3.

Any image that is still missing renders a neutral grey block containing its filename, so the layout stays intact. To use a different filename, update both the `src` attribute and the `data-ph` attribute on that image in `index.html`.

## Deploy

### Netlify (drag and drop)

1. Go to <https://app.netlify.com/drop> and sign in.
2. Drag the entire `pitch` folder (the folder containing `index.html`) onto the drop area.
3. Netlify uploads the site and gives you a URL such as `https://random-name.netlify.app`.
4. Optional: Site configuration → Change site name, then add a custom domain under Domain management.

No build command and no publish directory are required. If you use the Netlify CLI or connect a Git repository, leave the build command empty and set the publish directory to `.` (the project root).

### Cloudflare Pages (direct upload)

1. Sign in at <https://dash.cloudflare.com> and go to **Workers & Pages**.
2. Choose **Create** → **Pages** → **Upload assets**.
3. Enter a project name (for example `mitra-pitch`).
4. Drag the `pitch` folder (or select the files) and click **Deploy site**.
5. Your site is published at `https://project-name.pages.dev`. Add a custom domain from the project's **Custom domains** tab if needed.

There is no framework preset, build command or output directory to configure. The folder is uploaded as static assets.

### Other static hosts

- **Vercel** — create a project, choose "Other" as the framework, and deploy the folder; no build command, output directory `.`.
- **GitHub Pages** — push the folder to a repository, then Settings → Pages → deploy from the branch root.

## Notes

- The site is marked `<meta name="robots" content="noindex">` because it is a private client pitch. Remove that tag if the site should be indexed.
- The "Privacy policy" link in the bottom navigation is a placeholder (`href="#"`). Point it at a real policy page before sharing widely.
- Scrolling, tab switching, counting numbers, the sticky AI story and the timeline all respect `prefers-reduced-motion`.
- The bottom navigation can be hidden with **Exit**; a small round button appears in the bottom-right corner to bring it back.
- No cookies, analytics or tracking scripts are included.
