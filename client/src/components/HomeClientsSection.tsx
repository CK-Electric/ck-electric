import ClientLogo from './ClientLogo';
import type { ClientsData } from '../lib/wordpress-types';

interface Props {
  clientsData: ClientsData | null;
}

export default function HomeClientsSection({ clientsData }: Props) {
  const clients = clientsData?.clients?.nodes;
  if (!clients || clients.length === 0) return null;

  return (
    <section className="py-24 bg-white" aria-label="Our clients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-primary-800 font-black text-xs tracking-[0.4em] uppercase mb-4 md:text-sm lg:text-base">Our Clients</h2>
          <h3 className="testimonials-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">Trusted by Industry Leaders</h3>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-x items-center" aria-hidden="true">
            {clients.map((client, index) => (
              <div key={index} className="flex-shrink-0 px-4 flex items-center justify-center">
                <ClientLogo
                  title={client.title}
                  imageUrl={client.featuredImage?.node?.mediaItemUrl || ''}
                  clientUrl={client.data.clientUrl}
                  tabIndex={-1}
                />
              </div>
            ))}
            {clients.map((client, index) => (
              <div key={`dup-${index}`} className="flex-shrink-0 px-4 flex items-center justify-center">
                <ClientLogo
                  title={client.title}
                  imageUrl={client.featuredImage?.node?.mediaItemUrl || ''}
                  clientUrl={client.data.clientUrl}
                  tabIndex={-1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
