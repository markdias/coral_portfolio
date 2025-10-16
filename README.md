# Coral Portfolio

This repository contains the Coral Portfolio front-end experience, a React single-page application built with Vite. The interface showcases coral-focused storytelling projects with responsive layouts, image-forward galleries, and dedicated project detail views.

## Front-end application

The React application lives in [`frontend/`](frontend/) and ships with the following key features:

- Routing for the home, about, portfolio, and project detail pages using React Router.
- Reusable layout components (`Header`, `Footer`) and project-focused UI (`ProjectCard`, `GalleryModal`).
- Full-screen, scroll-snapped sections with smooth anchor navigation and a print-inspired, pastel palette.
- Responsive masonry-style grids, modal galleries, and hover interactions implemented with CSS modules.
- Centralized project data for driving cards and detail views.
- Print-forward typography, collage hero treatments, and refined cards evoking a textile design portfolio.

### Getting started

```bash
cd frontend
npm install
npm run dev
```

The development server runs on [http://localhost:5173](http://localhost:5173) by default. Use `npm run build` to create a production bundle and `npm run preview` to test the optimized output.

## Project structure

```
frontend/
├── index.html
├── package.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   ├── data/
│   ├── pages/
│   └── styles/
└── vite.config.js
```

Feel free to extend the project data, add CMS integrations, or connect the front end to an API as future enhancements.
