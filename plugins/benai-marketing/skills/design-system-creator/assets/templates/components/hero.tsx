/**
 * Hero — marketing hero section.
 *
 * Rules:
 *   1. One headline. 6–12 words. Sentence case.
 *   2. One subhead. Max 28 words. Max width 520px.
 *   3. Primary CTA + optional secondary.
 *   4. Optional real photograph on the right (never AI / stock).
 */
import * as React from 'react';
import { Button } from './button';
import { cn } from './utils';

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  overline?: string;
  headline: string;
  subhead?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: { src: string; alt: string };
}

export const Hero: React.FC<HeroProps> = ({
  overline,
  headline,
  subhead,
  primaryCta,
  secondaryCta,
  image,
  className,
  ...props
}) => (
  <section className={cn('bg-paper py-24 md:py-16', className)} {...props}>
    <div className={cn(
      'max-w-container mx-auto px-6 grid gap-12 items-center',
      image ? 'md:grid-cols-2' : 'md:grid-cols-1'
    )}>
      <div className={cn('flex flex-col', image ? '' : 'max-w-[760px] mx-auto text-center items-center')}>
        {overline && (
          <p className="text-overline text-brand-600 mb-3 uppercase tracking-[0.06em]">{overline}</p>
        )}
        <h1 className="text-display-lg text-ink-900">{headline}</h1>
        {subhead && (
          <p className={cn(
            'text-body-lg text-ink-700 mt-5',
            image ? 'max-w-hero-subcopy' : 'max-w-[580px] mx-auto'
          )}>
            {subhead}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button as="a" href={primaryCta.href} variant="primary" size="lg">{primaryCta.label}</Button>
          {secondaryCta && (
            <Button as="a" href={secondaryCta.href} variant="ghost" size="lg">{secondaryCta.label}</Button>
          )}
        </div>
      </div>
      {image && (
        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-ink-100">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      )}
    </div>
  </section>
);
