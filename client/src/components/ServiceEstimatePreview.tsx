'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ElectricalServicesOutlined from '@mui/icons-material/ElectricalServicesOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import Check from '@mui/icons-material/Check';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EstimateDatePicker, { friendlyDate, friendlyTime } from './EstimateDatePicker';
import Button from './Button';

type Kind = 'ev' | 'panel';
const inputClass = 'mt-2 block min-h-14 w-full min-w-0 rounded-lg border border-neutral-300 bg-background px-4 py-3 text-base transition-colors hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';
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
  const id = useId();
  const imageRef = useRef<HTMLImageElement>(null);
  const previewable = !!file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  const [error, setError] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!file || !imageRef.current) return;
    const objectUrl = URL.createObjectURL(file); imageRef.current.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return <div className="rounded-xl border border-neutral-200 p-4 sm:p-5">
    <p id={id} className="text-small-bold">{label}{required ? ' *' : ' (optional)'}</p>
    <input ref={ref} className="hidden" tabIndex={-1} aria-labelledby={id} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" onChange={event => {
      const next = event.target.files?.[0];
      if (!next) return;
      setError('');
      if (!/\.(jpe?g|png|webp|heic|heif)$/i.test(next.name) || next.size > maxBytes) {
        setError(`Choose a JPG, PNG, WEBP or HEIC image up to ${(maxBytes / 1024 / 1024).toFixed(1)} MB.`);
        event.target.value = ''; return;
      }
      onChange(next);
    }} />
    {!file ? <button type="button" aria-label={`Choose photo: ${label}`} aria-describedby={`${id}-help`} onClick={() => ref.current?.click()} className="group mt-4 flex min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center transition-colors hover:border-primary-500 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-800"><UploadFileOutlined aria-hidden="true" /></span>
      <span className="inline-flex items-center justify-center rounded bg-primary-500 px-6 py-3 text-small-bold text-neutral-950 shadow-[4px_4px_0px_var(--color-primary-900)] transition-all group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_var(--color-primary-900)]"><UploadFileOutlined aria-hidden="true" fontSize="small" />Choose photo</span>
      <span className="text-small text-neutral-700">Click or tap anywhere here to select a photo.</span>
      <span id={`${id}-help`} className="text-small text-neutral-700">JPG, PNG, WEBP or HEIC · Up to {(maxBytes / 1024 / 1024).toFixed(1)} MB</span>
    </button> : <div className="mt-4 space-y-3">
      <p role="status" className="flex items-center gap-2 text-small-bold text-neutral-800"><CheckCircleOutline fontSize="small" className="text-positive-700" aria-hidden="true" />Photo selected</p>
      {/* Local object URLs intentionally bypass the remote image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {previewable ? <img ref={imageRef} alt={label} className="h-40 w-full rounded-lg bg-neutral-50 object-contain" /> : <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-4 text-small text-neutral-700"><ImageOutlined aria-hidden="true" />Preview unavailable for this format. Your photo is selected.</div>}
      <p className="text-small break-all">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" size="small" ariaLabel={`Replace photo: ${label}`} icon={<EditOutlined fontSize="small" />} iconPosition="start" label="Replace photo" onClick={() => ref.current?.click()} />
        <Button type="button" variant="danger" size="small" ariaLabel={`Remove photo: ${label}`} icon={<DeleteOutline fontSize="small" />} iconPosition="start" label="Remove" onClick={() => { onChange(undefined); setError(''); if (ref.current) ref.current.value = ''; }} />
      </div>
    </div>}
    {error && <p role="alert" className="mt-3 text-small text-negative-700">{error}</p>}
  </div>;
}

function ReviewPhoto({ file }: { file: File }) {
  const ref = useRef<HTMLImageElement>(null);
  const previewable = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  useEffect(() => {
    if (!previewable || !ref.current) return;
    const url = URL.createObjectURL(file);
    ref.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file, previewable]);
  return <li className="flex min-w-0 items-center gap-3 rounded-lg border border-neutral-200 bg-background p-3">
    {previewable ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img ref={ref} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
    ) : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-neutral-100"><ImageOutlined aria-hidden="true" /></span>}
    <span className="min-w-0 break-words text-small">{file.name}</span>
  </li>;
}
export default function ServiceEstimatePreview({ kind, hostedDemo = false, productionMode = false, mascotImageUrl, mascotImageAlt = 'CK Electric eagle mascot' }: { kind: Kind; hostedDemo?: boolean; productionMode?: boolean; mascotImageUrl?: string; mascotImageAlt?: string }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({ state: 'WA', count: '1' });
  const [photos, setPhotos] = useState<Record<string, File | undefined>>({});
  const [days] = useState(dateOptions);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');
  const [outcome, setOutcome] = useState<'received' | 'wordpress-test' | 'test' | 'attention' | 'pending' | null>(null);
  const [serverMessage, setServerMessage] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const submitting = useRef(false);
  const [savedReference, setSavedReference] = useState('');
  const [limits, setLimits] = useState<{ file_bytes: number; total_bytes: number; max_files: number } | null>(hostedDemo ? { file_bytes: 15 * 1024 * 1024, total_bytes: 30 * 1024 * 1024, max_files: 18 } : null);
  const [backendError, setBackendError] = useState('');
  useEffect(() => {
    if (hostedDemo) return;
    const controller = new AbortController();
    fetch('/api/local-estimates', { signal: controller.signal }).then(async response => {
      const data = await response.json();
      const expectedMode = productionMode ? 'housecall-pro' : 'local-mock';
      if (!response.ok || data.mode !== expectedMode) {
        throw new Error(productionMode ? 'Online estimates are temporarily unavailable. Please call CK Electric.' : data.message || 'Local backend is unavailable.');
      }
      setLimits(data);
    }).catch(error => { if (error.name !== 'AbortError') setBackendError(error.message); });
    return () => controller.abort();
  }, [hostedDemo, productionMode]);
  function edited() { setRequestId(null); setSavedReference(''); setOutcome(null); setServerMessage(''); }
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
    return <fieldset><legend className="text-base-bold mb-3">{label} *</legend><div className="flex flex-col gap-3">{options.map(([value, text]) => <label key={value} className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-base transition-colors hover:border-primary-500 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-500 ${values[key] === value ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-neutral-300 bg-background'}`}><input type="radio" name={key} value={value} checked={values[key] === value} required onChange={() => set(key, value)} className="accent-primary-500" />{text}</label>)}</div></fieldset>;
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
    const currentRequestId = requestId || crypto.randomUUID();
    setRequestId(currentRequestId);
    const body = new FormData();
    body.set('request_id', currentRequestId); body.set('kind', kind);
    body.set('payload', JSON.stringify(values)); body.set('simulate_failure', '0');
    body.set('contact_website', String(new FormData(form.current!).get('contact_website') || ''));
    selectedPhotos.forEach(({ key, file }) => body.set(key, file));
    try {
      const response = await fetch('/api/local-estimates', { method: 'POST', body, signal: AbortSignal.timeout(60_000) });
      const result = await response.json();
      if (result.saved) setSavedReference(result.reference);
      if (!response.ok || !result.saved) throw new Error(result.message || 'Something went wrong, and we couldn’t confirm your form was sent. Your answers are still here—please try again.');
      setSavedReference(result.reference);
      setServerMessage(result.processing?.message || '');
      if (!['received', 'retry_wait', 'processing', 'completed', 'needs_attention'].includes(result.status)) {
        setError('Your details were saved. Please contact us with the reference below to check their status.'); return;
      }
      const nextOutcome = result.mode === 'local-mock' ? 'wordpress-test' : result.status === 'completed' ? 'received' : result.status === 'needs_attention' ? 'attention' : 'pending';
      setOutcome(nextOutcome);
      setReference(result.reference);
      requestAnimationFrame(() => heading.current?.focus());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not confirm the result. Retry with the same answers to avoid duplicates.');
    } finally { submitting.current = false; setBusy(false); }
  }
  const title = ev ? 'EV charger installation' : 'Panel replacement';
  return <div className="bg-neutral-50 px-4 py-8 md:py-12 text-neutral-950">
    <div className="mx-auto max-w-3xl">
      {busy ? <Button variant="tertiary" icon={<ArrowBack fontSize="small" />} iconPosition="start" label="Back" disabled className="mb-8 min-h-11 cursor-not-allowed opacity-50" /> : <Button href="/request-estimate" variant="tertiary" icon={<ArrowBack fontSize="small" />} iconPosition="start" label="Back" className="mb-8 min-h-11" />}
      <p className="text-small-upper text-primary-800 mb-3">Request a free estimate</p>
      <h1 className="text-display-3 md:text-display-2 mb-4">{title}</h1>
      <p className="text-base text-neutral-950 mb-8">A few details help us understand your project and prepare the next steps. No commitment required.</p>
      <section className="rounded-2xl border border-neutral-200 bg-background p-5 md:p-10 shadow-sm">
        {reference ? <div role="status" className="space-y-5 py-4">
          {hostedDemo || outcome === 'received' || outcome === 'wordpress-test' ? <div className="relative mb-2 flex min-h-36 items-center justify-center overflow-hidden rounded-2xl bg-primary-50 px-6 py-5 sm:min-h-44" aria-hidden="true">
            <span className="absolute left-[18%] top-7 text-2xl text-primary-600">✦</span>
            <span className="absolute right-[20%] top-10 text-xl text-primary-600">✦</span>
            <span className="absolute bottom-6 left-[28%] text-lg text-primary-500">✦</span>
            <span className="relative z-10">
              {mascotImageUrl ? <Image src={mascotImageUrl} alt={mascotImageAlt} width={112} height={128} sizes="112px" className="h-32 w-28 object-contain" /> : <CheckCircleOutline className="text-positive-600" fontSize="large" />}
              <span className="absolute -right-2 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-positive-500 text-background shadow-sm"><Check fontSize="small" aria-hidden="true" /></span>
            </span>
            <span className="absolute bottom-8 right-[26%] text-lg text-primary-500">✦</span>
          </div> : hostedDemo || outcome === 'test' ? <InfoOutlined className="text-primary-700" fontSize="large" aria-hidden="true" /> : outcome === 'attention' ? <ErrorOutline className="text-negative-700" fontSize="large" aria-hidden="true" /> : <CheckCircleOutline className="text-positive-600" fontSize="large" aria-hidden="true" />}
          <h2 ref={heading} tabIndex={-1} className="text-display-4">{hostedDemo ? 'Request received' : outcome === 'wordpress-test' ? 'Request saved' : outcome === 'test' ? 'Test request saved' : outcome === 'attention' ? 'We saved your request' : outcome === 'pending' ? 'Your request is still processing' : 'Request received'}</h2>
          <p className="text-base text-neutral-950">{hostedDemo ? 'Thanks for reaching out. The CK Electric team received your project details and will follow up. A price or appointment is not confirmed yet.' : outcome === 'wordpress-test' ? 'Your project details and photos were saved to your local WordPress site. This local test was not sent to Housecall Pro.' : outcome === 'test' ? (serverMessage || 'This is a test submission. It was not sent to Housecall Pro.') : outcome === 'attention' ? (serverMessage || 'Your project details are saved, but we could not confirm delivery. Please contact CK Electric and share this reference.') : outcome === 'pending' ? (serverMessage || 'Your project details are saved and are still being submitted. Keep this reference, and contact CK Electric if you do not hear back.') : (serverMessage || 'Thanks for reaching out. The CK Electric team received your project details and will follow up. A price or appointment is not confirmed yet.')}</p>
          <p className="text-small break-all">Reference: <strong>{reference}</strong></p><Button href="/services" variant="secondary" label="Explore our services" /></div> : <>
          <ol className="mb-8 grid grid-cols-3 gap-2 text-small" aria-label="Progress">{['Project', needsPhotos ? 'Photos' : 'Visit preferences', 'Contact & review'].map((label, i) => <li key={i} aria-current={step === i ? 'step' : undefined} className={`border-t-4 pt-3 ${i <= step ? 'border-primary-500 text-neutral-950' : 'border-neutral-200 text-neutral-700'}`}><span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-small-bold" aria-hidden="true">{i < step ? <CheckCircleOutline fontSize="small" className="text-primary-800" /> : i + 1}</span>{label}</li>)}</ol>
          <p className="mb-2 text-small-bold text-primary-800">Step {step + 1} of 3</p>
          <h2 ref={heading} tabIndex={-1} className="text-display-4 mb-3">{['About your project', needsPhotos ? 'Project photos' : 'Preferred visit times', 'Your contact details'][step]}</h2>
          <p className="mb-2 text-small text-neutral-700">{step === 0 ? "Let’s start with what you have in mind." : step === 1 ? (needsPhotos ? "A couple of clear photos help us understand your setup." : "Let us know which days and times work best for you.") : "You’re almost there. Add your details and review your project."}</p>
          <p className="mb-6 text-small text-neutral-700">Fields marked * are required.</p>
          <form ref={form} aria-busy={busy} onSubmit={e => { e.preventDefault(); void advance(); }} className="space-y-8">
            <fieldset disabled={busy} aria-label="Estimate request fields" className="contents">
            <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>Leave this field empty<input name="contact_website" type="text" autoComplete="off" tabIndex={-1} /></label>
            </div>
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
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{['from', 'to'].map(key => <label key={key} className="min-w-0 text-small-bold">{key === 'from' ? 'From' : 'Until'} *<span className="relative block"><select required disabled={key === 'to' && !values[`from${i}`]} className={`${selectClass} disabled:cursor-not-allowed disabled:bg-neutral-100`} value={values[`${key}${i}`] || ''} onChange={e => {
                  set(`${key}${i}`, e.target.value);
                  if (key === 'from' && values[`to${i}`] <= e.target.value) set(`to${i}`, '');
                }}><option value="">{key === 'to' && !values[`from${i}`] ? 'Choose a start time first' : 'Select time'}</option>{(key === 'from' ? times.slice(0, -1) : times.slice(1)).map(time => <option key={time} value={time} disabled={key === 'to' && (!values[`from${i}`] || time <= values[`from${i}`])}>{friendlyTime(time)}</option>)}</select><SelectArrow /></span></label>)}</div>
              </fieldset>)}
            </>)}
            {step === 2 && <>
              <div className="grid gap-5 sm:grid-cols-2">{field('first', 'First name', 'text', true, 'given-name')}{field('last', 'Last name', 'text', true, 'family-name')}{field('phone', 'Mobile phone', 'tel', true, 'tel')}{field('email', 'Email', 'email', true, 'email')}</div>
              {field('street', 'Project street address', 'text', true, 'address-line1')}{field('unit', 'Unit / suite', 'text', false, 'address-line2')}
              <div className="grid gap-5 sm:grid-cols-3">{field('city', 'City', 'text', true, 'address-level2')}{field('state', 'State', 'text', true, 'address-level1')}{field('zip', 'ZIP code', 'text', true, 'postal-code')}</div>
              <label className="block text-small-bold">Additional comments (optional)<textarea className={inputClass} rows={4} maxLength={2000} value={values.comments || ''} onChange={e => set('comments', e.target.value)} /></label>
              <section aria-labelledby="project-review-heading" className="overflow-hidden rounded-2xl border border-neutral-200">
                <div className="flex items-center gap-4 border-b border-primary-200 bg-primary-50 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500"><ElectricalServicesOutlined aria-hidden="true" /></span>
                  <div><h3 id="project-review-heading" className="text-base-bold">Review your project</h3><p className="mt-1 text-small text-neutral-700">{title}</p></div>
                </div>
                <div className="space-y-6 bg-neutral-50 p-4 sm:p-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3"><h4 className="text-small-bold">Project details</h4><Button type="button" variant="secondary" size="small" icon={<EditOutlined fontSize="small" />} iconPosition="start" label="Edit project" disabled={busy} onClick={() => move(0)} /></div>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-neutral-200 bg-background p-4"><dt className="text-small text-neutral-700">Location</dt><dd className="mt-1 text-base-bold">{values.location === 'both' ? 'Indoors & outdoors' : values.location === 'indoors' ? 'Indoors' : 'Outdoors'}</dd></div>
                      {ev ? <>
                        <div className="rounded-lg border border-neutral-200 bg-background p-4"><dt className="text-small text-neutral-700">Installation</dt><dd className="mt-1 text-base-bold">{values.charger === 'hardwired' ? 'Hardwired charger' : 'NEMA 14-50 receptacle'}</dd></div>
                        {values.charger === 'hardwired' && <div className="rounded-lg border border-neutral-200 bg-background p-4"><dt className="text-small text-neutral-700">Providing the charger</dt><dd className="mt-1 text-base-bold">{values.supply === 'yes' ? 'Yes' : 'No'}</dd></div>}
                        <div className="rounded-lg border border-neutral-200 bg-background p-4"><dt className="text-small text-neutral-700">Within 10 feet of the panel</dt><dd className="mt-1 text-base-bold">{values.distance === 'unsure' ? 'Not sure' : values.distance === 'yes' ? 'Yes' : 'No'}</dd></div>
                      </> : <>
                        <div className="rounded-lg border border-neutral-200 bg-background p-4"><dt className="text-small text-neutral-700">Panels to replace</dt><dd className="mt-1 text-base-bold">{count}</dd></div>
                        {Array.from({ length: count }, (_, i) => <div key={i} className="rounded-lg border border-neutral-200 bg-background p-4"><dt className="text-small text-neutral-700">Panel {i + 1} amperage</dt><dd className="mt-1 text-base-bold">{values.known !== 'yes' ? 'Not sure' : `${values[`amps${i}`] === 'other' ? values[`other${i}`] : values[`amps${i}`]} amps`}</dd></div>)}
                      </>}
                    </dl>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3"><h4 className="flex items-center gap-2 text-small-bold">{needsPhotos ? <ImageOutlined fontSize="small" aria-hidden="true" /> : <CalendarMonthOutlined fontSize="small" aria-hidden="true" />}{needsPhotos ? `Photos · ${activePhotoKeys.filter(key => photos[key]).length}` : 'Visit preferences'}</h4><Button type="button" variant="secondary" size="small" icon={<EditOutlined fontSize="small" />} iconPosition="start" label={needsPhotos ? 'Edit photos' : 'Edit times'} disabled={busy} onClick={() => move(1)} /></div>
                    {needsPhotos ? <ul className="grid gap-3 sm:grid-cols-2">{activePhotoKeys.filter(key => photos[key]).map(key => <ReviewPhoto key={key} file={photos[key]!} />)}</ul> : <>
                      <ol className="space-y-3">{[0, 1, 2].map(i => <li key={i} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-background p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-small-bold">{i + 1}</span><div><p className="text-small-bold">{friendlyDate(values[`date${i}`])}</p><p className="mt-1 text-small text-neutral-700">{friendlyTime(values[`from${i}`])}–{friendlyTime(values[`to${i}`])} Pacific</p></div></li>)}</ol>
                      <p className="mt-3 text-small text-neutral-700">Preferred times only. Your appointment is not yet confirmed.</p>
                    </>}
                  </div>
                </div>
              </section>
            </>}
            {backendError && <p role="alert" className="text-small text-negative-700">The form is temporarily unavailable. Please refresh and try again.</p>}
            {savedReference && <p className="text-small break-all">Saved request: {savedReference}.</p>}
            {error && <p role="alert" className="rounded bg-negative-50 p-4 text-small text-negative-700">{error}</p>}
            {error && requestId && <p className="text-small break-all text-neutral-700">Submission reference: <strong>{requestId}</strong>. Retrying with the same answers reuses this reference.</p>}
            {busy && <p role="status" className="flex items-center gap-3 rounded-lg bg-primary-50 p-4 text-small text-neutral-800"><span aria-hidden="true" className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-primary-700 border-r-transparent" />Submitting your request securely. This can take up to a minute; please keep this page open.</p>}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6">{step > 0 ? <Button variant="tertiary" icon={<ArrowBack fontSize="small" />} iconPosition="start" label="Back" disabled={busy} onClick={() => move(step - 1)} /> : <span />}<Button type="submit" disabled={busy || (step === 2 && !limits)} label={busy ? 'Submitting…' : step === 2 ? 'Request my free estimate' : 'Continue'} /></div>
            </fieldset>
          </form>
        </>}
      </section>
    </div>
  </div>;
}
