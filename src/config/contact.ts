/** Single source of truth for how people reach BedRock IT. */
export const CONTACT = {
  phoneDisplay: '+64 21 0235 5670',
  phoneHref: 'tel:+642102355670',
  whatsappNumber: '642102355670',
  email: 'shahel.pratap98@gmail.com',
}

const WHATSAPP_MESSAGE = 'Hi BedRock IT — I would like to book a call about our IT setup.'

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`

export const EMAIL_HREF = `mailto:${CONTACT.email}`
