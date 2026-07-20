/**
 * Badge — small category / status pill.
 *
 * Use for: vertical tags ("Dental", "Salon"), status ("Live", "Setup"), metadata.
 * Not for: primary CTAs, navigation, anything interactive beyond a click-through.
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const badge = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-ink-100 text-ink-700',
        brand:   'bg-brand-100 text-brand-700',
        success: 'bg-success-100 text-success-600',
        warn:    'bg-warn-100 text-warn-600',
        danger:  'bg-danger-100 text-danger-600',
        outline: 'bg-transparent border border-line text-ink-700',
      },
    },
    defaultVariants: { tone: 'neutral' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export const Badge: React.FC<BadgeProps> = ({ className, tone, ...p }) => (
  <span className={cn(badge({ tone }), className)} {...p} />
);
