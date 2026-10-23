import { ArrowRightAlt, ChargingStation, ElectricalServices, ElectricBolt } from '@mui/icons-material';
import Button from './Button';

const estimateForms = [
  {
    title: 'EV charger installation',
    description: 'Tell us about the charger and installation location, then share a few project photos.',
    href: '/request-estimate/ev-charger',
    action: 'Start EV charger form',
    icon: ChargingStation,
  },
  {
    title: 'Panel replacement',
    description: 'Share details about your electrical panel and upload photos to help us review the project.',
    href: '/request-estimate/panel-replacement',
    action: 'Start panel replacement form',
    icon: ElectricalServices,
  },
  {
    title: 'Other electrical services',
    description: 'Looking for help with lighting, wiring, repairs, or another project? Send us a general estimate request.',
    href: '/request-estimate',
    action: 'Request a general estimate',
    icon: ElectricBolt,
  },
];

export default function HomeEstimateFormsSection() {
  return (
    <section aria-labelledby="estimate-forms-heading" className="bg-primary-50 py-20 md:py-28" id="estimate-forms">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p className="mb-4 text-primary-800 text-xs font-black uppercase tracking-[0.4em] md:text-sm">Start your project</p>
          <h2 id="estimate-forms-heading" className="text-display-2 text-neutral-950 text-3xl font-bold md:text-4xl lg:text-5xl">
            Request an estimate
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-700">
            Choose the form that matches your project. A few details help our team prepare for the next steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {estimateForms.map(({ title, description, href, action, icon: Icon }) => (
            <article key={href} className="group relative flex h-full flex-col border-b-8 border-primary-500 bg-white p-8 transition-all duration-300 hover:-translate-y-2 md:p-10">
              <span className="mb-8 flex h-16 w-16 items-center justify-center bg-neutral-950 text-primary-500" aria-hidden="true">
                <Icon fontSize="large" />
              </span>
              <h3 className="text-display-4 mb-4 text-neutral-950">{title}</h3>
              <p className="mb-8 flex-1 text-small leading-relaxed text-neutral-700">{description}</p>
              <div>
                <Button
                  label={action}
                  labelSuffix={` for ${title}`}
                  icon={<ArrowRightAlt />}
                  variant="tertiary"
                  href={href}
                  ariaLabel={`${action} for ${title}`}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
