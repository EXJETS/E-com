import { Star } from "lucide-react";
import type { Review } from "@/lib/reviews";

export function Stars({ count = 5, size = 15 }: { count?: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} className="fill-ember-500 text-ember-500" aria-hidden="true" />
      ))}
    </span>
  );
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="card flex h-full flex-col p-6">
      <Stars />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-body">
        “{review.quote}”
      </blockquote>
      <figcaption className="mt-5 border-t border-line-soft pt-4">
        <span className="block text-[14px] font-semibold text-ink">{review.attribution}</span>
        <span className="mt-0.5 block text-[13px] text-muted">
          {review.service} · {review.city}
        </span>
      </figcaption>
    </figure>
  );
}
