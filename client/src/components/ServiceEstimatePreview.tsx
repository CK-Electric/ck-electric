'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import EstimateDatePicker, { friendlyDate, friendlyTime } from './EstimateDatePicker';
import Button from './Button';

type Kind = 'ev' | 'panel';
const inputClass = 'mt-2 block min-h-14 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base transition-colors hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';
const selectClass = `${inputClass} appearance-none pr-11 cursor-pointer`;
function SelectArrow() { return <ExpandMore aria-hidden="true" fontSize="small" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600" />; }
const times = Array.from({ length: 33 }, (_, i) => `${String(6 + Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`);
function dateOptions() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const days: string[] = [];
  for (let i = 1; i <= 42; i++) {
    const date = new Date(`${today}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + i);
    if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) days.push(date.toISOString().slice(0, 10));
  }
  return days;
}
function Photo({ label, file, onChange, required = true, maxBytes }: { label: string; file?: File; onChange: (file?: File) => void; required?: boolean; maxBytes: number }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const previewable = !!file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  const [error, setError] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!file || !imageRef.current) return;
    const objectUrl = URL.createObjectURL(file); imageRef.current.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return <div className="rounded border border-neutral-200 p-4">
    <label className="text-small-bold">{label}{required ? ' *' : ' (optional)'}
      <input ref={ref} className={`${inputClass} text-small`} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" onChange={event => {
        const next = event.target.files?.[0]; setError('');
        if (next && (!/\.(jpe?g|png|webp|heic|heif)$/i.test(next.name) || next.size > maxBytes)) {
          setError(`Choose a JPG, PNG, WEBP or HEIC image up to ${(maxBytes / 1024 / 1024).toFixed(1)} MB.`); event.target.value = ''; onChange(undefined); return;
        }
        onChange(next);
      }} />
    </label>
    {file && <div className="mt-3 space-y-2">
      {/* Local object URLs intentionally bypass the remote image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {previewable && <img ref={imageRef} alt={label} className="h-32 w-full rounded object-contain" />}
      <p className="text-small break-all">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB){!previewable && ' — preview unavailable for this format'}</p>
      <button type="button" className="text-small underline" onClick={() => { onChange(undefined); if (ref.current) ref.current.value = ''; }}>Remove photo</button>
    </div>}
    {error && <p role="alert" className="mt-2 text-small text-negative-700">{error}</p>}
  </div>;
}
export default function ServiceEstimatePreview({ kind, hostedDemo = false }: { kind: Kind; hostedDemo?: boolean }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({ state: 'WA', count: '1' });
  const [photos, setPhotos] = useState<Record<string, File | undefined>>({});
  const [days] = useState(dateOptions);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);
  const [savedReference, setSavedReference] = useState('');
  const [limits, setLimits] = useState<{ file_bytes: number; total_bytes: number; max_files: number } | null>(hostedDemo ? { file_bytes: 15 * 1024 * 1024, total_bytes: 30 * 1024 * 1024, max_files: 18 } : null);
  const [backendError, setBackendError] = useState('');
  useEffect(() => {
    if (hostedDemo) return;
    const controller = new AbortController();
    fetch('/api/local-estimates', { signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok || data.mode !== 'local-mock') throw new Error(data.message || 'Local backend is unavailable.');
      setLimits(data);
    }).catch(error => { if (error.name !== 'AbortError') setBackendError(error.message); });
    return () => controller.abort();
  }, [hostedDemo]);
  function edited() { requestId.current = null; setSavedReference(''); }
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const ev = kind === 'ev';
  const count = ev ? 1 : Number(values.count);
  const needsPhotos = !ev || values.distance === 'yes';
  const requiredPhotos = ev ? ['panel', 'location'] : Array.from({ length: count }, (_, i) => [`panel${i}-door`, `panel${i}-back`]).flat();
  const activePhotoKeys = needsPhotos ? [...requiredPhotos, ...(!ev ? Array.from({ length: 6 }, (_, i) => `extra${i}`) : [])] : [];
  function set(key: string, value: string) { edited(); setValues(old => ({ ...old, [key]: value })); setError(''); }
  function move(next: number) { setStep(next); setError(''); requestAnimationFrame(() => heading.current?.focus()); }
  function choice(key: string, label: string, options: string[][]) {
    return <fieldset><legend className="text-base-bold mb-3">{label} *</legend><div className="flex flex-wrap gap-3">{options.map(([value, text]) => <label key={value} className={`flex min-h-14 flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-base transition-colors hover:border-primary-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-500 ${values[key] === value ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 bg-white'}`}><input type="radio" name={key} value={value} checked={values[key] === value} required onChange={() => set(key, value)} className="accent-primary-500" />{text}</label>)}</div></fieldset>;
  }
  function field(key: string, label: string, type = 'text', required = true, autoComplete?: string) {
    return <label className="block text-small-bold">{label}{required ? ' *' : ' (optional)'}<input className={inputClass} type={type} required={required} autoComplete={autoComplete} value={values[key] || ''} maxLength={key === 'state' ? 2 : 150} onChange={e => set(key, e.target.value)} /></label>;
  }
  function photo(key: string, label: string, required = true) {
    return <Photo key={key} label={label} file={photos[key]} required={required} maxBytes={limits?.file_bytes || 2 * 1024 * 1024} onChange={file => { edited(); setPhotos(old => ({ ...old, [key]: file })); }} />;
  }
  async function advance() {
    if (submitting.current) return;
    if (!form.current?.reportValidity()) return;
    if (step === 0 && !ev && values.known === 'yes') {
      for (let i = 0; i < count; i++) if (values[`amps${i}`] === 'other' && (!/^\d+$/.test(values[`other${i}`] || '') || Number(values[`other${i}`]) < 15 || Number(values[`other${i}`]) > 1200)) { setError('Enter a whole amperage between 15 and 1200.'); return; }
    }
    if (step === 1) {
      if (needsPhotos && requiredPhotos.some(key => !photos[key])) { setError('Please add both required photos for each panel or installation location.'); return; }
      if (!needsPhotos) {
        const selected = [0, 1, 2].map(i => values[`date${i}`]);
        if (selected.some(day => !days.includes(day)) || new Set(selected).size !== 3) { setError('Choose three different weekdays.'); return; }
        if ([0, 1, 2].some(i => values[`from${i}`] >= values[`to${i}`])) { setError('Each end time must be later than its start time.'); return; }
      }
    }
    if (step < 2) { move(step + 1); return; }
    if (!/^(\+?1)?\d{10}$/.test((values.phone || '').replace(/[\s().-]/g, ''))) { setError('Please enter a valid 10-digit US phone number.'); return; }
    if (!/^\d{5}(-\d{4})?$/.test(values.zip || '')) { setError('Please enter a valid ZIP code.'); return; }
    if (!/^[a-z]{2}$/i.test(values.state || '')) { setError('Please enter a two-letter state abbreviation.'); return; }
    if (!limits) { setError('The form is temporarily unavailable. Please refresh and try again.'); return; }
    const selectedPhotos = activePhotoKeys.flatMap(key => photos[key] ? [{ key, file: photos[key]! }] : []);
    if (selectedPhotos.length > limits.max_files || selectedPhotos.some(({ file }) => file.size > limits.file_bytes) || selectedPhotos.reduce((sum, { file }) => sum + file.size, 0) > limits.total_bytes) {
      setError(`Please keep photos within the upload limits: ${(limits.file_bytes / 1024 / 1024).toFixed(1)} MB per photo, ${(limits.total_bytes / 1024 / 1024).toFixed(1)} MB total.`); return;
    }
    if (hostedDemo) {
      setReference(`PREVIEW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);
      requestAnimationFrame(() => heading.current?.focus());
      return;
    }
    submitting.current = true; setBusy(true); setError('');
    requestId.current ||= crypto.randomUUID();
    const body = new FormData();
    body.set('request_id', requestId.current); body.set('kind', kind);
    body.set('payload', JSON.stringify(values)); body.set('simulate_failure', '0');
    selectedPhotos.forEach(({ key, file }) => body.set(key, file));
    try {
      const response = await fetch('/api/local-estimates', { method: 'POST', body, signal: AbortSignal.timeout(60_000) });
      const result = await response.json();
      if (!response.ok || result.mode !== 'local-mock' || !result.saved) throw new Error(result.message || 'Could not save your local request.');
      setSavedReference(result.reference);
      if (result.status !== 'completed') {
        setError('Your details were saved, but processing could not be completed. Please try again.'); return;
      }
      setReference(result.reference);
      requestAnimationFrame(() => heading.current?.focus());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not confirm the result. Retry with the same answers to avoid duplicates.');
    } finally { submitting.current = false; setBusy(false); }
  }
  const title = ev ? 'EV charger installation' : 'Panel replacement';
  return <div className="bg-neutral-50 px-4 py-8 md:py-12 text-neutral-950">
    <div className="mx-auto max-w-3xl">
      <Link href="/request-estimate" className="mb-8 inline-flex items-center gap-2 text-small-bold text-neutral-600 transition-colors hover:text-neutral-950"><ArrowBack fontSize="small" /> Back</Link>
      <p className="text-small-upper text-primary-800 mb-3">Request a free estimate</p>
      <h1 className="text-display-3 md:text-display-2 mb-4">{title}</h1>
      <p className="text-base text-neutral-600 mb-8">A few details help us understand your project and prepare the next steps. No commitment required.</p>
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-10 shadow-sm">
        {reference ? <div role="status" className="space-y-5 py-4"><CheckCircleOutline className="text-positive-600" fontSize="large" /><h2 ref={heading} tabIndex={-1} className="text-display-4">{hostedDemo ? 'Preview complete' : 'Your request is saved'}</h2><p className="text-base text-neutral-600">{hostedDemo ? 'Thank you for reviewing the form. This is a demonstration: your answers and photos have not been submitted or saved.' : 'Your project details and any photos have been saved. A price or appointment has not been confirmed.'}</p><p className="text-small break-all">Reference: <strong>{reference}</strong></p><Button variant="secondary" label="Back to my answers" onClick={() => setReference('')} /></div> : <>
          <ol className="mb-8 grid grid-cols-3 gap-2 text-small" aria-label="Progress">{['Project', needsPhotos ? 'Photos' : 'Visit preferences', 'Contact & review'].map((label, i) => <li key={i} aria-current={step === i ? 'step' : undefined} className={`border-t-4 pt-3 ${i <= step ? 'border-primary-500 text-neutral-950' : 'border-neutral-200 text-neutral-500'}`}>{i + 1}. {label}</li>)}</ol>
          <h2 ref={heading} tabIndex={-1} className="text-display-4 mb-6">{['About your project', needsPhotos ? 'Project photos' : 'Preferred visit times', 'Your contact details'][step]}</h2>
          <p className="mb-6 text-small text-neutral-500">Fields marked * are required.</p>
          <form ref={form} onSubmit={e => { e.preventDefault(); void advance(); }} className="space-y-8">
            {step === 0 && <>
              {ev ? <>
                {choice('charger', 'What would you like installed?', [['hardwired', 'Hardwired charger'], ['nema', 'NEMA 14-50 receptacle']])}
                {choice('location', 'Where will it be installed?', [['indoors', 'Indoors'], ['outdoors', 'Outdoors']])}
                {values.charger === 'hardwired' && choice('supply', 'Are you providing the charger?', [['yes', 'Yes'], ['no', 'No']])}
                {choice('distance', 'Will it be within 10 feet of your electrical panel?', [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']])}
              </> : <>
                <label className="block text-base-bold">How many panels need replacing? *<span className="relative block"><select className={selectClass} value={values.count} onChange={e => { set('count', e.target.value); if (e.target.value === '1' && values.location === 'both') set('location', ''); }}>{[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'panel' : 'panels'}</option>)}</select><SelectArrow /></span></label>
                {choice('location', 'Where are the panels located?', [['indoors', 'Indoors'], ['outdoors', 'Outdoors'], ...(count > 1 ? [['both', 'Both']] : [])])}
                {choice('known', 'Do you know the existing amperage?', [['yes', 'Yes'], ['no', 'Not sure']])}
                {values.known === 'yes' && Array.from({ length: count }, (_, i) => <div key={i} className="space-y-4">{choice(`amps${i}`, `Panel ${i + 1} amperage`, [['90', '90 amp'], ['125', '125 amp'], ['200', '200 amp'], ['other', 'Other']])}{values[`amps${i}`] === 'other' && field(`other${i}`, `Panel ${i + 1} amperage (15–1200)`, 'number')}</div>)}
              </>}
            </>}
            {step === 1 && (needsPhotos ? <>
              <p className="text-small text-neutral-600">JPG, PNG, WEBP or HEIC. Upload limit: {limits ? `${(limits.file_bytes / 1024 / 1024).toFixed(1)} MB per photo, ${(limits.total_bytes / 1024 / 1024).toFixed(1)} MB total` : 'loading…'}. Open only the hinged panel door; do not remove protective covers.</p>
              {ev ? <>{photo('panel', 'Electrical panel: door open, breakers readable')}{photo('location', 'Installation location: stand back to show the surrounding area')}</> : Array.from({ length: count }, (_, i) => <fieldset className="space-y-4" key={i}><legend className="text-base-bold mb-3">Panel {i + 1}</legend>{photo(`panel${i}-door`, 'Door open, breakers readable')}{photo(`panel${i}-back`, 'Stand back to show three feet around the panel')}</fieldset>)}
              {!ev && <details><summary className="cursor-pointer text-small-bold">Add optional photos (up to 6)</summary><div className="mt-4 space-y-4">{Array.from({ length: 6 }, (_, i) => photo(`extra${i}`, `Additional photo ${i + 1}`, false))}</div></details>}
            </> : <>
              <p className="text-small">Choose three different weekdays within the next six weeks, between 6 a.m. and 2 p.m. Pacific time. These are preferences, not confirmed bookings.</p>
              {[0, 1, 2].map(i => <fieldset key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5"><legend className="px-2 text-small-bold text-primary-800">{['First preference', 'Second preference', 'Third preference'][i]}</legend>
                <EstimateDatePicker label={`Preference ${i + 1}`} value={values[`date${i}`] || ''} days={days} unavailable={[0, 1, 2].filter(n => n !== i).map(n => values[`date${n}`])} onChange={date => set(`date${i}`, date)} />
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{['from', 'to'].map(key => <label key={key} className="min-w-0 text-small-bold">{key === 'from' ? 'From' : 'Until'} *<span className="relative block"><select required className={selectClass} value={values[`${key}${i}`] || ''} onChange={e => {
                  set(`${key}${i}`, e.target.value);
                  if (key === 'from' && values[`to${i}`] <= e.target.value) set(`to${i}`, '');
                }}><option value="">Select time</option>{(key === 'from' ? times.slice(0, -1) : times.slice(1).filter(time => !values[`from${i}`] || time > values[`from${i}`])).map(time => <option key={time} value={time}>{friendlyTime(time)}</option>)}</select><SelectArrow /></span></label>)}</div>
              </fieldset>)}
            </>)}
            {step === 2 && <>
              <div className="grid gap-5 sm:grid-cols-2">{field('first', 'First name', 'text', true, 'given-name')}{field('last', 'Last name', 'text', true, 'family-name')}{field('phone', 'Mobile phone', 'tel', true, 'tel')}{field('email', 'Email', 'email', true, 'email')}</div>
              {field('street', 'Project street address', 'text', true, 'address-line1')}{field('unit', 'Unit / suite', 'text', false, 'address-line2')}
              <div className="grid gap-5 sm:grid-cols-3">{field('city', 'City', 'text', true, 'address-level2')}{field('state', 'State', 'text', true, 'address-level1')}{field('zip', 'ZIP code', 'text', true, 'postal-code')}</div>
              <label className="block text-small-bold">Additional comments (optional)<textarea className={inputClass} rows={4} maxLength={2000} value={values.comments || ''} onChange={e => set('comments', e.target.value)} /></label>
              <div className="rounded bg-neutral-50 p-4 text-small space-y-2"><h3 className="text-base-bold">Review your project</h3><p>{title} · {values.location}</p>{ev ? <><p>{values.charger === 'hardwired' ? 'Hardwired charger' : 'NEMA 14-50 receptacle'}{values.charger === 'hardwired' && ` · Providing charger: ${values.supply}`}</p><p>Within 10 feet: {values.distance === 'unsure' ? 'Not sure' : values.distance === 'yes' ? 'Yes' : 'No'}</p></> : <><p>{count} {count === 1 ? 'panel' : 'panels'}</p>{Array.from({ length: count }, (_, i) => <p key={i}>Panel {i + 1}: {values.known !== 'yes' ? 'Amperage unknown' : `${values[`amps${i}`] === 'other' ? values[`other${i}`] : values[`amps${i}`]} amps`}</p>)}</>}{needsPhotos ? <ul>{activePhotoKeys.filter(key => photos[key]).map(key => <li className="break-all" key={key}>{photos[key]?.name}</li>)}</ul> : [0, 1, 2].map(i => <p key={i}>{friendlyDate(values[`date${i}`])} · {friendlyTime(values[`from${i}`])}–{friendlyTime(values[`to${i}`])} Pacific</p>)}</div>
            </>}
            {backendError && <p role="alert" className="text-small text-negative-700">The form is temporarily unavailable. Please refresh and try again.</p>}
            {savedReference && <p className="text-small break-all">Saved request: {savedReference}.</p>}
            {error && <p role="alert" className="rounded bg-negative-50 p-4 text-small text-negative-700">{error}</p>}
            <div className="flex flex-wrap justify-between gap-4 border-t border-neutral-200 pt-6">{step > 0 ? <Button variant="secondary" label="Back" disabled={busy} onClick={() => move(step - 1)} /> : <span />}<Button type="submit" disabled={busy || (step === 2 && !limits)} label={busy ? 'Saving your request…' : step === 2 ? 'Request my free estimate' : 'Continue'} /></div>
          </form>
        </>}
      </section>
    </div>
  </div>;
}
