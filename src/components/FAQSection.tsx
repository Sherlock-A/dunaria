export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  heading?: string;
}

export function FAQSection({ items, heading }: Props) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="border-t border-sand-300 pt-10 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {heading && (
        <h2 className="font-display text-2xl font-medium">{heading}</h2>
      )}
      <dl className="space-y-4">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-sand-300 bg-white px-5 py-4 open:bg-sand-100"
          >
            <summary className="cursor-pointer list-none font-medium text-night select-none flex items-center justify-between gap-4">
              {item.question}
              <span className="shrink-0 text-gold transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <dd className="mt-3 text-night-700 leading-relaxed">{item.answer}</dd>
          </details>
        ))}
      </dl>
    </section>
  );
}
