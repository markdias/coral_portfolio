# Coral Dias Portfolio

This repository contains a fully client-side freelancer portfolio for a fashion print designer. The React/Vite single-page
application delivers a responsive, image-forward experience for showcasing collections. The editing “admin” studio now lives
in a separate, local-only app.

## Front-end application

The React application lives in [`frontend/`](frontend/) and includes:

- Landing layout with scroll-snapped Home, About, and Portfolio sections.
- High-polish art direction with animated section reveals powered by [`framer-motion`](https://www.framer.com/motion/).
- Refined neutral palette with glassy surfaces and disciplined accent gradients for a professional presentation.
- Contact section with automatically detected icons for email, phone, and social links.
- Dynamic project cards, project detail pages with modal galleries, and responsive masonry layouts.
- A lightweight data layer backed by `localStorage`, seeded with couture-inspired sample content.

### Running locally

```bash
cd frontend
npm install
npm run dev
```

The development server runs on [http://localhost:5173](http://localhost:5173) by default. Use `npm run build` to produce an
optimized bundle and `npm run preview` to review the production build.

## Admin application (local-only)

The admin studio lives in `admin/` and is not part of the public site. It runs only on localhost and can publish updates by
writing directly to `frontend/src/data/defaultData.js` on your machine.

### Configure admin password

The admin is protected by an environment-variable password. Copy `admin/.env.example` to `admin/.env` and set both values to
the same strong password:

```
VITE_ADMIN_PASSWORD=your-password-here
ADMIN_PASSWORD=your-password-here
```

`VITE_ADMIN_PASSWORD` secures the browser app; `ADMIN_PASSWORD` secures the local API that writes files.

### Run admin locally

```
cd admin
npm install
npm run dev
```

- Vite client runs on http://127.0.0.1:5174 (configurable via `VITE_ADMIN_CLIENT_HOST`/`VITE_ADMIN_CLIENT_PORT`)
- Admin API runs on http://127.0.0.1:5175 (localhost-only; configurable via `ADMIN_API_HOST`/`ADMIN_API_PORT`)

Sign in using the password from your `.env`. Edits are saved to your browser. Click “Publish to frontend” to write the
current dataset to `frontend/src/data/defaultData.js`.

The admin studio now includes a contact editor. You can add email, phone numbers, or any URL and the frontend will infer a
matching icon automatically when visitors browse the contact section.

### Image protection tools

- Use the **Site settings → Image watermark** controls to configure the watermark text, opacity, and relative size. These
  settings apply automatically to newly uploaded images (excluding the logo) through the admin media tools.
- Uploaded images render with the configured watermark overlay in the public site, and right-click saving/dragging is
  disabled to discourage casual downloads.

### Project structure

```
frontend/
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   └── …
│   ├── data/
│   │   └── defaultData.js
│   ├── store/
│   │   └── DataContext.jsx
│   ├── pages/
│   └── styles/
└── vite.config.js

admin/
├── index.html
├── package.json
├── server/
│   └── index.js   # localhost-only API for publishing
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/admin/*
│   ├── data/defaultData.js
│   ├── store/DataContext.jsx
│   └── styles/Admin.module.css
└── vite.config.js
```

### Data flow highlights

- `src/data/defaultData.js` seeds home/about copy, collections, and three sample projects (with galleries and metadata).
- `src/store/DataContext.jsx` loads stored content, exposes CRUD helpers for admin tools, and persists changes to
  `localStorage`.
- Admin lives in `admin/` and publishes to the frontend by overwriting `frontend/src/data/defaultData.js` locally.

Feel free to adapt the styling, extend the data model, or connect the store to a lightweight backend if needed.

## Deploy to GitHub Pages

This repo is set up to deploy only the public frontend (`frontend/`) to GitHub Pages using GitHub Actions.

### 1) Ensure secrets are not committed

- Local env files are ignored:
  - Root: `.gitignore` excludes `.env` and `*.env` everywhere
  - `frontend/.gitignore` excludes `.env`
  - `admin/.gitignore` excludes `.env`
- Use `admin/.env.example` as a template. Do not commit your real passwords.

### 2) Push the repository to GitHub

Initialize and push as usual:

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 3) GitHub Actions workflow

- The workflow `.github/workflows/deploy-frontend.yml` builds `frontend/` and deploys to Pages.
- It sets `VITE_BASE` to `/<repo-name>/` so Vite assets resolve correctly on Pages.
- It publishes the build output from `frontend/dist`.

Enable Pages in your repository settings if prompted. After the first run, your site will be available at:

```
https://<your-username>.github.io/<your-repo>/
```

### Notes

- The `admin/` app is local-only and is NOT deployed to Pages. It writes to `frontend/src/data/defaultData.js` on your machine.
- Keep `admin/.env` local. The password variables (`VITE_ADMIN_PASSWORD`, `ADMIN_PASSWORD`) should never be committed.
