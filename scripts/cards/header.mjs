// The banner: name, typewriter, the season's sky over the open sea, and the
// pup floating in its swim ring. Redrawn daily so the season and birthday flip on time.
import { pixelText, round, textStops } from '../lib/pixel.mjs';
import { bird, cat, cloud, cone, sparkle, sun } from '../lib/sprites.mjs';
import { cycle, doc, esc } from '../lib/svg.mjs';
import { C } from '../lib/theme.mjs';

const W = 900;
const H = 320;
const X0 = 2;
const Y0 = 2;
const PW = 890;
const PH = 308;
const ROAD = 238; // the horizon

const SEASONS = {
  cool: { label: 'COOL SEASON', sky: ['#C9E3FF', '#F4F8FD'], far: '#D3E4F7', farLight: '#E8F1FB' },
  hot: { label: 'HOT SEASON', sky: ['#FFE2B8', '#FFF7EA'], far: '#F6D9C2', farLight: '#FBEADB' },
  rainy: { label: 'RAINY SEASON', sky: ['#BCCBE0', '#E4EBF4'], far: '#B4C5DC', farLight: '#CCD8E8' },
};

// ── typewriter ──────────────────────────────────────────────────────────────
function typewriter(lines, { x, y, size }) {
  const TYPE = 0.075;
  const HOLD = 2.4;
  const ERASE = 0.03;
  const GAP = 0.35;
  const plan = lines.map((line) => {
    const stops = textStops(line).map((s) => s * size);
    const n = [...line].length;
    return { line, stops, n, dur: n * TYPE + HOLD + n * ERASE + GAP };
  });
  const total = plan.reduce((t, p) => t + p.dur, 0);
  const kt = (t) => Math.min(1, t / total).toFixed(4);

  let svg = '';
  let start = 0;
  const cursor = []; // [time, x]
  plan.forEach((p, i) => {
    const frames = [[0, 0]];
    let t = start;
    for (let k = 1; k <= p.n; k++) frames.push([t + k * TYPE, p.stops[k]]);
    t += p.n * TYPE + HOLD;
    for (let k = p.n - 1; k >= 0; k--) frames.push([t + (p.n - k) * ERASE, p.stops[k]]);
    frames.push([start + p.dur, 0]);
    if (start > 0) frames.splice(1, 0, [start, 0]);
    frames.forEach(([ft, fx]) => cursor.push([ft, fx]));

    const values = frames.map(([, w]) => w + (w ? size : 0)).join(';');
    const times = frames.map(([ft]) => kt(ft)).join(';');
    svg += `<clipPath id="tw${i}"><rect x="${x}" y="${y - size * 2}" width="0" height="${size * 12}"><animate attributeName="width" values="${values}" keyTimes="${times}" dur="${round(total)}s" calcMode="discrete" repeatCount="indefinite"/></rect></clipPath>`;
    svg += `<g clip-path="url(#tw${i})">${pixelText(p.line, { x, y, size, fill: C.ink }).svg}</g>`;
    start += p.dur;
  });

  cursor.sort((a, b) => a[0] - b[0]);
  const cx = cursor.map(([, cxv]) => x + cxv + (cxv ? size * 2 : 0)).join(';');
  const ct = cursor.map(([t]) => kt(t)).join(';');
  svg += `<rect x="${x}" y="${y - size}" width="${size * 3}" height="${size * 9}" fill="${C.blue}"><animate attributeName="x" values="${cx}" keyTimes="${ct}" dur="${round(total)}s" calcMode="discrete" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" calcMode="discrete" repeatCount="indefinite"/></rect>`;
  return svg;
}

// ── weather ─────────────────────────────────────────────────────────────────
function clouds(season) {
  const tint = season === 'rainy' ? ['#EEF2F8', '#D3DCE8'] : [C.white, C.mist];
  const spots = season === 'rainy'
    ? [[40, 20, 4], [300, 8, 5], [560, 26, 4], [760, 6, 5]]
    : season === 'hot' ? [[420, 30, 3], [610, 60, 2]] : [[380, 28, 3], [620, 70, 2], [140, 120, 2], [820, 40, 3]];
  const one = (dx) => spots.map(([x, y, s]) => cloud(...tint).svg(x + dx, y, s)).join('');
  const dur = season === 'rainy' ? 70 : 140;
  return `<g opacity="${season === 'rainy' ? 0.95 : 0.9}"><g>${one(0)}${one(1000)}<animateTransform attributeName="transform" type="translate" from="0 0" to="-1000 0" dur="${dur}s" repeatCount="indefinite"/></g></g>`;
}

