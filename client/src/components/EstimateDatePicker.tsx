'use client';

import { useRef, useState } from 'react';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';

export function friendlyDate(value: string) {
  return value ? new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`)) : '';
}
export function friendlyTime(value: string) {
  if (!value) return '';
  const hour = Number(value.slice(0, 2));
  return `${hour % 12 || 12}:${value.slice(3)} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export default function EstimateDatePicker({ value, days, unavailable, onChange, label }: {
  value: string; days: string[]; unavailable: string[]; onChange: (value: string) => void; label: string;
}) {
  const months = [...new Set(days.map(day => day.slice(0, 7)))];
  const [monthIndex, setMonthIndex] = useState(Math.max(0, months.indexOf(value?.slice(0, 7))));
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const month = months[monthIndex];
  const first = new Date(`${month}-01T12:00:00Z`);
  const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const title = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
  return <div className="min-w-0">
    <span className="text-small-bold">Preferred day *</span>
    <details ref={details} className="group mt-2 rounded-lg border border-neutral-300 bg-white open:border-primary-500" onKeyDown={event => {
      if (event.key === 'Escape' && details.current) { details.current.open = false; summary.current?.focus(); }
    }}>
      <summary ref={summary} aria-label={`${label}: ${value ? friendlyDate(value) : 'Choose a date'}`} className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 text-base focus-visible:outline-2 focus-visible:outline-primary-500 [&::-webkit-details-marker]:hidden">
        <span className={value ? 'text-neutral-950' : 'text-neutral-700'}>{value ? friendlyDate(value) : 'Choose a date'}</span><CalendarMonthOutlined className="text-primary-800" fontSize="small" />
      </summary>
      <div role="group" aria-label={`${label} calendar`} className="border-t border-neutral-200 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button type="button" aria-label="Previous month" disabled={monthIndex === 0} onClick={() => setMonthIndex(monthIndex - 1)} className="rounded p-2 hover:bg-primary-50 disabled:opacity-30"><ChevronLeft fontSize="small" /></button>
          <p aria-live="polite" className="text-small-bold">{title}</p>
          <button type="button" aria-label="Next month" disabled={monthIndex === months.length - 1} onClick={() => setMonthIndex(monthIndex + 1)} className="rounded p-2 hover:bg-primary-50 disabled:opacity-30"><ChevronRight fontSize="small" /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-small">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <span key={`day-${i}`} aria-hidden="true" className="py-2 text-neutral-700">{day}</span>)}
          {Array.from({ length: first.getUTCDay() }, (_, i) => <span key={`blank-${i}`} />)}
          {Array.from({ length: count }, (_, i) => {
            const date = `${month}-${String(i + 1).padStart(2, '0')}`;
            return <button type="button" key={date} disabled={!days.includes(date) || unavailable.includes(date)} aria-label={friendlyDate(date)} aria-pressed={value === date} onClick={() => {
              onChange(date); if (details.current) details.current.open = false; summary.current?.focus();
            }} className={`min-h-11 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-primary-700 disabled:cursor-not-allowed disabled:text-neutral-300 ${date === value ? 'bg-primary-500 text-neutral-950 font-bold' : 'enabled:hover:bg-primary-50'}`}>{i + 1}</button>;
          })}
        </div>
        <p className="mt-3 text-small text-neutral-700">Weekdays only · Pacific time</p>
      </div>
    </details>
  </div>;
}
