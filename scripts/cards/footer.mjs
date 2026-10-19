// Sign-off: the pup drifts across the bottom of the profile.
import { pixelText } from '../lib/pixel.mjs';
import { cat, cone, sparkle } from '../lib/sprites.mjs';
import { waves } from './header.mjs';
import { cycle, doc, text } from '../lib/svg.mjs';
import { C } from '../lib/theme.mjs';

const W = 900;
const H = 216;

export function footer(profile) {
  const ROAD = 166;
  const title = pixelText('thanks for floating by ~', { x: W / 2, y: 22, size: 5, fill: C.ink, shadow: C.pale, align: 'center' });
  const c = cone();
  const cones = [120, 330, 560, 770].map((x) => c.svg(x, ROAD + 14 - c.h * 3, 3)).join('');
  const S = 3;
  const kitty = `<g>${cat(0).svg(0, ROAD + 18 - 25 * S, S)}${cycle('opacity', [1, 0], 1.2)}</g><g opacity="0">${cat(1).svg(0, ROAD + 18 - 25 * S, S)}${cycle('opacity', [0, 1], 1.2)}</g>`;
  const trail = [0, 1, 2].map((k) => `<g opacity="0">${sparkle([C.sky, C.orange, C.pink][k]).svg(-20 - k * 22, ROAD - 40 + (k % 2) * 16, 2)}<animate attributeName="opacity" values="0;1;0" dur=".9s" begin="${k * 0.3}s" repeatCount="indefinite"/></g>`).join('');
  const body = `<g class="smooth"><rect x="9" y="11" width="882" height="${H - 18}" rx="20" fill="${C.shadow}"/>
<rect x="2" y="4" width="882" height="${H - 18}" rx="20" fill="${C.paper}"/>
<rect x="2" y="4" width="882" height="${H - 18}" rx="20" fill="url(#dots)"/></g>
<clipPath id="card"><rect x="2" y="4" width="882" height="${H - 18}" rx="20"/></clipPath>
<g clip-path="url(#card)">
<rect x="0" y="${ROAD}" width="${W}" height="66" fill="${C.sea}"/>
${waves(ROAD + 2, W, { dur: 4 })}
${cones}
<g>${trail}${kitty}<animateTransform attributeName="transform" type="translate" from="-140 0" to="${W + 60} 0" dur="24s" repeatCount="indefinite"/></g>
<rect x="0" y="${ROAD + 12}" width="${W}" height="60" fill="${C.sea}" opacity=".6"/>
</g>
<rect class="smooth" x="2" y="4" width="882" height="${H - 18}" rx="20" fill="none" stroke="${C.ink}" stroke-width="3"/>
${title.svg}
${text(`“${profile.quote}”`, { x: W / 2, y: 92, size: 15, fill: C.inkSoft, anchor: 'middle' })}`;
  return doc(W, H, {
    title: 'thanks for floating by',
    desc: `Thanks for floating by — “${profile.quote}” The white pup drifts past rubber ducks.`,
    defs: `<pattern id="dash" width="64" height="4" patternUnits="userSpaceOnUse"><rect width="32" height="4" fill="${C.paper}" opacity=".85"/></pattern>`,
    body,
  });
}