function rain() {
  const drops = [[4, 0], [22, 26], [13, 44], [33, 12]].map(([x, y]) => `<rect x="${x}" y="${y}" width="2" height="9" fill="${C.sky}" opacity=".75"/>`).join('');
  return `<pattern id="rain" width="40" height="60" patternUnits="userSpaceOnUse">${drops}</pattern>
<g><rect x="-40" y="-60" width="${W + 80}" height="${ROAD + 60}" fill="url(#rain)"/><animateTransform attributeName="transform" type="translate" values="6 -60;0 0" dur=".45s" repeatCount="indefinite"/></g>`;
}

function weather(season) {
  if (season === 'hot') {
    const s = sun(16);
    return `<g><circle class="smooth" cx="720" cy="104" r="70" fill="#FFD27A" opacity=".35"><animate attributeName="r" values="62;74;62" dur="4s" repeatCount="indefinite"/></circle>${s.svg(720 - 17 * 4, 104 - 17 * 4, 4)}</g>${clouds(season)}`;
  }
  if (season === 'rainy') return clouds(season);
  const flap = (x, y) => `<g>${bird(0).svg(x, y, 3)}${cycle('opacity', [1, 0], 0.7)}</g><g opacity="0">${bird(1).svg(x, y, 3)}${cycle('opacity', [0, 1], 0.7)}</g>`;
  const birds = `<g>${flap(0, 0)}<g transform="translate(26 14)">${flap(0, 0)}</g><animateTransform attributeName="transform" type="translate" from="${W + 40} 70" to="-120 40" dur="38s" repeatCount="indefinite"/></g>`;
  return `${sun(9).svg(668, 52, 4)}${clouds(season)}${birds}`;
}

// ── the sea ─────────────────────────────────────────────────────────────────
// a strip of scalloped foam that scrolls sideways forever
export function waves(y, w, { dur = 3, color = C.foam, op = 1 } = {}) {
  const bump = `<pattern id="wv${y}" width="48" height="12" patternUnits="userSpaceOnUse"><path class="smooth" d="M0 12 Q12 0 24 12 Q36 0 48 12 Z" fill="${color}"/></pattern>`;
  return `${bump}<g opacity="${op}"><rect x="-48" y="${y - 12}" width="${w + 96}" height="12" fill="url(#wv${y})"/><animateTransform attributeName="transform" type="translate" from="0 0" to="48 0" dur="${dur}s" repeatCount="indefinite"/></g>`;
}

function sea(season) {
  let svg = `<rect x="0" y="${ROAD}" width="${W}" height="${H - ROAD}" fill="${C.sea}"/>
<rect x="0" y="${ROAD + 40}" width="${W}" height="${H - ROAD}" fill="${C.seaDeep}" opacity=".45"/>
${waves(ROAD + 4, W, { dur: 5, color: C.foam })}
${[[120, 262], [380, 300], [640, 270], [820, 296]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="26" height="3" fill="${C.foam}" opacity=".8"><animate attributeName="opacity" values=".8;.1;.8" dur="2.4s" begin="${i * 0.5}s" repeatCount="indefinite"/></rect>`).join('')}`;
  if (season === 'rainy') {
    svg += [[140, 268], [470, 296], [800, 262]].map(([x, y], i) => `<ellipse class="smooth" cx="${x}" cy="${y}" rx="6" ry="2" fill="none" stroke="${C.foam}" stroke-width="2"><animate attributeName="rx" values="4;22" dur="1.4s" begin="${i * 0.45}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.4s" begin="${i * 0.45}s" repeatCount="indefinite"/></ellipse>`).join('');
  }
  return svg;
}

function float() {
  const S = 6;
  const CX = 700; // pup centre
  const LANE = 292; // waterline the ring sits in
  const c = cone();
  const GAP = 230;
  const ducks = [];
  for (let x = -GAP; x <= W + GAP; x += GAP) ducks.push(c.svg(x, LANE - 6 - c.h * 3, 3));
  const duckRow = `<g>${ducks.join('')}<animateTransform attributeName="transform" type="translate" from="0 0" to="${-GAP} 0" dur="9s" repeatCount="indefinite"/></g>`;
  const pup = (f) => cat(f).svg(CX - 14 * S, LANE - 23.5 * S, S);
  const flap = `<g>${pup(0)}<animate attributeName="opacity" values="1;0;1" keyTimes="0;.8;.9" dur="3s" calcMode="discrete" repeatCount="indefinite"/></g><g opacity="0">${pup(1)}<animate attributeName="opacity" values="0;1;0" keyTimes="0;.8;.9" dur="3s" calcMode="discrete" repeatCount="indefinite"/></g>`;
  const bobbing = `<animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="2.4s" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1" repeatCount="indefinite"/>`;
  const ripple = `<ellipse class="smooth" cx="${CX}" cy="${LANE + 4}" rx="90" ry="9" fill="none" stroke="${C.foam}" stroke-width="3"><animate attributeName="rx" values="84;100;84" dur="2.4s" repeatCount="indefinite"/></ellipse>`;
  return `${duckRow}${ripple}<g>${flap}${bobbing}</g>
<rect x="0" y="${LANE - 2}" width="${W}" height="${H - LANE + 2}" fill="${C.sea}" opacity=".55"/>
${waves(LANE + 2, W, { dur: 2.6, color: C.sea, op: 0.9 })}`;
}

