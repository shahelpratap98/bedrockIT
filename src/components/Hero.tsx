import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import WordsPullUp from './WordsPullUp'
import Navbar from './Navbar'
import BookCallButton from './BookCallButton'

/**
 * Self-hosted. This used to point at Higgsfield's CloudFront bucket, which put
 * the homepage hero on a URL we do not control and cannot redeploy.
 */
const HERO_VIDEO = `${import.meta.env.BASE_URL}media/hero.mp4`
const HERO_POSTER = `${import.meta.env.BASE_URL}media/hero-poster.jpg`

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  /**
   * The poster paints straight away; the video only starts downloading once the
   * first frame is on screen, so it never competes with the critical CSS and JS
   * that the rest of the page is waiting on.
   */
  useEffect(() => {
    const video = videoRef.current
    if (!video || video.src) return

    const attach = () => {
      video.src = HERO_VIDEO
      // autoPlay only fires on a source present at mount, so start it here.
      void video.play().catch(() => {
        /* Autoplay refused (battery saver, reduced data). Poster stays. */
      })
    }

    // A timer rather than requestAnimationFrame: rAF never fires in a tab that
    // is not compositing (opened in the background, say), which would strand
    // the hero on its poster until the tab was focused.
    const id = window.setTimeout(attach, 0)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <section className="h-screen w-full p-4 md:p-6">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={HERO_POSTER}
          preload="none"
          loop
          muted
          playsInline
        />

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Navbar — a black pill hanging from the top edge */}
        <Navbar variant="overlay" />

        {/* Bottom-aligned hero content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-2 sm:px-6 md:px-8">
          <div className="grid grid-cols-12 items-end gap-4 md:gap-6">
            <div className="col-span-12 lg:col-span-8">
              <WordsPullUp
                text="BedRock IT"
                as="h1"
                showAsterisk
                className="text-[22vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[20vw] md:text-[18vw] lg:text-[15vw] xl:text-[14vw] 2xl:text-[15vw]"
                style={{ color: '#E1E0CC' }}
              />
            </div>

            <div className="col-span-12 flex flex-col items-start gap-5 pb-6 sm:gap-6 md:pb-10 lg:col-span-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                className="max-w-md text-xs text-primary/70 sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
              >
                BedRock IT is a managed technology partner for businesses that cannot afford
                downtime. Websites, cloud, networks and security — built, monitored and supported by
                one team that actually answers the phone.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              >
                <BookCallButton large />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
