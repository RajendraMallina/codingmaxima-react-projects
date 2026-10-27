import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { projects } from './projects/catalog'
import { RouteSeo } from './seo'

const WeightConverter = lazy(() => import('./projects/kilograms-pounds/KilogramsPounds'))
const LengthConverter = lazy(() => import('./projects/centimeter-feet/CentimeterFeet'))
const FeetInchesConverter = lazy(() => import('./projects/centimeter-feet-inches/CentimeterFeetInches'))
const UnitConverter = lazy(() => import('./projects/multi-category-unit/MultiCategoryUnit'))
const DigitalClock = lazy(() => import('./projects/digital-clock/DigitalClock'))
const Stopwatch = lazy(() => import('./projects/stopwatch/Stopwatch'))
const NumberGame = lazy(() => import('./projects/guess-number/GuessNumber'))
const QuoteCollection = lazy(() => import('./projects/random-quote-collection/RandomQuoteCollection'))
const Gallery = lazy(() => import('./projects/gallery/ProjectGallery'))

const projectPages: Record<string, LazyExoticComponent<ComponentType>> = {
  'kilograms-pounds': WeightConverter,
  'centimeter-feet': LengthConverter,
  'centimeter-feet-inches': FeetInchesConverter,
  'multi-category-unit': UnitConverter,
  'digital-clock': DigitalClock,
  stopwatch: Stopwatch,
  'guess-number': NumberGame,
  'random-quote-collection': QuoteCollection,
}

function ProjectLoading() {
  return <div className="route-loading" role="status">Opening your project…</div>
}

function App() {
  return (
    <BrowserRouter>
      <RouteSeo />
      <Suspense fallback={<ProjectLoading />}>
        <Routes>
          <Route path="/" element={<Gallery />} />
          {projects.map((project) => {
            const Page = projectPages[project.path]
            return <Route key={project.path} path={`/${project.path}`} element={<Page />} />
          })}
          <Route path="*" element={<Gallery />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