function confetti() {
  const colors = [C.orange, C.pink, C.yellow, C.sky, C.green];
  let svg = '';
  for (let i = 0; i < 28; i++) {
    const x = (i * 137) % 880 + 10;
    const dur = 3 + (i % 5) * 0.6;
    svg += `<rect x="${x}" y="-10" width="6" height="${i % 2 ? 6 : 10}" fill="${colors[i % colors.length]}"><animateTransform attributeName="transform" type="translate" values="0 0;${(i % 3) * 10 - 10} ${ROAD + 20}" dur="${dur}s" begin="${-(i * 0.37) % dur}s" repeatCount="indefinite"/></rect>`;
  }
  return svg;
}

export function header(profile, { season, level }) {
  const s = SEASONS[season];
  const lines = level.isBirthday ? ['happy birthday ♥', `level up! lv.${level.level}`, ...profile.taglines] : profile.taglines;
  const name = pixelText(profile.name, { x: 48, y: 34, size: 12, fill: C.ink, shadow: C.pale });
  const badge = pixelText(s.label, { x: 862, y: 24, size: 2, fill: C.inkSoft, align: 'right' });
  const sparkles = [[640, 40, C.sky, 0], [600, 150, C.orange, 1.2], [40, 160, C.pink, 2.1]]
    .map(([x, y, col, d]) => `<g opacity="0">${sparkle(col).svg(x, y, 3)}<animate attributeName="opacity" values="0;1;0" dur="3s" begin="${d}s" repeatCount="indefinite"/></g>`).join('');

  const desc = `${profile.name}: a white floppy-eared pup floats in a pink swim ring on the open sea with rubber ducks (${s.label.toLowerCase()} sky), while a typewriter cycles: ${lines.join(' / ')}`;

  const body = `<rect x="${X0 + 7}" y="${Y0 + 7}" width="${PW}" height="${PH}" rx="20" fill="${C.shadow}" class="smooth"/>
<g clip-path="url(#card)">
<rect x="0" y="0" width="${W}" height="${H}" fill="url(#sky)"/>
<rect x="0" y="0" width="${W}" height="${ROAD}" fill="url(#dots)" opacity=".5"/>
${weather(season)}
${season === 'rainy' ? rain() : ''}
${sea(season)}
${float()}
${level.isBirthday ? confetti() : ''}
${sparkles}
${name.svg}
${typewriter(lines, { x: 52, y: 176, size: 4 })}
${badge.svg}
</g>
<rect x="${X0}" y="${Y0}" width="${PW}" height="${PH}" rx="20" fill="none" stroke="${C.ink}" stroke-width="3" class="smooth"/>`;

  return doc(W, H, {
    title: `${profile.name} — ${esc(lines[0])}`,
    desc,
    defs: `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.sky[0]}"/><stop offset=".75" stop-color="${s.sky[1]}"/></linearGradient>
<clipPath id="card"><rect x="${X0}" y="${Y0}" width="${PW}" height="${PH}" rx="20"/></clipPath>`,
    body,
  });
}
