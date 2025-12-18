## Islamic Wedding Invitation – Single Page Website

This project is a **fully responsive wedding invitation website** built with pure **HTML, CSS, and vanilla JavaScript**. It includes:

- A page for the wedding celebration of **Mian Adeel Ur Rehman**.
- A separate page for the wedding celebration of the **Daughter of Mian Aman Ullah Saleem**.

### Features

- **Sections**: Hero, Barat Invitation, Combined Walima & Sister’s Barat, Looking Forward, RSVP, Footer.
- **Design**:
  - Islamic-inspired geometric background and decorative placeholders.
  - Color palette: dark green, navy, gold, and cream.
  - Google Fonts: `Cormorant Garamond` (headings) and `Raleway` (body).
  - CSS Grid & Flexbox layout, mobile-first responsive design.
- **JavaScript**:
  - Smooth scroll navigation using data attributes.
  - Sticky navigation with mobile menu toggle.
  - Intersection Observer for fade-in “reveal” animations.
  - Countdown timer to **Barat** on **January 1st, 2026 (6pm)**.
  - “Add to Calendar” buttons that generate downloadable `.ics` files.
  - Lazy loading via `loading="lazy"` on imagery.
- **Accessibility**:
  - Semantic HTML5 structure (`header`, `main`, `section`, `article`, `footer`).
  - Skip link, ARIA labels, keyboard-friendly navigation (including Esc to close mobile menu).
  - High-contrast text on backgrounds.

### File Structure

```text
wedding-invitation/
├── index.html          # Adeel's wedding (Barat + Walima + shared info)
├── daughter.html       # Daughter of Mian Aman Ullah Saleem (Barat only)
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   └── placeholders/
│       ├── hero-bg.jpg
│       ├── rings.jpg
│       ├── flowers.jpg
│       └── decoration.jpg
└── README.md
```

> Note: The `images/placeholders` files are referenced but not provided here. You can replace them with your own **Islamic patterns and non-people wedding imagery** while keeping the same filenames.
>
> The main layout now uses **Unsplash** image URLs directly for the hero and event visuals. You may swap these URLs with other Unsplash links of your choice as long as they respect the “no people” preference.

### Running the Site

No build tools are required.

1. Open `index.html` directly in a browser, or
2. Serve the folder with a simple static server, for example:

```bash
cd /home/adeel/Projects/wedding-invitation
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

### Customization

- **Texts**: All invitation texts are in `index.html` under clearly labeled sections.
- **Colors & Fonts**: Adjust CSS variables at the top of `css/styles.css`.
- **Event Dates**: Update the JavaScript `Date` objects for the three events in `js/script.js`:
  - Barat (`data-calendar="barat"`)
  - Walima (`data-calendar="walima"`)
  - Sister’s Barat (`data-calendar="sisterBarat"`)
- **RSVP Contacts**: Update names and phone numbers / WhatsApp links in the RSVP section in `index.html`.

#### Show / Hide Barat via Link

On **Adeel’s page** (`index.html`), you can control the visibility of the **Barat** section via a URL parameter:

- Show Barat (default): `index.html` or `index.html?barat=show`
- Hide Barat: `index.html?barat=hide`

This is useful if you want to share a link that only highlights the Walima and other details.

### Performance Notes

- CSS and JS are intentionally left readable; for production, you may **minify**:
  - `css/styles.css`
  - `js/script.js`
- Images should be optimized (compressed JPEG/WEBP) and sized appropriately for faster loading.

### License

This project is provided as a starter template. You are free to modify and adapt it for personal use. For public or commercial use, please ensure that fonts and imagery you add comply with their respective licenses.


