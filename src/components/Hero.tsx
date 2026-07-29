import { motion } from 'framer-motion'
import WordsPullUp from './WordsPullUp'
import Navbar from './Navbar'
import BookCallButton from './BookCallButton'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  return (
    <section className="h-screen w-full p-4 md:p-6">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO}
          autoPlay
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
