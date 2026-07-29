import { Fragment, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export interface TextSegment {
  text: string
  className?: string
  /** Force the next segment onto its own line. */
  breakAfter?: boolean
}

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[]
  className?: string
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

export default function WordsPullUpMultiStyle({
  segments,
  className = '',
  style,
  as = 'div',
}: WordsPullUpMultiStyleProps) {
  const Tag = as as React.ElementType
  // Flatten every segment into words while keeping each word's own styling.
  const words = segments.flatMap((segment) => {
    const segmentWords = segment.text.split(' ').filter(Boolean)
    return segmentWords.map((word, i) => ({
      word,
      className: segment.className ?? '',
      breakAfter: Boolean(segment.breakAfter) && i === segmentWords.length - 1,
    }))
  })

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  // Real spaces between words in normal inline flow — with flex items and
  // padding the heading's text content would read as one unbroken word.
  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map(({ word, className: wordClassName, breakAfter }, i) => (
        <Fragment key={`${word}-${i}`}>
          {i > 0 && ' '}
          <motion.span
            custom={i}
            variants={pullUpVariant}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
          {breakAfter && <br />}
        </Fragment>
      ))}
    </Tag>
  )
}
