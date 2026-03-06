import React from 'react';
import { ArrowRightAlt } from '@mui/icons-material';
import Button from './Button';
import { ServiceNode } from '@/lib/wordpress-types';

interface ServiceCardProps {
  icon?: React.ReactNode;
  service?: ServiceNode;
  title?: string;
  description?: string;
  link?: string;
}

export default function ServiceCard({
  icon,
  service,
  title,
  description,
  link,
}: ServiceCardProps) {
  // Use WordPress data if available, otherwise use fallback props
  const serviceTitle = service?.title || title || "Service Title";
  const serviceDescription = service?.servicesFields?.smallDescription || description || "Service description";
  const serviceLink = link || (service ? `/services/${service.slug}` : "#");
  
  return (
    <div className="group relative bg-white p-10 hover:-translate-y-2 transition-all duration-300 border-b-8 border-primary-500">
      <div className="w-16 h-16 bg-neutral-950 text-primary-500 flex items-center justify-center mb-8">
        {icon}
      </div>
      <h4 className="text-display-4 text-neutral-950 mb-4">{serviceTitle}</h4>
      <p className="text-neutral-700 text-small leading-relaxed mb-8">{serviceDescription}</p>
      <Button
        label="Learn More"
        icon={<ArrowRightAlt />}
        variant="tertiary"
        href={serviceLink}
      />
    </div>
  );
}
