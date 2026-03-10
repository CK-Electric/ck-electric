import Image from 'next/image';
import { Check } from '@mui/icons-material';
import Button from './Button';
import type { LandingPageData } from '../lib/wordpress-types';

interface Props {
  landingPageData: LandingPageData | null;
}

export default function HomeAboutSection({ landingPageData }: Props) {
  const aboutUs = landingPageData?.page.landingPage.aboutUs;
  const aboutTitle = aboutUs?.title || 'NO MIDDLEMEN. NO MESS.';
  const aboutSubtitle = aboutUs?.subtitle || 'Locally Owned & Expertly Operated';
  const aboutDescription =
    aboutUs?.description ||
    "<p>CK Electric was founded on a simple principle: people deserve to talk to experts doing the work. When you call us, you speak directly with Rob or Matt, not a call center.</p><p>We combine industrial-grade precision with residential-level care. Whether it's a major commercial TI or a home panel upgrade, we bring decades of experience.</p>";
  const aboutItems = [
    aboutUs?.itemsList?.item1 || 'Licensed Master Electricians',
    aboutUs?.itemsList?.item2 || 'Zero Outsourcing',
    aboutUs?.itemsList?.item3 || 'Puget Sound Focused',
  ];
  const aboutImage = aboutUs?.aboutUsImage?.node?.mediaItemUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuANLZ7KGX7PAID37XG0QghBlVd6mx5151hYLtPb__9r9muTE_OVodG09JpjxXC20XbMKiqFvHriC13oTOg-6M-cS8J6wz2Eal1zizA_zFVtzW55ZUOR6THsd7rmYfcIc5nYPnwthvKNH4FP6Ffw6Vyg4tYQsxRcIE8T95B9-KDPdk7YXMDVwYth_u5NKtQpB9-aoG4Fow4jdgYcM5ArO-ogkYwdFWZ04bwSVT4SbBq24kFi8SQo6hN3cF0HEFbcVRVujlc-H9RCPwY';
  const aboutImageAlt = aboutUs?.aboutUsImage?.node?.altText || 'Modern industrial electrical equipment';

  return (
    <section className="py-32 bg-primary-50" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/2 relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-primary-400 -rotate-3 transition-transform group-hover:rotate-0"></div>
            <Image
              alt={aboutImageAlt}
              className="relative z-10 w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
              src={aboutImage}
              width={800}
              height={600}
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-primary-800 text-base-upper mb-4">{aboutTitle}</h2>
            <h3 className="about-title text-neutral-950 mb-8 leading-tight">
              {aboutSubtitle}
            </h3>

            <div
              className="space-y-6 text-neutral-700 text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutDescription }}
            />

            <ul className="grid grid-cols-1 gap-4 pt-6" aria-label="Key differentiators">
              {aboutItems.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-950 text-base-bold">
                  <span className="w-6 h-6 bg-positive-500 flex items-center justify-center text-white rotate-45" aria-hidden="true">
                    <Check className="text-sm -rotate-45" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-8">
              <Button label="Request Estimate" variant="primary" href="/request-estimate" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
