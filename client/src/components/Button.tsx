import React from 'react';

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'default' | 'small';
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  labelSuffix?: string;
}

export default function Button({
  label,
  icon,
  iconPosition = 'end',
  variant = 'primary',
  size = 'default',
  onClick,
  href,
  type = 'button',
  ariaLabel,
  className = '',
  disabled = false,
  labelSuffix,
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 relative flex-[0_0_auto] transition-all cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60";
  const sizeClasses = {
    default: 'px-6 py-3',
    small: 'px-3 py-1.5 text-small',
  };
  
  const variantClasses = {
    primary: `bg-primary-500 ${size === 'small' ? 'shadow-[3px_3px_0px_var(--color-primary-900)] hover:shadow-[1px_1px_0px_var(--color-primary-900)]' : 'shadow-[4px_4px_0px_var(--color-primary-900)] hover:shadow-[2px_2px_0px_var(--color-primary-900)]'} hover:translate-x-[2px] hover:translate-y-[2px]`,
    secondary: size === 'small'
      ? 'bg-background border border-neutral-300 shadow-[1px_1px_0px_var(--color-neutral-300)] hover:bg-neutral-50 hover:shadow-none'
      : 'bg-background border-2 border-neutral-950 shadow-[4px_4px_0px_var(--color-neutral-950)] hover:shadow-[2px_2px_0px_var(--color-neutral-950)] hover:translate-x-[2px] hover:translate-y-[2px]',
    tertiary: "inline-flex items-center text-small-upper tracking-widest text-neutral-950 hover:text-primary-500 transition-colors group",
    danger: size === 'small'
      ? 'bg-background border border-negative-400 text-negative-700 shadow-[1px_1px_0px_var(--color-negative-400)] hover:bg-negative-50 hover:shadow-none'
      : 'bg-background border-2 border-negative-700 text-negative-800 shadow-[4px_4px_0px_var(--color-negative-700)] hover:bg-negative-50 hover:shadow-[2px_2px_0px_var(--color-negative-700)] hover:translate-x-[2px] hover:translate-y-[2px]',
  };

  const tertiaryClasses = `${variantClasses.tertiary} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60`;

  const textClasses = {
    primary: "text-neutral-950",
    secondary: "text-neutral-950",
    tertiary: "text-neutral-950",
    danger: size === 'small' ? 'text-negative-700' : 'text-negative-800'
  };

  // If href is provided, render as a link (SSR-compatible)
  if (href && disabled) {
    return (
      <span
        className={`${variant === 'tertiary' ? tertiaryClasses : `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`} ${className}`}
        aria-label={ariaLabel}
        aria-disabled="true"
      >
        {icon && <span className="flex items-center" aria-hidden="true">{icon}</span>}
        <span className={`text-small-bold ${textClasses[variant]} whitespace-nowrap`}>
          {label}
          {labelSuffix && <span className="sr-only">{labelSuffix}</span>}
        </span>
      </span>
    );
  }

  if (href) {
    if (variant === 'tertiary') {
      return (
        <a
          href={href}
          className={`${tertiaryClasses} ${className}`}
          aria-label={ariaLabel}
        >
          <span className={`inline-flex items-center ${iconPosition === 'start' ? 'flex-row-reverse gap-2' : ''}`}>
            {label}
            {labelSuffix && (
              <span className="sr-only">
                {labelSuffix}
              </span>
            )}
            {icon && (
              <span className={`inline-flex transition-transform ${iconPosition === 'start' ? 'group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'}`} aria-hidden="true">
                {icon}
              </span>
            )}
          </span>
        </a>
      );
    }

    return (
      <a
        href={href}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        aria-label={ariaLabel}
      >
        {icon && (
          <span className="flex items-center" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={`text-small-bold ${textClasses[variant]} whitespace-nowrap`}>
          {label}
          {labelSuffix && (
            <span className="sr-only">
              {labelSuffix}
            </span>
          )}
        </span>
      </a>
    );
  }

  // Otherwise render as a button (only use onClick if provided)
  if (variant === 'tertiary') {
    return (
      <button
        type={type}
        className={`${tertiaryClasses} ${className}`}
        onClick={onClick}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <span className={`inline-flex items-center ${iconPosition === 'start' ? 'flex-row-reverse gap-2' : ''}`}>
          {label}
          {labelSuffix && (
            <span className="sr-only">
              {labelSuffix}
            </span>
          )}
          {icon && (
            <span className={`inline-flex transition-transform ${iconPosition === 'start' ? 'group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'}`} aria-hidden="true">
              {icon}
            </span>
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {icon && (
        <span className="flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={`text-small-bold ${textClasses[variant]} whitespace-nowrap`}>
        {label}
        {labelSuffix && (
          <span className="sr-only">
            {labelSuffix}
          </span>
        )}
      </span>
    </button>
  );
}
