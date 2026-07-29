import { Link, useLocation } from 'react-router-dom'

export const NAV_ITEMS = [
  { label: 'Our story', to: '/our-story' },
  { label: 'Services', to: '/services' },
  { label: 'Support', to: '/support' },
  { label: 'Cloud', to: '/cloud' },
  { label: 'Contact', to: '/contact' },
]

const IDLE = 'rgba(225, 224, 204, 0.8)'
const ACTIVE = '#E1E0CC'

interface NavbarProps {
  /** `overlay` hangs the black pill from the top of the hero; `inline` sits on the page. */
  variant?: 'overlay' | 'inline'
}

export default function Navbar({ variant = 'overlay' }: NavbarProps) {
  const { pathname } = useLocation()

  const links = (
    <ul className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.to
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              className="whitespace-nowrap text-[10px] transition-colors duration-200 sm:text-xs md:text-sm"
              style={{ color: isActive ? ACTIVE : IDLE }}
              onMouseEnter={(e) => (e.currentTarget.style.color = ACTIVE)}
              onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? ACTIVE : IDLE)}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  if (variant === 'inline') {
    return (
      <header className="relative z-20 flex flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between sm:px-6 md:px-8">
        <Link
          to="/"
          className="text-sm font-bold tracking-tight sm:text-base"
          style={{ color: ACTIVE }}
        >
          BedRock IT
        </Link>
        <nav>{links}</nav>
      </header>
    )
  }

  return (
    <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2 rounded-b-2xl bg-black px-4 py-2 md:rounded-b-3xl md:px-8">
      {links}
    </nav>
  )
}
