import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function NotFound() {
  return (
    <div className="bg-black">
      <Navbar variant="inline" />

      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center sm:px-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">404</p>
        <h1
          className="mt-6 max-w-2xl text-3xl leading-[0.95] sm:text-4xl md:text-5xl"
          style={{ color: '#E1E0CC' }}
        >
          This page is <span className="font-serif italic">down.</span> Everything else is fine.
        </h1>
        <p className="mt-6 max-w-md text-xs text-gray-400 sm:text-sm">
          The link you followed does not exist. Ironic, we know.
        </p>
        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all duration-300 hover:gap-3"
        >
          Back to home
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110">
            <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
          </span>
        </Link>
      </section>
    </div>
  )
}
