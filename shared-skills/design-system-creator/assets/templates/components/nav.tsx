/**
 * Nav — top bar with mark + links + CTA.
 *
 * Sticky after 80px scroll. On `paper` by default; gets a `shadow/xs`
 * backdrop after sticking. Mobile: hamburger → full-screen drawer.
 */
import * as React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

export interface NavLink { label: string; href: string; }

export interface NavProps extends React.HTMLAttributes<HTMLElement> {
  links: NavLink[];
  cta: { label: string; href: string };
  logo: React.ReactNode;
}

export const Nav: React.FC<NavProps> = ({ links, cta, logo, className, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const [stuck, setStuck] = React.useState(false);

  React.useEffect(() => {
    const on = () => setStuck(window.scrollY > 80);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-md ease-out',
        stuck ? 'bg-surface/95 backdrop-blur border-b border-line-soft shadow-xs' : 'bg-transparent',
        className
      )}
      {...props}
    >
      <div className="max-w-container mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
        <a href="/" className="flex items-center" aria-label="{{BRAND_NAME}} home">{logo}</a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-body-md font-medium text-ink-700 hover:text-ink-900 transition-colors duration-xs"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button as="a" href={cta.href} variant="primary" size="md">{cta.label}</Button>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-ink-900"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-paper z-30 p-6 flex flex-col gap-6 animate-in fade-in duration-md">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-h3 text-ink-900" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="mt-4">
            <Button as="a" href={cta.href} variant="primary" size="lg" className="w-full">{cta.label}</Button>
          </div>
        </div>
      )}
    </header>
  );
};
