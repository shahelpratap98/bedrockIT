/** Single source of truth for how people reach BedRock IT. */
export const CONTACT = {
  phoneDisplay: '+64 21 0235 5670',
  phoneHref: 'tel:+642102355670',
  whatsappNumber: '642102355670',
  email: 'shahel.pratap98@gmail.com',
  /** Facebook page id — the same page the Messenger ads point at. */
  messengerPageId: '1353401744516814',
}

const WHATSAPP_MESSAGE = 'Hi BedRock IT — I would like to book a call about our IT setup.'

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`

/** Opens a Messenger thread with the BedRock It Services page. */
export const MESSENGER_URL = `https://m.me/${CONTACT.messengerPageId}`

export const EMAIL_HREF = `mailto:${CONTACT.email}`
