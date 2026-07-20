/**
 * Testimonial / Case Study block — real owner, real city, real number.
 *
 * Always include: name, role or business, city, and one concrete outcome.
 * Photo is optional but strongly preferred — a real person, not stock.
 */
import * as React from 'react';
import { cn } from './utils';

export interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string;
  attribution: {
    name: string;
    role?: string;
    business: string;
    city: string;
    avatar?: string;
  };
  outcome?: { label: string; value: string };
}

export const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  attribution,
  outcome,
  className,
  ...props
}) => (
  <figure
    className={cn(
      'bg-surface rounded-lg p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-10 items-start',
      className
    )}
    {...props}
  >
    <div className="flex flex-col gap-8">
      <blockquote className="text-h2 text-ink-900 leading-[1.3] tracking-[-0.015em]">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-4">
        {attribution.avatar && (
          <img
            src={attribution.avatar}
            alt=""
            className="w-12 h-12 rounded-full object-cover bg-ink-100"
          />
        )}
        <div className="text-body-md">
          <div className="text-ink-900 font-medium">{attribution.name}</div>
          <div className="text-ink-600">
            {attribution.role && `${attribution.role}, `}
            {attribution.business} · {attribution.city}
          </div>
        </div>
      </figcaption>
    </div>

    {outcome && (
      <aside className="bg-brand-50 rounded-md p-6 min-w-[220px] border border-brand-100">
        <div className="text-display-lg text-brand-600 leading-none tracking-[-0.02em]">
          {outcome.value}
        </div>
        <div className="text-body-sm text-ink-700 mt-3">{outcome.label}</div>
      </aside>
    )}
  </figure>
);
