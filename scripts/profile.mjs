// Everything the cards say. Edit this, then run:  node scripts/build.mjs
// (header, status and skate log are redrawn every day by .github/workflows/daily.yml)

export const PROFILE = {
  login: 'Nongdrream', // GitHub username — used for the skate log
  name: 'dream',
  birthday: '2010-01-01', // TODO: real birthday — level = age, XP bar fills up towards the next birthday

  // the typewriter under the name (keep each line ≤ 22 characters so it clears the cat)
  taglines: [
    "hi, i'm phattaradit ~",
    'sysadmin · web dev',
    'linux & home lab ☁',
    'cpe @ rmutp',
    'code with heart ✦',
  ],

  status: [
    ['CLASS', 'sysadmin ✦ web dev'],
    ['GUILD', 'Pranakorn Group'],
    ['SCHOOL', 'RMUTP · Computer Eng.'],
  ],

  // icons live in scripts/lib/sprites.mjs → ICONS
  inventory: [
    ['linux', 'linux'],
    ['docker', 'docker'],
    ['nextjs', 'next.js'],
    ['react', 'react'],
    ['javascript', 'javascript'],
    ['python', 'python'],
  ],

  // link buttons under the header (the README wraps each one in its link)
  links: [
    { file: 'link-web.svg', icon: 'globe', label: 'WEBSITE', handle: 'phattaradit.dev', url: 'https://phattaradit.dev/' },
    { file: 'link-contact.svg', icon: 'mail', label: 'CONTACT', handle: 'say hi ✦', url: 'https://contact.phattaradit.dev/' },
    { file: 'link-discord.svg', icon: 'discord', label: 'DISCORD', handle: 'add me', url: 'https://discord.com/users/693671896717328384' },
    { file: 'link-github.svg', icon: 'github', label: 'GITHUB', handle: '@Nongdrream', url: 'https://github.com/Nongdrream?tab=repositories' },
  ],

  // quest log — thumbnails live in assets/art/ (400×300 webp); without `art` the card draws `badge` instead
  quests: [
    { title: 'SuperTool', badge: 'ST', year: '2026', what: 'self-hosted clip downloader & file converter', prize: 'SELF-HOSTED', where: 'home lab', tags: ['Python', 'Docker'] },
    { title: 'VRN Web 2.0', badge: 'VRN', year: '2026', what: 'school website + admin backend', prize: 'LIVE', where: 'vrn.ac.th', tags: ['TS', 'Next.js'] },
    { title: 'Cert VRN', badge: 'CERT', year: '2026', what: 'school certificate archive', prize: 'SHIPPED', where: 'vrn.ac.th', tags: ['TS'] },
    { title: 'Serpantinum', badge: 'QML', year: '2026', what: 'my hyprland desktop shell rice', prize: 'DAILY DRIVER', where: 'arch linux', tags: ['QML', 'Hyprland'] },
  ],
  moreQuests: '+ more on phattaradit.dev',

  hobbies: [
    ['drone', 'DRONE PILOT', 'flying fpv in the sky'],
    ['camera', 'LIVE STREAM', 'ob & stream production'],
    ['robot', 'AI TINKERING', 'playing with ai models'],
  ],

  stats: [
    ['ISTP', 'mbti personality'],
    ['24/7', 'home lab uptime'],
    ['MAX', 'plushies & cuteness'],
    ['16', 'repos & counting'],
  ],

  quote: 'code with heart, deploy with logic.',
};
