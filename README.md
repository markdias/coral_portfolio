# Coral Atelier Portfolio

This repository contains a fully client-side freelancer portfolio for a fashion print designer. The React/Vite single-page
application delivers a responsive, image-forward experience for showcasing collections and managing content via a password-
protected admin studio.

## Front-end application

The React application lives in [`frontend/`](frontend/) and includes:

- Landing layout with scroll-snapped Home, About, and Portfolio sections.
- Dynamic project cards, project detail pages with modal galleries, and responsive masonry layouts.
- A lightweight data layer backed by `localStorage`, seeded with couture-inspired sample content.
- Password-protected admin tools for editing page copy, managing collections, and curating project metadata/galleries.

### Running locally

```bash
cd frontend
npm install
npm run dev
```

The development server runs on [http://localhost:5173](http://localhost:5173) by default. Use `npm run build` to produce an
optimized bundle and `npm run preview` to review the production build.

### Admin studio access

- Navigate to `/admin` (a visually hidden link also lives in the footer).
- Enter the default password: **`atelier2024`**.
- All edits persist to your browser’s `localStorage`. Use the **Reset to defaults** button in the admin header to restore the
  original sample content.
- Update the password from the “Account” panel; changes apply only to the current browser/device.

### Project structure

```
frontend/
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── admin/
│   │   └── …
│   ├── data/
│   │   └── defaultData.js
│   ├── store/
│   │   └── DataContext.jsx
│   ├── pages/
│   └── styles/
└── vite.config.js
```

### Data flow highlights

- `src/data/defaultData.js` seeds home/about copy, collections, and three sample projects (with galleries and metadata).
- `src/store/DataContext.jsx` loads stored content, exposes CRUD helpers for admin tools, and persists changes to
  `localStorage`.
- Admin components under `src/components/admin/` orchestrate editing forms for each section of the site.

Feel free to adapt the styling, extend the data model, or connect the store to a lightweight backend if needed.
