export interface Review {
  /** Quoted verbatim, trimmed only at a sentence boundary. Never paraphrased. */
  quote: string
  author: string
  /** Where the review was left, shown so the claim is checkable. */
  source: string
  /** Out of five. */
  rating: number
}

/**
 * Real Google reviews. The originals run longer than these quotes — each is cut
 * at a sentence boundary, never reworded, so nothing here claims more than the
 * reviewer actually wrote.
 */
export const REVIEWS: Review[] = [
  {
    quote:
      'I would 110% recommend their services. Shahel was very understanding with our business requirements.',
    author: 'Jagruti G.',
    source: 'Google review',
    rating: 5,
  },
  {
    quote:
      'It was a pleasure working with Shahel. He did an excellent job designing the website for my business.',
    author: 'Gajanthan V.',
    source: 'Google review',
    rating: 5,
  },
]
