import { motion } from 'framer-motion'
import WordsPullUpMultiStyle, { type TextSegment } from './WordsPullUpMultiStyle'

const EASE = [0.16, 1, 0.3, 1] as const

interface PageHeaderProps {
  label: string
  segments: TextSegment[]
  intro: string
}

/** Shared masthead for every inner page. */
export default function PageHeader({ label, segments, intro }: PageHeaderProps) {
  return (
    <section className="px-4 pb-16 pt-12 text-center sm:px-6 md:pb-24 md:pt-20">
      <p className="text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">{label}</p>

      <WordsPullUpMultiStyle
        className="mx-auto mt-6 max-w-4xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
        style={{ color: '#E1E0CC' }}
        segments={segments}
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-primary/70 sm:text-sm md:text-base"
      >
        {intro}
      </motion.p>
    </section>
  )
}
