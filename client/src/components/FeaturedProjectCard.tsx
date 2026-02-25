interface FeaturedProjectCardProps {
  title: string;
  location: string;
  imageUrl: string;
  position?: 'top' | 'center' | 'bottom';
  hasBackground?: boolean;
}

export default function FeaturedProjectCard({
  title,
  location,
  imageUrl,
  position = 'center',
  hasBackground = false
}: FeaturedProjectCardProps) {
  const positionClasses = {
    top: 'md:translate-y-12',
    center: '',
    bottom: 'md:-translate-y-12'
  };

  const locationColorClass = hasBackground ? 'text-white' : 'text-primary-500';

  return (
    <div className={`group relative overflow-hidden aspect-[4/5] ${positionClasses[position]} ${hasBackground ? 'bg-primary-500' : ''}`}>
      <img 
        alt={title} 
        className={`w-full h-full object-cover ${hasBackground ? 'mix-blend-multiply opacity-80 group-hover:opacity-100' : 'grayscale group-hover:grayscale-0'} transition-all duration-1000`} 
        src={imageUrl}
      />
      <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/10 transition-colors"></div>
      <div className="absolute bottom-0 left-0 p-10">
        <p className={`${locationColorClass} text-[10px] font-black uppercase tracking-[0.3em] mb-2`}>{location}</p>
        <h4 className="text-display-4 font-black text-white">{title}</h4>
      </div>
    </div>
  );
}
