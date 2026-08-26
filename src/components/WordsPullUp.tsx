import { Fragment, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface WordsPullUpProps {
  text: string
  className?: string
  /** Renders a superscript asterisk hanging off the final character of the last word. */
  showAsterisk?: boolean
  style?: React.CSSProperties
  /** Element to render, so headings can be semantic. */
  as?: 'div' | 'h1' | 'h2'
  /**
   * Animate in CSS instead of framer-motion, for headings that are already on
   * screen at load. Those paint as soon as the stylesheet lands rather than
   * waiting for hydration — which matters when the heading is the LCP element.
   */
  immediate?: boolean
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
  immediate = false,
}: WordsPullUpProps) {
  const words = text.split(' ')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const Tag = as as React.ElementType

  // Normal inline flow with real spaces between words, rather than flex items
  // with padding — otherwise the heading's text content reads as one long word.
  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        const head = word.slice(0, -1)
        const tail = word.slice(-1)

        const content =
          showAsterisk && isLast ? (
            <>
              {head}
              <span className="relative inline-block">
                {tail}
                <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
              </span>
            </>
          ) : (
            word
          )

        return (
          <Fragment key={`${word}-${i}`}>
            {i > 0 && ' '}
            {immediate ? (
              <span className="rise-in inline-block" style={{ animationDelay: `${i * 0.08}s` }}>
                {content}
              </span>
            ) : (
              <motion.span
                custom={i}
                variants={pullUpVariant}
                initial="initial"
                animate={isInView ? 'animate' : 'initial'}
                className="inline-block"
              >
                {content}
              </motion.span>
            )}
          </Fragment>
        )
      })}
    </Tag>
  )
}
