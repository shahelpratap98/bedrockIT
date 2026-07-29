import { ArrowRight } from 'lucide-react'
import { WHATSAPP_URL } from '../config/contact'

interface BookCallButtonProps {
  /** Slightly larger type and circle, used on the hero. */
  large?: boolean
  label?: string
  className?: string
}

/** Opens a pre-filled WhatsApp chat. Styling matches the original CTA exactly. */
export default function BookCallButton({
  large = false,
  label = 'Book a call',
  className = '',
}: BookCallButtonProps) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 font-medium text-black transition-all duration-300 hover:gap-3 ${
        large ? 'text-sm sm:text-base' : 'text-sm'
      } ${className}`}
    >
      {label}
      <span
        className={`flex items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110 ${
          large ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-9 w-9'
        }`}
      >
        <ArrowRight className="h-4 w-4" style={{ color: '#E1E0CC' }} />
      </span>
    </a>
  )
}
