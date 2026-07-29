import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Seo from './components/Seo'
import Home from './pages/Home'
import OurStory from './pages/OurStory'
import Services from './pages/Services'
import ServicePage from './pages/ServicePage'
import Support from './pages/Support'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { SERVICES } from './data/services'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

/**
 * Everything inside the router. Split out from App so the prerender step can
 * mount it under a StaticRouter.
 */
export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Seo />
      <main className="bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/services" element={<Services />} />
          {SERVICES.map((service) => (
            <Route
              key={service.slug}
              path={`/services/${service.slug}`}
              element={<ServicePage service={service} />}
            />
          ))}
          <Route path="/support" element={<Support />} />
          {/* Old URL, kept working. Vercel 301s it; static hosts fall through
              to the 404 shell and this handles it client-side. */}
          <Route path="/cloud" element={<Navigate to="/services/cloud-migration" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </main>
    </>
  )
}
