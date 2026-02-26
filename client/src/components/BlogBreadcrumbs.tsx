import React from 'react';

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <nav aria-label="Breadcrumb" className="flex text-small-upper tracking-widest text-neutral-950/50">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.href ? (
                <li>
                  <a className="hover:text-primary-500 transition-colors" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ) : (
                <li className="text-primary-500">{item.label}</li>
              )}
              {index < items.length - 1 && <li>/</li>}
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
}
