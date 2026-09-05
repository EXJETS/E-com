/**
 * Renders a JSON-LD block. `<` is escaped to its unicode form so a value that
 * happens to contain markup cannot break out of the script tag.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
