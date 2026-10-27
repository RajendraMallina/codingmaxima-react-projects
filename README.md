# CodingMaxima React Projects

An independent React version of the CodingMaxima practice projects. Each demo is a standalone, lazy-loaded route with its own page markup, header, footer, styling, and state. The gallery links to every demo and is sourced from `src/projects/catalog.ts`.

## Run locally

```powershell
npm install
npm run dev
```

## Available routes

- `/` — project gallery
- `/kilograms-pounds`
- `/centimeter-feet`
- `/centimeter-feet-inches`
- `/multi-category-unit`
- `/digital-clock`
- `/stopwatch`
- `/guess-number`
- `/random-quote-collection`

Each demo folder contains its React component and CSS. The entry route table is in `src/App.tsx`; add future projects to the route map and catalog to make them available in the gallery.

Build with `npm run build`. The built site is in `dist/`.
