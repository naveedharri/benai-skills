/**
 * Input & Textarea — {{BRAND_NAME}} form fields.
 *
 * Rules:
 * - Labels, not placeholders. Placeholders are hints only.
 * - Errors: text + icon + color. Never color alone.
 * - Radius: md (10px). Never pill.
 * - Focus ring: brand/600 at 40% alpha, 2px, with offset.
 */
import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from './utils';

type FieldBase = {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
};

/* ── Input ─────────────────────────────────────────────── */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    FieldBase {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, required, ...props }, ref) => {
    const inputId = id || React.useId();
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-body-sm font-medium text-ink-700">
          {label}
          {required && <span className="text-danger-600 ml-1" aria-hidden>*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'w-full px-4 py-3 text-body-md text-ink-900 bg-surface',
            'border border-ink-200 rounded-md',
            'placeholder:text-ink-400',
            'transition-all duration-sm ease-out',
            'focus:border-brand-600 focus:outline-none',
            'focus-visible:ring-2 focus-visible:ring-brand-600/40',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-paper',
            error && 'border-danger-600 focus:border-danger-600 focus-visible:ring-danger-600/40',
            className
          )}
          {...props}
        />
        {hint && !error && <p id={hintId} className="text-body-sm text-ink-500">{hint}</p>}
        {error && (
          <p id={errorId} className="flex items-center gap-1.5 text-body-sm text-danger-600">
            <AlertCircle size={16} strokeWidth={1.75} aria-hidden />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

/* ── Textarea ──────────────────────────────────────────── */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldBase {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, required, rows = 4, ...props }, ref) => {
    const tid = id || React.useId();
    const hintId = hint ? `${tid}-hint` : undefined;
    const errorId = error ? `${tid}-error` : undefined;
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={tid} className="text-body-sm font-medium text-ink-700">
          {label}
          {required && <span className="text-danger-600 ml-1" aria-hidden>*</span>}
        </label>
        <textarea
          ref={ref}
          id={tid}
          rows={rows}
          required={required}
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'w-full px-4 py-3 text-body-md text-ink-900 bg-surface resize-y',
            'border border-ink-200 rounded-md',
            'placeholder:text-ink-400',
            'transition-all duration-sm ease-out',
            'focus:border-brand-600 focus:outline-none',
            'focus-visible:ring-2 focus-visible:ring-brand-600/40',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-paper',
            error && 'border-danger-600 focus:border-danger-600 focus-visible:ring-danger-600/40',
            className
          )}
          {...props}
        />
        {hint && !error && <p id={hintId} className="text-body-sm text-ink-500">{hint}</p>}
        {error && (
          <p id={errorId} className="flex items-center gap-1.5 text-body-sm text-danger-600">
            <AlertCircle size={16} strokeWidth={1.75} aria-hidden />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
