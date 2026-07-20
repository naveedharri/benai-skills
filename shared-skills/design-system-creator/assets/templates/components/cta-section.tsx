/**
 * CtaSection — closing call-to-action band.
 *
 * Full-width brand/900 background. One headline, one primary CTA.
 * Use once per page, near the bottom.
 */
import * as React from 'react';
import { Button } from './button';
import { cn } from './utils';

export interface CtaSectionProps extends React.HTMLAttributes<HTMLElement> {
  headline: string;
  subhead?: string;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  variant?: 'dark' | 'light';
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  headline, subhead, cta, secondary, variant = 'dark', className, ...props
}) => (
  <section
    className={cn(
      'py-24 md:py-16',
      variant === 'dark'  ? 'bg-brand-900 text-paper'  : 'bg-brand-50 text-ink-900',
      className
    )}
    {...props}
  >
    <div className="max-w-container mx-auto px-6 text-center flex flex-col items-center">
      <h2
        className={cn(
          'text-display-lg tracking-[-0.02em] max-w-[820px]',
          variant === 'dark' ? 'text-paper' : 'text-ink-900'
        )}
      >
        {headline}
      </h2>
      {subhead && (
        <p
          className={cn(
            'text-body-lg mt-5 max-w-[580px]',
            variant === 'dark' ? 'text-brand-200' : 'text-ink-700'
          )}
        >
          {subhead}
        </p>
      )}
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Button
          as="a"
          href={cta.href}
          variant={variant === 'dark' ? 'secondary' : 'primary'}
          size="lg"
          className={variant === 'dark' ? 'bg-paper text-ink-900 border-transparent hover:bg-white' : ''}
        >
          {cta.label}
        </Button>
        {secondary && (
          <Button
            as="a"
            href={secondary.href}
            variant="link"
            size="lg"
            className={variant === 'dark' ? 'text-brand-200 hover:text-paper' : ''}
          >
            {secondary.label}
          </Button>
        )}
      </div>
    </div>
  </section>
);
