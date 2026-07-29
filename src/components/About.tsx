import { Fragment, useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'

const BODY_TEXT =
  'For the last seven years we have kept systems running for businesses that cannot afford downtime, from first-line support and device rollouts to cloud migrations and security hardening. Our clients stay because nothing falls over, and on the rare day it does, we are already on it.'

interface AnimatedLetterProps {
  char: string
  index: number
  totalChars: number
  progress: MotionValue<number>
}

/** One character whose opacity is driven by the section's scroll progress. */
function AnimatedLetter({ char, index, totalChars, progress }: AnimatedLetterProps) {
  const charProgress = index / totalChars
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1])

  return <motion.span style={{ opacity }}>{char}</motion.span>
}

export default function About() {
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const totalChars = BODY_TEXT.length

  // Words stay whole so the paragraph still wraps, while each character keeps
  // its own scroll-linked opacity.
  let charIndex = 0
  const words = BODY_TEXT.split(' ').map((word) => {
    const start = charIndex
    charIndex += word.length + 1
    return { word, start }
  })

  return (
    <section className="bg-black px-4 py-20 sm:px-6 md:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-5 py-16 text-center sm:px-8 md:rounded-[2rem] md:px-12 md:py-24">
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">Managed IT</p>

        <WordsPullUpMultiStyle
          className="mx-auto mt-8 max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          style={{ color: '#E1E0CC' }}
          segments={[
            { text: 'We are BedRock IT,', className: 'font-normal' },
            { text: 'a managed services team.', className: 'italic font-serif' },
            {
              text: 'We look after the networks, cloud and security your business runs on.',
              className: 'font-normal',
            },
          ]}
        />

        <p
          ref={paragraphRef}
          className="mx-auto mt-10 max-w-2xl text-xs leading-relaxed text-[#DEDBC8] sm:text-sm md:mt-14 md:text-base"
        >
          {words.map(({ word, start }, wordIndex) => (
            <Fragment key={wordIndex}>
              <span className="inline-block whitespace-nowrap">
                {word.split('').map((char, i) => (
                  <AnimatedLetter
                    key={i}
                    char={char}
                    index={start + i}
                    totalChars={totalChars}
                    progress={scrollYProgress}
                  />
                ))}
              </span>
              {wordIndex < words.length - 1 && ' '}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
