type EstimateKind = 'ev' | 'panel';

const choices: Record<string, string> = {
  hardwired: 'Hardwired charger', nema: 'NEMA 14-50 receptacle',
  yes: 'Yes', no: 'No', unsure: 'Not sure',
  indoors: 'Indoors', outdoors: 'Outdoors', both: 'Indoors and outdoors',
};
function visitDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
}
function visitTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) return value;
  const hour = Number(value.slice(0, 2));
  return `${hour % 12 || 12}:${value.slice(3)} ${hour >= 12 ? 'PM' : 'AM'}`;
}

// This is used only by the explicitly enabled personal-site preview.
export function netlifyTestFields(kind: EstimateKind, values: Record<string, string>, reference: string): Record<string, string> {
  const answer = (key: string) => choices[values[key]] || values[key] || 'Not provided';
  const details = kind === 'ev' ? [
    `Installation: ${answer('charger')}`,
    `Location: ${answer('location')}`,
    ...(values.charger === 'hardwired' ? [`Providing charger: ${answer('supply')}`] : []),
    `Within 10 feet of panel: ${answer('distance')}`,
  ] : [
    `Number of panels: ${answer('count')}`,
    `Location: ${answer('location')}`,
    `Existing amperage known: ${values.known === 'no' ? 'Not sure' : answer('known')}`,
    ...(values.known === 'yes' ? Array.from({ length: Math.min(6, Math.max(0, Number(values.count) || 0)) }, (_, i) =>
      `Panel ${i + 1}: ${values[`amps${i}`] === 'other' ? values[`other${i}`] : values[`amps${i}`]} amps`) : []),
  ];
  const visits = kind === 'ev' && values.distance !== 'yes'
    ? [0, 1, 2].map(i => `${visitDate(values[`date${i}`])}: ${visitTime(values[`from${i}`])}–${visitTime(values[`to${i}`])} Pacific time`).join('\n')
    : 'Not requested';
  return {
    'form-name': kind === 'ev' ? 'estimate-ev-test' : 'estimate-panel-test',
    'Notice': 'TEST ONLY — no estimate was sent to WordPress or Housecall Pro.',
    'Request': kind === 'ev' ? 'EV charger' : 'Panel replacement',
    'Customer': [values.first, values.last].filter(Boolean).join(' '),
    'Phone': values.phone || '',
    'Email': values.email || '',
    'Service address': [values.street, values.unit, values.city, values.state, values.zip].filter(Boolean).join(', '),
    'Project details': details.join('\n'),
    'Visit preferences': visits,
    'Additional comments': values.comments || 'None',
    'Test time (Pacific)': new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'full', timeStyle: 'short' }).format(new Date()),
    'Reference': reference,
  };
}

export function netlifyLiveFields(kind: EstimateKind, values: Record<string, string>, reference: string, status: string): Record<string, string> {
  const fields = netlifyTestFields(kind, values, reference);
  fields['form-name'] = kind === 'ev' ? 'estimate-ev-notification' : 'estimate-panel-notification';
  fields.Notice = status === 'needs_attention'
    ? 'You received a new estimate request. We saved the request, but could not confirm delivery to Housecall Pro. Please check WordPress for the details.'
    : 'You received a new estimate request. Please check Housecall Pro for details. If it is missing there, check WordPress.';
  fields['Notification time (Pacific)'] = fields['Test time (Pacific)'];
  delete fields['Test time (Pacific)'];
  return fields;
}

export async function sendNetlifyLiveNotification(kind: EstimateKind, values: Record<string, string>, reference: string, status: string) {
  const response = await fetch('/estimate-notification.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(netlifyLiveFields(kind, values, reference, status)).toString(),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error('Netlify did not accept the notification');
}

export async function sendNetlifyTestNotification(kind: EstimateKind, values: Record<string, string>, reference: string) {
  const response = await fetch('/estimate-notification-test.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(netlifyTestFields(kind, values, reference)).toString(),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error('Netlify did not accept the test submission');
}
