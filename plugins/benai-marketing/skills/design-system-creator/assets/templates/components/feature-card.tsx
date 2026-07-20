/**
 * FeatureCard — icon chip + title + body.
 *
 * Used in "Why us" / feature-grid sections. Always 40×40 chip with
 * brand/100 background and brand/600 icon. Keep chips consistent across
 * a single page.
 */
import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from './card';
import { cn } from './utils';

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, body, className, ...props }) => (
  <Card variant="default" padding="lg" className={cn('flex flex-col gap-5', className)} {...props}>
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-brand-100 text-brand-600">
      <Icon size={20} strokeWidth={1.5} aria-hidden />
    </div>
    <div className="flex flex-col gap-2">
      <h3 className="text-h4 text-ink-900">{title}</h3>
      <p className="text-body-md text-ink-600">{body}</p>
    </div>
  </Card>
);
