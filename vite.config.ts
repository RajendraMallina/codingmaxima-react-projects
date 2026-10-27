import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const projectMetadata = [
  ['kilograms-pounds', 'Kilograms and Pounds Converter', 'Convert kilograms to pounds and pounds to kilograms with the CodingMaxima React weight converter. Edit either field for an immediate result.', 'Practice two-way weight conversion between kilograms and pounds in this independent CodingMaxima React project. Enter a non-negative measurement in either field to see the reciprocal result. This focused exercise demonstrates controlled form inputs, numeric conversion, synchronized state and clear result presentation.', 'Weight conversion'],
  ['centimeter-feet', 'Centimeters and Feet Converter', 'Convert centimeters to feet or feet to centimeters instantly with this CodingMaxima React length-conversion practice project.', 'Explore reciprocal length conversion in this CodingMaxima React project. Enter centimeters or feet and see the matching measurement calculated using 1 foot = 30.48 centimeters. The independent page provides a practical example of controlled inputs, conversion formulas and responsive UI state.', 'Length conversion'],
  ['centimeter-feet-inches', 'Centimeters, Feet and Inches Converter', 'Convert centimeters to whole feet and remaining inches, or enter feet and inches to calculate centimeters with this CodingMaxima React project.', 'Convert between centimeters and a compound feet-and-inches measurement. This independent CodingMaxima React project calculates whole feet plus remaining inches, and accepts feet and inches as input to calculate centimeters. It demonstrates synchronized controlled fields, compound unit formulas, validation and rounding.', 'Length conversion'],
  ['multi-category-unit', 'Multi-Category Unit Converter', 'Convert length, mass and temperature with the CodingMaxima React unit converter using category tabs and live results.', 'Use this CodingMaxima React practice project to convert values across length, mass and temperature categories. Choose a source unit and enter a signed decimal or scientific-notation value to compare compatible results. Temperature uses an offset as well as a scale; length and mass use proportional conversion. The project demonstrates reusable unit data, controlled forms, input validation and category-driven rendering.', 'Unit conversion'],
  ['digital-clock', 'Digital Clock', 'View the current local time and date in a live CodingMaxima React digital clock with 12-hour and 24-hour display options.', 'The CodingMaxima React Digital Clock displays the current local time and date and lets visitors switch between 12-hour and 24-hour formats. This independent project illustrates date formatting, scheduled updates, component state and accessible live information.', 'Time and date'],
  ['stopwatch', 'Stopwatch', 'Start, pause, resume and reset elapsed time with the CodingMaxima React stopwatch, displayed to hundredths of a second.', 'Measure elapsed time with the independent CodingMaxima React stopwatch. Start, pause, resume or reset the timer; the display shows minutes, seconds and hundredths and can run beyond an hour. The project demonstrates animation-frame updates, monotonic time measurement, lifecycle cleanup and stateful controls.', 'Time and measurement'],
  ['guess-number', 'Number Guessing Game', 'Find the hidden number from 1 to 20, follow higher-or-lower clues and track your score in the CodingMaxima React guessing game.', 'Play the CodingMaxima React number guessing game by finding a secret integer from 1 to 20. Receive higher-or-lower clues, preserve points with careful guesses and try to beat the session high score. The project demonstrates controlled forms, validation, conditional feedback, game state and session storage.', 'Interactive number game'],
  ['random-quote-collection', 'Random Quote Collection', 'Generate a fresh collection of distinct quotes with the CodingMaxima React project; choose the number of quotes and whether to show authors.', 'Create a randomly selected set of distinct entries from a local quote catalog, choose its size and optionally reveal the author labels. Regenerate the collection to discover another set. This independent CodingMaxima React project demonstrates array shuffling, sampling without duplicates, controlled settings and conditional rendering.', 'Quote collection'],
]

function routeHtmlMetadata() {
  return {
    name: 'codingmaxima-route-html',
    closeBundle() {
      const baseHtml = readFileSync(resolve('dist/index.html'), 'utf8')
        .replace(/\s*<meta\b(?=[^>]*(?:name|property)="(?:description|author|robots|keywords|og:[^"]+|twitter:[^"]+)")[^>]*>/g, '')
        .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
      for (const [slug, name, description, detail, category] of projectMetadata) {
        const title = `${name} | CodingMaxima React Projects`
        const tags = [
          `<title>${title}</title>`, `<meta name="description" content="${description}">`, '<meta name="author" content="CodingMaxima">',
          '<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="keywords" content="CodingMaxima React projects, React practice projects, beginner React projects, learn React, interactive coding exercises">',
          '<meta property="og:type" content="website">', '<meta property="og:site_name" content="CodingMaxima React Projects">', `<meta property="og:title" content="${title}">`, `<meta property="og:description" content="${description}">`, '<meta property="og:image" content="https://codingmaxima.com/assets/img/nlogo.png">',
          '<meta name="twitter:card" content="summary">', `<meta name="twitter:title" content="${title}">`, `<meta name="twitter:description" content="${description}">`, '<meta name="twitter:image" content="https://codingmaxima.com/assets/img/nlogo.png">',
          `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name, description: detail, applicationCategory: category, operatingSystem: 'Any', inLanguage: 'en', author: { '@type': 'Organization', name: 'CodingMaxima', url: 'https://codingmaxima.com/' }, isPartOf: { '@type': 'CreativeWorkSeries', name: 'CodingMaxima React Projects' } })}</script>`,
        ].join('\n    ')
        const output = baseHtml.replace(/<title>.*?<\/title>/s, tags)
        const pagePath = resolve('dist', slug, 'index.html')
        mkdirSync(dirname(pagePath), { recursive: true })
        writeFileSync(pagePath, output)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), routeHtmlMetadata()],
})
