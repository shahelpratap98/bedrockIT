import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

/**
 * Phone-only bar pinned to the bottom of a service page, so the quote form is
 * one tap away from anywhere on a long page. It stays out of the way at the
 * top (the hero already has the button), and while the form or the footer is
 * on screen.
 */
export default function StickyQuoteBar({ targetId }: { targetId: string }) {
  const [pastHero, setPastHero] = useState(false)
  const [covered, setCovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const watched = [document.getElementById(targetId), document.querySelector('footer')].filter(
      (el): el is HTMLElement => Boolean(el),
    )
    const onScreen = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target)
        else onScreen.delete(entry.target)
      }
      setCovered(onScreen.size > 0)
    })
    watched.forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [targetId])

  const visible = pastHero && !covered

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/90 px-4 pt-3 backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <a
        href={`#${targetId}`}
        tabIndex={visible ? 0 : -1}
        className="group flex w-full items-center justify-between rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black"
      >
        Get a fixed quote
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black">
          <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
        </span>
      </a>
    </div>
  )
}
