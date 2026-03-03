interface TestimonialCardProps {
  quote: string;
  clientName: string;
  clientTitle?: string;
  clientLocation: string;
  initials: string;
  borderColor?: 'primary' | 'neutral';
}

export default function TestimonialCard({
  quote,
  clientName,
  clientTitle,
  clientLocation,
  initials,
  borderColor = 'primary'
}: TestimonialCardProps) {
  const borderClass = borderColor === 'primary' ? 'border-primary-500' : 'border-neutral-600';

  return (
    <div className={`relative p-12 bg-white shadow-xl border-t-8 ${borderClass}`}>
      <span className="text-primary-500 text-7xl absolute top-6 right-6 opacity-30">"</span>
      <p className="text-xl italic text-neutral-700 leading-relaxed mb-10 relative z-10">
        {quote}
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-950 rounded-full flex items-center justify-center font-black text-primary-500">
          <span>{initials}</span>
        </div>
        <div>
          <p className="text-neutral-950 font-black uppercase text-xs tracking-widest">{clientName}</p>
          <p className="text-primary-500 text-[10px] font-bold uppercase">
            {clientTitle && `${clientTitle}, `}{clientLocation}
          </p>
        </div>
      </div>
    </div>
  );
}
