/**
 * Card — surface container on paper.
 *
 * Default: surface white, radius-lg, no shadow. Hover adds shadow-xs.
 * Use `variant="elevated"` for a card that starts with shadow-xs.
 * Use `variant="ghost"` for paper-background cards with only a hairline.
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const card = cva(
  'block transition-all duration-md ease-out',
  {
    variants: {
      variant: {
        default:  'bg-surface border border-line-soft rounded-lg hover:shadow-xs',
        elevated: 'bg-surface border border-line-soft rounded-lg shadow-xs hover:shadow-sm',
        ghost:    'bg-transparent border border-line rounded-lg',
        filled:   'bg-brand-50 border border-brand-100 rounded-lg',
      },
      padding: {
        none: 'p-0',
        sm:   'p-4',
        md:   'p-6',
        lg:   'p-8',
      },
    },
    defaultVariants: { variant: 'default', padding: 'md' },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof card> {
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, as: Comp = 'div', ...props }, ref) => (
    <Comp ref={ref} className={cn(card({ variant, padding }), className)} {...props} />
  )
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn('flex flex-col gap-1.5 mb-4', className)} {...p} />
);
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...p }) => (
  <h3 className={cn('text-h4 text-ink-900', className)} {...p} />
);
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...p }) => (
  <p className={cn('text-body-sm text-ink-600', className)} {...p} />
);
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn('text-body-md text-ink-700', className)} {...p} />
);
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...p }) => (
  <div className={cn('flex items-center gap-3 mt-6 pt-4 border-t border-line-soft', className)} {...p} />
);
