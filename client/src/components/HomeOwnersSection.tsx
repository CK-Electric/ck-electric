import { Email } from '@mui/icons-material';
import type { OwnersData } from '../lib/wordpress-types';

interface Props {
  ownersData: OwnersData | null;
}

function OwnerCard({ owner, rotate }: { owner: NonNullable<OwnersData['matt']>; rotate: string }) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-neutral-950 ${rotate} group-hover:rotate-0 transition-transform`}></div>
      <div className="relative bg-white p-8 flex flex-col sm:flex-row gap-8 items-center border border-neutral-950/10">
        <div className={`w-40 h-40 bg-neutral-200 flex-shrink-0 overflow-hidden ${rotate === 'rotate-1' ? 'skew-x-3' : '-skew-x-3'}`}>
          {owner.featuredImage?.node?.mediaItemUrl ? (
            <img
              alt={owner.owners.fullName}
              className={`w-full h-full object-cover ${rotate === 'rotate-1' ? '-skew-x-3' : 'skew-x-3'} grayscale group-hover:grayscale-0 transition-all duration-500 scale-110`}
              src={owner.featuredImage.node.mediaItemUrl}
              width={160}
              height={160}
            />
          ) : (
            <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
              <span className="text-neutral-600 text-sm">{owner.owners.fullName.charAt(0)}</span>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-display-4 font-black text-neutral-950">{owner.owners.fullName}</h4>
          <p className="text-primary-800 text-[10px] font-black uppercase tracking-widest mb-2">{owner.owners.position}</p>
          {owner.owners.email && (
            <div className="flex items-center gap-2 mb-4">
              <Email className="w-3 h-3 text-primary-600" aria-hidden="true" />
              <a
                href={`mailto:${owner.owners.email}`}
                className="text-neutral-700 text-small hover:text-primary-600 transition-colors hover:underline decoration-primary-600"
                aria-label={`Email ${owner.owners.fullName}`}
              >
                {owner.owners.email}
              </a>
            </div>
          )}
          {owner.owners.phoneNumber && (
            <a
              href={`tel:${owner.owners.phoneNumber}`}
              className="bg-primary-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_0px_rgba(49,36,7,1)] hover:shadow-none transition-all inline-block"
              aria-label={`Call ${owner.owners.fullName.split(' ')[0]} at ${owner.owners.phoneNumber}`}
            >
              Call {owner.owners.fullName.split(' ')[0]}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeOwnersSection({ ownersData }: Props) {
  const rob = ownersData?.rob;
  const matt = ownersData?.matt;

  if (!rob && !matt) return null;

  return (
    <section className="py-32 bg-neutral-50" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 text-center md:text-left">
          <div className="max-w-xl mx-auto md:mx-0">
            <h2 className="text-primary-800 font-black text-xs tracking-[0.4em] uppercase mb-4 md:text-sm lg:text-base">Experts on Site</h2>
            <h3 className="team-title text-neutral-950 text-lg md:text-2xl lg:text-3xl">Meet the Owners</h3>
          </div>
          <p className="text-neutral-700 font-medium max-w-sm border-l-4 border-primary-500 pl-6 mx-auto md:mx-0">Licensed Electrical Contractors with decades of combined experience in Puget Sound.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {rob && <OwnerCard owner={rob} rotate="rotate-1" />}
          {matt && <OwnerCard owner={matt} rotate="-rotate-1" />}
        </div>
      </div>
    </section>
  );
}
