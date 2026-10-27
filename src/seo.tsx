import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const pages: Record<string, { name: string; category: string; summary: string; detail: string; keywords: string }> = {
  '/': { name: 'Interactive Practice Projects', category: 'Programming education', summary: 'Explore CodingMaxima React projects: interactive coding exercises, unit converters, a digital clock, stopwatch, number game and quote collection.', detail: 'Browse the CodingMaxima React Projects gallery, a hands-on collection of independent practice applications for learning through interaction. Explore measurement conversion, multi-category unit conversion, live time display, elapsed-time measurement, number guessing and randomized quote collections. Each project has its own interface and logic so learners can focus on one practical programming idea at a time.', keywords: 'CodingMaxima React projects, React practice projects, beginner React projects, learn React, interactive coding exercises, React unit converter, React stopwatch, React digital clock' },
  '/kilograms-pounds': { name: 'Kilograms and Pounds Converter', category: 'Weight conversion', summary: 'Convert kilograms to pounds and pounds to kilograms with the CodingMaxima React weight converter. Edit either field for an immediate result.', detail: 'Practice two-way weight conversion between kilograms and pounds in this independent CodingMaxima React project. Enter a non-negative measurement in either field to see the reciprocal result. The focused exercise demonstrates controlled form inputs, numeric conversion, synchronized state and clear result presentation.', keywords: 'CodingMaxima React projects, React kilograms to pounds converter, kg to lb, pounds to kilograms, React weight conversion, beginner React project' },
  '/centimeter-feet': { name: 'Centimeters and Feet Converter', category: 'Length conversion', summary: 'Convert centimeters to feet or feet to centimeters instantly with this CodingMaxima React length-conversion practice project.', detail: 'Explore reciprocal length conversion in this CodingMaxima React project. Enter centimeters or feet and see the matching measurement calculated using 1 foot = 30.48 centimeters. The independent page provides a practical example of controlled inputs, conversion formulas and responsive UI state.', keywords: 'CodingMaxima React projects, React centimeters to feet converter, cm to ft, feet to centimeters, length conversion, React numeric inputs' },
  '/centimeter-feet-inches': { name: 'Centimeters, Feet and Inches Converter', category: 'Length conversion', summary: 'Convert centimeters to whole feet and remaining inches, or enter feet and inches to calculate centimeters with this CodingMaxima React project.', detail: 'Convert between centimeters and a compound feet-and-inches measurement. This independent CodingMaxima React project calculates whole feet plus remaining inches, and accepts feet and inches as input to calculate centimeters. It demonstrates synchronized controlled fields, compound unit formulas, validation and rounding.', keywords: 'CodingMaxima React projects, centimeters feet inches converter, cm to feet and inches, feet inches to centimeters, React length converter' },
  '/multi-category-unit': { name: 'Multi-Category Unit Converter', category: 'Unit conversion', summary: 'Convert length, mass and temperature with the CodingMaxima React unit converter using category tabs and live results.', detail: 'Use this CodingMaxima React practice project to convert values across length, mass and temperature categories. Choose a source unit and enter a signed decimal or scientific-notation value to compare compatible results. Temperature uses an offset as well as a scale; length and mass use proportional conversion. The project demonstrates reusable unit data, controlled forms, input validation and category-driven rendering.', keywords: 'CodingMaxima React projects, React multi-category unit converter, length mass temperature conversion, Celsius Fahrenheit, React converter app' },
  '/digital-clock': { name: 'Digital Clock', category: 'Time and date', summary: 'View the current local time and date in a live CodingMaxima React digital clock with 12-hour and 24-hour display options.', detail: 'The CodingMaxima React Digital Clock displays the current local time and date and lets visitors switch between 12-hour and 24-hour formats. This independent project illustrates date formatting, scheduled updates, component state and accessible live information.', keywords: 'CodingMaxima React projects, React digital clock, live clock, 12 hour 24 hour clock, local time React, React date formatting' },
  '/stopwatch': { name: 'Stopwatch', category: 'Time and measurement', summary: 'Start, pause, resume and reset elapsed time with the CodingMaxima React stopwatch, displayed to hundredths of a second.', detail: 'Measure elapsed time with the independent CodingMaxima React stopwatch. Start, pause, resume or reset the timer; the display shows minutes, seconds and hundredths and can run beyond an hour. The project demonstrates animation-frame updates, monotonic time measurement, lifecycle cleanup and stateful controls.', keywords: 'CodingMaxima React projects, React stopwatch, online stopwatch, elapsed time timer, start pause resume reset, React timer practice' },
  '/guess-number': { name: 'Number Guessing Game', category: 'Interactive number game', summary: 'Find the hidden number from 1 to 20, follow higher-or-lower clues and track your score in the CodingMaxima React guessing game.', detail: 'Play the CodingMaxima React number guessing game by finding a secret integer from 1 to 20. Receive higher-or-lower clues, preserve points with careful guesses and try to beat the session high score. The project demonstrates controlled forms, validation, conditional feedback, game state and session storage.', keywords: 'CodingMaxima React projects, React number guessing game, guess number 1 to 20, React beginner game, score guessing game' },
  '/random-quote-collection': { name: 'Random Quote Collection', category: 'Quote collection', summary: 'Generate a fresh collection of distinct quotes with the CodingMaxima React project; choose the number of quotes and whether to show authors.', detail: 'Create a randomly selected set of distinct entries from a local quote catalog, choose its size and optionally reveal the author labels. Regenerate the collection to discover another set. This independent CodingMaxima React project demonstrates array shuffling, sampling without duplicates, controlled settings and conditional rendering.', keywords: 'CodingMaxima React projects, React random quote generator, quote collection app, random quotes React, array shuffle practice, beginner React project' },
}

const origin = 'https://codingmaxima.com/assets/img/nlogo.png'

export function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
    const page = pages[normalizedPath] ?? pages['/']
    const title = `${page.name} | CodingMaxima React Projects`
    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(selector)
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, key); document.head.appendChild(tag) }
      tag.content = content
    }
    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', page.summary)
    setMeta('meta[name="keywords"]', 'name', 'keywords', page.keywords)
    setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large')
    setMeta('meta[name="author"]', 'name', 'author', 'CodingMaxima')
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'CodingMaxima React Projects')
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', page.summary)
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href)
    setMeta('meta[property="og:image"]', 'property', 'og:image', origin)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', page.summary)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', origin)
    document.getElementById('codingmaxima-project-schema')?.remove()
    const schema = document.createElement('script')
    schema.id = 'codingmaxima-project-schema'
    schema.type = 'application/ld+json'
    schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': normalizedPath === '/' ? 'CollectionPage' : 'WebApplication', name: page.name, description: page.detail, applicationCategory: page.category, operatingSystem: 'Any', inLanguage: 'en', author: { '@type': 'Organization', name: 'CodingMaxima', url: 'https://codingmaxima.com/' }, isPartOf: { '@type': 'CreativeWorkSeries', name: 'CodingMaxima React Projects' } })
    document.head.appendChild(schema)
  }, [pathname])

  return null
}
