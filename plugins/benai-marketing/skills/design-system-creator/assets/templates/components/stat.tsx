/**
 * Stat — big-number block.
 *
 * Use for case-study numbers, homepage stat bars, or infographic
 * embeds. Always cite a source below or link to one.
 */
import * as React from 'react';
import { cn } from './utils';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;                 // "34%" | "4 hours" | "$12,400"
  label: string;                 // "fewer no-shows in 8 weeks"
  source?: string;               // "Ashley's Salon, Allentown PA"
  align?: 'left' | 'center';
}

export const Stat: React.FC<StatProps> = ({
  value, label, source, align = 'left', className, ...props
}) => (
  <div
    className={cn(
      'flex flex-col gap-3',
      align === 'center' && 'items-center text-center',
      className
    )}
    {...props}
  >
    <div className="text-display-lg text-brand-600 leading-none tracking-[-0.02em] font-semibold">
      {value}
    </div>
    <div className="text-body-md text-ink-700 max-w-[28ch]">{label}</div>
    {source && <div className="text-caption text-ink-500">— {source}</div>}
  </div>
);
