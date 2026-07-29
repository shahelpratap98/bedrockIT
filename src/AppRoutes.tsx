import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Seo from './components/Seo'
import Home from './pages/Home'
import OurStory from './pages/OurStory'
import Services from './pages/Services'
import Support from './pages/Support'
import Cloud from './pages/Cloud'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

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
          <Route path="/support" element={<Support />} />
          <Route path="/cloud" element={<Cloud />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </main>
    </>
  )
}
