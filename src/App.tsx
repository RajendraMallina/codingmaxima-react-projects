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
const StudentRecords = lazy(() => import('./projects/student-records/StudentRecords'))
const GradeTracker = lazy(() => import('./projects/practice-labs/GradeTracker'))
const InvoiceGenerator = lazy(() => import('./projects/practice-labs/InvoiceGenerator'))
const EventRegistration = lazy(() => import('./projects/practice-labs/EventRegistration'))
const TaskPlanner = lazy(() => import('./projects/practice-labs/TaskPlanner'))
const IncomeExpense = lazy(() => import('./projects/practice-labs/IncomeExpense'))
const InventoryOrders = lazy(() => import('./projects/practice-labs/InventoryOrders'))
const BlogStudio = lazy(() => import('./projects/practice-labs/BlogStudio'))
const FormBuilder = lazy(() => import('./projects/practice-labs/FormBuilder'))
const ReadingTracker = lazy(() => import('./projects/practice-labs/ReadingTracker'))
const CountryExplorer = lazy(() => import('./projects/practice-labs/CountryExplorer'))
const WeatherDashboard = lazy(() => import('./projects/practice-labs/WeatherDashboard'))
const CurrencyConverter = lazy(() => import('./projects/practice-labs/CurrencyConverter'))
const BookDiscovery = lazy(() => import('./projects/practice-labs/BookDiscovery'))
const GithubExplorer = lazy(() => import('./projects/practice-labs/GithubExplorer'))

const projectPages: Record<string, LazyExoticComponent<ComponentType>> = {
  'kilograms-pounds': WeightConverter,
  'centimeter-feet': LengthConverter,
  'centimeter-feet-inches': FeetInchesConverter,
  'multi-category-unit': UnitConverter,
  'digital-clock': DigitalClock,
  stopwatch: Stopwatch,
  'guess-number': NumberGame,
  'random-quote-collection': QuoteCollection,
  'student-records': StudentRecords,
  'grade-tracker': GradeTracker,
  'invoice-generator': InvoiceGenerator,
  'event-registration': EventRegistration,
  'task-planner': TaskPlanner,
  'income-expense': IncomeExpense,
  'inventory-orders': InventoryOrders,
  'blog-studio': BlogStudio,
  'form-builder': FormBuilder,
  'reading-tracker': ReadingTracker,
  'country-explorer': CountryExplorer,
  'weather-dashboard': WeatherDashboard,
  'currency-converter': CurrencyConverter,
  'book-discovery': BookDiscovery,
  'github-profile-explorer': GithubExplorer,
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
          <Route path="/inventory-orders/products" element={<InventoryOrders />} />
          <Route path="/inventory-orders/orders" element={<InventoryOrders />} />
          <Route path="/blog-studio/manage" element={<BlogStudio />} />
          <Route path="/blog-studio/editor" element={<BlogStudio />} />
          <Route path="/blog-studio/post" element={<BlogStudio />} />
          <Route path="*" element={<Gallery />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
