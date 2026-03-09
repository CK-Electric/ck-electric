import React from 'react';

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SocialLinksProps {
  socialLinks: SocialLink[];
  title?: string;
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
  className?: string;
  titleClassName?: string;
  containerClassName?: string;
  linkClassName?: string;
}

export default function SocialLinks({
  socialLinks,
  title = "Follow Us",
  titleAs: TitleTag = "h4",
  className = "space-y-4",
  titleClassName = "text-base-bold text-white",
  containerClassName = "flex gap-3",
  linkClassName = "w-10 h-10 bg-neutral-800 text-warning-500 hover:bg-warning-500 hover:text-white rounded-full flex items-center justify-center transition-colors"
}: SocialLinksProps) {
  return (
    <div className={className}>
      <TitleTag className={titleClassName}>{title}</TitleTag>
      <div className={containerClassName}>
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            className={linkClassName}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
