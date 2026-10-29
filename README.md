# Doctor Bari Shyama Sangha — Official Bilingual Website

A responsive, bilingual (বাংলা / English) static website built with HTML5, CSS3 and vanilla JavaScript. No build process, database, API key, or backend is required.

## 1. Project structure

```text
doctor-bari-shyama-sangha/
├── index.html
├── css/style.css
├── js/main.js
├── js/translations.js
├── js/content.js
├── assets/images/
│   ├── logo.png
│   ├── hero.webp
│   ├── gallery/
│   └── catalogs/
├── favicon.svg
├── README.md
└── .nojekyll
```

## 2. Before publishing: add approved assets

The starter intentionally does **not** pretend stock or generated images are real organizational photographs. Until supplied, the site uses documented paths and a branded fallback surface.

Replace these paths with real, publication-approved photos:

- `assets/images/logo.png` — transparent PNG logo or emblem.
- `assets/images/hero.webp` — wide hero photo of the organization's actual Shyama Puja.
- `assets/images/gallery/about.webp`
- `assets/images/gallery/puja-venue.webp`
- `assets/images/gallery/idol-artistry.webp`
- `assets/images/gallery/puja-moments.webp`
- `assets/images/gallery/cultural-event.webp`
- `assets/images/gallery/memory.webp`

Recommended image preparation:
- Hero: 1800 × 1200 px or larger, WebP, ideally under 450 KB.
- Gallery/catalog: around 1200 px on the long edge, WebP/JPEG, ideally 100–250 KB each.
- Logo: transparent PNG or SVG. If changing the logo format, update its path in `index.html`.
- Keep the actual image subject and colours natural; only publish photos the organization has permission to share.

The site detects unavailable gallery images and shows a deliberate placeholder instead of a broken-image icon. Replace all placeholder assets before calling the site final.

## 3. Edit content (no coding tools required)

Open `js/content.js` in a text editor.

### Organization details
Update the `organization` object:
- `address`: verified public address.
- `phone`: verified public phone number.
- `email`: official email.
- `facebook`: full public Facebook Page URL.
- `maps`: optional verified Google Maps URL.

Leave a value as an empty string (`""`) if it is unknown. The corresponding contact link will not be shown. The address can still be displayed as the location already provided for the organization.

### Announcements
Set `announcement.enabled` to `true` and fill both `bn` and `en` only when an announcement is confirmed. Set it to `false` to hide the bar.

### Add a gallery photo
Add a new object inside the `gallery` array, using the same structure:

```js
{
  id: "shyama-2026-aarti",
  category: "moments",
  image: "assets/images/gallery/shyama-2026-aarti.webp",
  alt: {
    bn: "শ্যামা পূজার আরতির মুহূর্ত",
    en: "A moment during Shyama Puja aarti"
  },
  caption: {
    bn: "আরতির মুহূর্ত",
    en: "Aarti moment"
  },
  year: "2026"
}
```

Valid category values: `idols`, `venue`, `moments`, `culture`, `memories`. Use unique `id` values and ensure the image path matches the uploaded file. The gallery filter and lightbox are generated automatically.

### Add a yearly idol catalog
Add an object inside `catalogs`:

```js
{
  year: "2026",
  title: { bn: "২০২৬ সালের প্রতিমা", en: "2026 Idol" },
  description: {
    bn: "বার্ষিক প্রতিমার সংকলন",
    en: "Annual idol collection"
  },
  image: "assets/images/catalogs/2026.webp",
  pdf: "assets/images/catalogs/2026.pdf"
}
```

The `pdf` field is optional. If no real PDF is available, omit it or set it to an empty string. Year filters are created automatically.

### Add an event
Add an object inside `events` only when details are confirmed:

```js
{
  id: "shyama-puja-2026",
  status: "upcoming",
  date: "2026-11-08",
  time: "18:00",
  location: { bn: "দক্ষিণ কাঞ্চনা", en: "Dakshin Kanchana" },
  title: { bn: "শ্যামা পূজা", en: "Shyama Puja" },
  description: {
    bn: "অনুষ্ঠানের সংক্ষিপ্ত বিবরণ।",
    en: "A short description of the event."
  },
  poster: "assets/images/events/shyama-puja-2026.webp"
}
```

The poster is optional. Use `YYYY-MM-DD` for dates and a local 24-hour time such as `18:00`. Remove the example object if the event is not confirmed. When the array is empty, the site displays a bilingual empty state.

## 4. Edit translations

Open `js/translations.js`. Every visible UI label is stored in the `bn` and `en` objects. Keep keys consistent in both languages. The language selector updates the page content, document language and accessible labels, and remembers the preference when browser storage is available.

Long-form About/Heritage copy can be edited there too. Gallery captions and event details are edited in `js/content.js`.

## 5. Test locally

1. Keep the project folders and paths exactly as shown.
2. Open `index.html` in a modern browser.
3. Test the Bengali/English switch.
4. Test the mobile menu at 360 px and 390 px widths.
5. Test filters, image viewer, Escape, arrow keys, and touch swipe.
6. Test with missing images and with browser storage disabled.
7. Test at 768 px, 1024 px and a wide desktop width.
8. Inspect browser developer tools for console errors and missing files.

A simple local static server is optional but useful for testing:
- Python users can run `python -m http.server` from the project folder.
- The site itself does not require Python or a server when deployed.

## 6. Deploy for free with GitHub Pages

1. Sign in to GitHub and create a repository, for example `doctor-bari-shyama-sangha`.
2. If using GitHub's free public-repository Pages workflow, assume the repository and its source files are public. Do not upload private data, passwords, unpublished committee information, or photos without publication approval.
3. Upload the **contents** of this folder to the repository root. `index.html` must be at the root, not inside another nested folder.
4. Open repository **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose branch `main` and folder `/ (root)`, then save.
7. Wait for GitHub Pages to publish. The URL will usually look like `https://YOUR-USERNAME.github.io/doctor-bari-shyama-sangha/`.
8. Replace the canonical URL placeholder in `index.html` with the final public URL.
9. Test the live URL on a phone, including image paths, navigation, language switcher and links.
10. For updates, edit and upload the relevant files. GitHub Pages republishes after the commit is processed.

The `.nojekyll` file is included to tell GitHub Pages not to apply Jekyll processing.

## 7. Final publication checklist

- [ ] Replace all placeholder photographs with real approved organizational photos.
- [ ] Confirm the logo and Bengali spelling of the official name.
- [ ] Verify address, phone, email, Facebook page and map URL.
- [ ] Verify dates/times before publishing events.
- [ ] Add genuine catalog PDFs only.
- [ ] Update the canonical URL and social-sharing image path.
- [ ] Check image credits/permissions and remove any photo that should not be public.
- [ ] Test all content in Bengali and English.
- [ ] Check mobile layout and keyboard navigation.
- [ ] Confirm there are no broken local asset paths.

## Accessibility and privacy notes

The site uses semantic landmarks, visible focus styles, a skip link, keyboard-operated lightbox controls, reduced-motion support, translated accessible labels and lazy-loaded gallery imagery. The lightbox includes focus restoration and a basic focus trap.

Do not publish personal phone numbers or identifiable photographs without permission. The contact links are generated only from provided, valid details.
