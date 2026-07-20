/**
 * Motion primitives — {{BRAND_NAME}}'s quiet take on 21st.dev / shadcn-style
 * motion components. All respect `prefers-reduced-motion`.
 *
 * Exports:
 *   - FadeIn          — on-viewport fade + 8px translate-up reveal
 *   - Stagger         — staggers children with FadeIn (max 5 children)
 *   - CountUp         — animated number counter (driven by IntersectionObserver)
 *   - Spotlight       — faint brand-colored spotlight wash behind a hero
 *   - QuietMarquee    — slow, low-contrast logo row (for "as seen in" bands)
 *
 * Use at most ONE of these per viewport. If you're tempted to nest two,
 * reconsider.
 */
import * as React from 'react';
import { cn } from './utils';

/* ── FadeIn ──────────────────────────────────────────── */
export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  as?: React.ElementType;
}
export const FadeIn: React.FC<FadeInProps> = ({
  delay = 0, as: Comp = 'div', className, children, ...props
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <Comp
      ref={ref}
      className={cn(
        'transition-all duration-lg ease-out motion-reduce:transition-none',
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Comp>
  );
};

/* ── Stagger ─────────────────────────────────────────── */
export const Stagger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children, className, ...props
}) => {
  const arr = React.Children.toArray(children).slice(0, 10);
  return (
    <div className={className} {...props}>
      {arr.map((child, i) => (
        <FadeIn key={i} delay={Math.min(i, 4) * 60}>{child}</FadeIn>
      ))}
    </div>
  );
};

/* ── CountUp ─────────────────────────────────────────── */
export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}
export const CountUp: React.FC<CountUpProps> = ({
  to, duration = 1200, decimals = 0, prefix = '', suffix = '', className, ...props
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setValue(to); return; }

    let raf = 0; let start = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const step = (ts: number) => {
          if (!start) start = ts;
          const t = Math.min(1, (ts - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);  // ease-out cubic
          setValue(to * eased);
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        io.disconnect();
      });
    }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);

  return (
    <span ref={ref} className={className} {...props}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
};

/* ── Spotlight ───────────────────────────────────────── */
export const Spotlight: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    aria-hidden
    className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    {...props}
  >
    <div
      className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full blur-3xl opacity-40"
      style={{ background: 'radial-gradient(ellipse at center, #EAF0FD 0%, transparent 60%)' }}
    />
  </div>
);

/* ── QuietMarquee ────────────────────────────────────── */
export interface QuietMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  speed?: number;   // seconds per full loop; default 40
}
export const QuietMarquee: React.FC<QuietMarqueeProps> = ({
  items, speed = 40, className, ...props
}) => {
  const duplicated = [...items, ...items];
  return (
    <div
      className={cn('relative overflow-hidden motion-reduce:overflow-auto', className)}
      {...props}
    >
      <div
        className="flex gap-16 items-center whitespace-nowrap motion-reduce:animate-none"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {duplicated.map((item, i) => (
          <div key={i} className="opacity-60 grayscale">{item}</div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
