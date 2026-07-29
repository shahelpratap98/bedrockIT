/**
 * Structured data. Rendered into the markup so it is present in the
 * prerendered HTML, where crawlers will actually see it.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
