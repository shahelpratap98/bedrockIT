import { Star } from 'lucide-react'
import Reveal from './Reveal'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import { REVIEWS } from '../data/reviews'

export default function Reviews() {
  return (
    <section className="bg-black px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <WordsPullUpMultiStyle
          as="h2"
          className="mx-auto max-w-2xl text-center text-xl font-normal leading-tight sm:text-2xl md:text-3xl lg:text-4xl"
          style={{ color: '#E1E0CC' }}
          segments={[
            { text: 'What our clients say.', className: '', breakAfter: true },
            { text: 'In their words, not ours.', className: 'text-gray-500' },
          ]}
        />

        <div className="mt-12 grid grid-cols-1 gap-3 md:mt-16 md:grid-cols-2 md:gap-1">
          {REVIEWS.map((review, i) => (
            <Reveal key={review.author} index={i} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl bg-[#212121] p-6 sm:p-8">
                <div
                  className="flex gap-1"
                  role="img"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: review.rating }, (_, star) => (
                    <Star key={star} className="h-4 w-4 fill-[#C9A227] text-[#C9A227]" />
                  ))}
                </div>

                <blockquote
                  className="mt-6 font-serif text-lg italic leading-snug sm:text-xl md:text-2xl"
                  style={{ color: '#E1E0CC' }}
                >
                  {review.quote}
                </blockquote>

                <figcaption className="mt-auto pt-8 text-[10px] uppercase tracking-[0.2em] text-primary">
                  {review.author} — {review.source}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
