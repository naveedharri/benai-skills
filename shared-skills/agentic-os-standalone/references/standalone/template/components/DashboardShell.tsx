"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";

export interface NavItem {
  key: string;
  label: string;
  icon?: string;     // emoji or text
  active?: boolean;
  href?: string;     // if set, renders as a link instead of view-switcher
}

export interface SidebarSection {
  label: string;
  items: NavItem[];
}

export interface TopAction {
  label: string;
  icon?: string;
  variant?: "default" | "primary" | "accent" | "blue";
  onClick?: () => void;
  href?: string;
  node?: ReactNode;   // if set, render this instead of the default button/link
}

export interface ShellProps {
  eyebrow: string;
  title: string;
  brandLabel: string;
  brandSub?: string;
  brandAvatar?: string;       // url
  brandInitial?: string;
  backHref?: string;
  sections: SidebarSection[];
  footerItems?: NavItem[];
  topActions?: TopAction[];
  views: { key: string; label: string; node: ReactNode }[];
  defaultView?: string;
}

export function DashboardShell(props: ShellProps) {
  const initial = props.defaultView || props.views[0]?.key;
  const [active, setActive] = useState(initial);

  return (
    <div className="cc-root">
      <div className="cc-app">
        <aside className="cc-sidebar">
          <div className="cc-brand">
            <div className="cc-brand-mark">
              {props.brandAvatar
                ? <img src={props.brandAvatar} alt={props.brandLabel} />
                : (props.brandInitial || props.brandLabel.slice(0, 1))}
            </div>
            <div>
              <div className="cc-brand-text">{props.brandLabel}</div>
              {props.brandSub && <span className="cc-brand-sub">{props.brandSub}</span>}
            </div>
          </div>

          {props.backHref && (
            <Link className="cc-nav-btn cc-nav-back" href={props.backHref}>
              <span className="cc-icon">←</span>
              <span className="cc-nav-label">Back to Home</span>
            </Link>
          )}

          {props.sections.map((section, si) => (
            <div key={si}>
              <div className="cc-nav-section">{section.label}</div>
              <div className="cc-nav">
                {section.items.map(item => (
                  <button
                    key={item.key}
                    className={`cc-nav-btn ${active === item.key ? "active" : ""}`}
                    onClick={() => setActive(item.key)}
                  >
                    {item.icon && <span className="cc-icon">{item.icon}</span>}
                    <span className="cc-nav-label">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="cc-nav-spacer" />

          {props.footerItems && props.footerItems.length > 0 && (
            <div className="cc-nav-footer">
              <div className="cc-nav-divider" />
              {props.footerItems.map(item => (
                item.href ? (
                  <Link key={item.key} className="cc-nav-btn" href={item.href}>
                    {item.icon && <span className="cc-icon">{item.icon}</span>}
                    <span className="cc-nav-label">{item.label}</span>
                  </Link>
                ) : (
                  <button key={item.key} className="cc-nav-btn">
                    {item.icon && <span className="cc-icon">{item.icon}</span>}
                    <span className="cc-nav-label">{item.label}</span>
                  </button>
                )
              ))}
            </div>
          )}
        </aside>

        <main className="cc-shell">
          <div className="cc-topbar">
            <div className="cc-title-group">
              <div className="cc-eyebrow">{props.eyebrow}</div>
              <h1 className="cc-title">{props.title}</h1>
            </div>
            {props.topActions && props.topActions.length > 0 && (
              <div className="cc-top-actions">
                {props.topActions.map((a, i) => {
                  if (a.node) return <span key={i}>{a.node}</span>;
                  const cls = `cc-btn ${
                    a.variant === "primary" ? "cc-btn-primary" :
                    a.variant === "accent" ? "cc-btn-accent" :
                    a.variant === "blue" ? "cc-btn-blue" : ""
                  }`;
                  if (a.href) return (
                    <Link key={i} className={cls} href={a.href}>
                      {a.icon && <span className="cc-btn-ico">{a.icon}</span>}
                      <span>{a.label}</span>
                    </Link>
                  );
                  return (
                    <button key={i} className={cls} onClick={a.onClick}>
                      {a.icon && <span className="cc-btn-ico">{a.icon}</span>}
                      <span>{a.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="cc-main">
            {props.views.map(v => (
              <section key={v.key} className="cc-view" data-active={active === v.key}>
                {active === v.key && v.node}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
