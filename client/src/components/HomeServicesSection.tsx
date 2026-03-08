import {
  CorporateFare,
  ElectricBolt,
  GridView,
  Light,
  ChargingStation,
  Construction,
} from '@mui/icons-material';
import Button from './Button';
import ServiceCard from './ServiceCard';
import type { ServicesResponse } from '../lib/wordpress-types';

interface Props {
  servicesData: ServicesResponse | null;
}

export default function HomeServicesSection({ servicesData }: Props) {
  return (
    <section className="py-32 bg-primary-100 md:clip-diagonal-reverse" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-24">
          <h2 className="text-primary-800 text-base-upper mb-4 md:text-lg lg:text-xl">What We Do</h2>
          <h3 className="services-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">Full-Spectrum Services</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {servicesData?.services?.nodes && servicesData.services.nodes.length > 0
            ? servicesData.services.nodes.slice(0, 6).map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  icon={<ElectricBolt className="text-4xl" />}
                />
              ))
            : (
              <>
                <ServiceCard icon={<CorporateFare className="text-4xl" />} title="Commercial TIs" description="Expert build-outs and improvements for retail, office, and industrial spaces across the corridor." link="/services" />
                <ServiceCard icon={<ElectricBolt className="text-4xl" />} title="Wiring & Rewiring" description="Modernizing outdated electrical systems for safety, efficiency, and code compliance." link="/services" />
                <ServiceCard icon={<GridView className="text-4xl" />} title="Panel Upgrades" description="Support high-demand appliances and ensure modern safety standards with panel replacements." link="/services" />
                <ServiceCard icon={<Light className="text-4xl" />} title="Lighting Solutions" description="Custom LED design, landscape lighting, and smart home lighting controls for security." link="/services" />
                <ServiceCard icon={<ChargingStation className="text-4xl" />} title="EV Chargers" description="Fast, certified installation of Tesla, JuiceBox, and ChargePoint residential chargers." link="/services" />
                <ServiceCard icon={<Construction className="text-4xl" />} title="Emergency Repair" description="Rapid response for electrical failures and proactive preventative maintenance." link="/services" />
              </>
            )}
        </div>

        <div className="text-center mt-16">
          <Button label="View All Services" variant="secondary" href="/services" />
        </div>
      </div>
    </section>
  );
}
