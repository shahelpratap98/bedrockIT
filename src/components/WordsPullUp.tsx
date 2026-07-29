import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface WordsPullUpProps {
  text: string
  className?: string
  /** Renders a superscript asterisk hanging off the final character of the last word. */
  showAsterisk?: boolean
  style?: React.CSSProperties
  /** Element to render, so headings can be semantic. */
  as?: 'div' | 'h1' | 'h2'
}

const pullUpVariant = {
  initial: { y: 20, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
}

export default function WordsPullUp({
  text,
  className = '',
  showAsterisk = false,
  style,
  as = 'div',
}: WordsPullUpProps) {
  const words = text.split(' ')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const Tag = as as React.ElementType

  return (
    <Tag ref={ref} className={`flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        const head = word.slice(0, -1)
        const tail = word.slice(-1)

        return (
          <motion.span
            key={`${word}-${i}`}
            custom={i}
            variants={pullUpVariant}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            className="inline-block pr-[0.25em]"
          >
            {showAsterisk && isLast ? (
              <>
                {head}
                <span className="relative inline-block">
                  {tail}
                  <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
                </span>
              </>
            ) : (
              word
            )}
          </motion.span>
        )
      })}
    </Tag>
  )
}
