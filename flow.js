// One synchronized cycle: claim ETH, split 80/20, then distribute to three users.
function flowToken(path, currency, start, end) {
  const duration = '8s';
  const motion = `<animateMotion path="${path}" dur="${duration}" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;${start};${end};1"/>`;
  const visibility = `<animate attributeName="opacity" dur="${duration}" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;${start};${start + .015};${end - .015};${end};1"/>`;
  // Animate dashes on the connector itself, so the trail follows every bend.
  // Butt caps and the same stroke width keep its paint inside the base line.
  const geometry = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  geometry.setAttribute('d', path);
  const length = geometry.getTotalLength();
  const trail = [
    {size: 34, opacity: .16},
    {size: 23, opacity: .27},
    {size: 12, opacity: .50}
  ].map(({size, opacity}) => {
    const offset = size + 11;
    return `<path d="${path}" fill="none" stroke="#c4e97d" stroke-width="1.5" stroke-linecap="butt" stroke-linejoin="round" stroke-opacity="${opacity}" stroke-dasharray="${size} ${length * 2}" stroke-dashoffset="${offset}"><animate attributeName="stroke-dashoffset" dur="${duration}" repeatCount="indefinite" calcMode="linear" values="${offset};${offset};${offset - length};${offset - length}" keyTimes="0;${start};${end};1"/></path>`;
  }).join('');
  const mark = currency === 'sol'
    ? `<circle r="9.5" fill="#0b0b0b"/><image href="/assets/solana-logo.svg" x="-7" y="-6.1" width="14" height="12.2"/>`
    : `<circle r="9.5" fill="#2775ca"/><g fill="none" stroke="white" stroke-width=".9" stroke-linecap="round"><path d="M-5.8-5.4a8 8 0 0 0 0 10.8M5.8-5.4a8 8 0 0 1 0 10.8M0-6v12M3-3.5H-.9a2 2 0 0 0 0 4h1.8a2 2 0 0 1 0 4H-3"/></g>`;
  return `<g class="flow-packet flow-trail" opacity="0" aria-hidden="true">${visibility}${trail}</g>
    <g class="flow-packet" data-currency="${currency}" opacity="0" aria-hidden="true">${visibility}${motion}<circle r="12" fill="#111" stroke="#c4e97d" stroke-width="1.6"/>${mark}</g>`;
}

function flowLabel(x, y, lines, anchor = 'middle') {
  return `<text class="node-label" x="${x}" y="${y}" style="text-anchor:${anchor}">${lines.map((line, i) => `<tspan x="${x}" dy="${i ? 18 : 0}">${line}</tspan>`).join('')}</text>`;
}

function flowNode(x, y, type) {
  const circle = `<circle class="flow-node" cx="${x}" cy="${y}" r="28"/>`;
  if (type === 'pump') return `${circle}<g transform="translate(${x} ${y}) rotate(42)"><rect x="-5" y="-11" width="10" height="22" rx="5" fill="#84d8ad"/><path d="M-5 0v-6a5 5 0 0 1 10 0v6Z" fill="#e7f8ef"/><path d="M-5 0h10" stroke="#5f9e7d"/></g>`;
  if (type === 'split') return `<circle class="split-ring" cx="${x}" cy="${y}" r="39"/>${circle}<clipPath id="flow-split-logo"><circle cx="${x}" cy="${y}" r="26"/></clipPath><image href="/assets/split-pfp.png" x="${x - 35}" y="${y - 35}" width="70" height="70" clip-path="url(#flow-split-logo)"/>`;
  if (type === 'anyswap') return `${circle}<image href="/assets/anyswaplogo.svg" x="${x - 15}" y="${y - 12}" width="30" height="24"/>`;
  if (type === 'balance') return `${circle}<svg class="x-money-icon" x="${x - 16}" y="${y - 16}" width="32" height="32" viewBox="75 45 250 310"><image href="/assets/x-money.png" width="400" height="400"/></svg>`;
  const paths = {
    claim: '<path d="M12 2v13m-4-4 4 4 4-4M3 15v6h18v-6"/>',
    user: '<circle cx="12" cy="6" r="4.5"/><path d="M4 23v-2a8 8 0 0 1 16 0v2"/>'
  };
  return `${circle}<g transform="translate(${x - 12} ${y - 12})" fill="none" stroke="#eee" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[type]}</g>`;
}

function diagram() {
  const mobile = window.matchMedia('(max-width:760px)').matches;
  const layout = mobile ? {
    width: 360, height: 628,
    pump: [180, 53], claim: [180, 158], anyswap: [91, 278], balance: [91, 397], burn: [276, 278],
    users: [[60, 545], [180, 545], [300, 545]],
    input: 'M180 81V130',
    payout: 'M180 186C180 220 91 213 91 250',
    conversion: 'M63 278H53Q30 278 30 301V374Q30 397 53 397H63',
    buyback: 'M180 186C180 220 276 213 276 250',
    distribution: [
      'M119 397H162Q180 397 180 415V462Q180 480 162 480H78Q60 480 60 498V517',
      'M119 397H162Q180 397 180 415V517',
      'M119 397H162Q180 397 180 415V462Q180 480 198 480H282Q300 480 300 498V517'
    ],
    shareLabels: [[101, 222, '80%'], [264, 222, '20%']]
  } : {
    width: 1000, height: 452,
    pump: [86, 227], claim: [263, 227], anyswap: [476, 133], balance: [671, 133], burn: [476, 346],
    users: [[887, 66], [887, 175], [887, 284]],
    input: 'M114 227H235',
    payout: 'M291 227C373 227 328 133 414 133H448',
    conversion: 'M504 133H643',
    buyback: 'M291 227C373 227 328 346 414 346H448',
    distribution: [
      'M699 133H724C793 133 760 66 828 66H859',
      'M699 133H724C793 133 760 175 828 175H859',
      'M699 133H724C793 133 760 284 828 284H859'
    ],
    shareLabels: [[403, 119, '80%'], [403, 369, '20%']]
  };
  const {pump, claim, anyswap, balance, burn, users} = layout;
  const paths = [layout.input, layout.payout, layout.conversion, layout.buyback, ...layout.distribution];
  const labels = mobile
    ? flowLabel(225, 58, ['ponsfamily.com'], 'start') + flowLabel(225, 163, ['Fees claimed'], 'start')
    : flowLabel(pump[0], pump[1] + 50, ['ponsfamily.com']) + flowLabel(claim[0], claim[1] + 50, ['Fees claimed']);
  return `<svg class="flow-svg capital-flow-svg${mobile ? ' mobile-flow-svg' : ''}" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-labelledby="flow-title flow-description">
    <title id="flow-title">SPLITX capital flow</title>
    <desc id="flow-description">ETH creator fees flow from ponsfamily.com to Fees claimed. 80% flows as USDC through ANYSWAP API to the X Money balance, then splits into payments to three X users. The remaining 20% flows as ETH to buy back and burn $SPLITX.</desc>
    ${paths.map(path => `<path class="flow-path" d="${path}"/>`).join('')}
    ${flowToken(layout.input, 'sol', .02, .22)}
    ${flowToken(layout.payout, 'usdc', .22, .45)}
    ${flowToken(layout.buyback, 'sol', .22, .45)}
    ${flowToken(layout.conversion, 'usdc', .45, .63)}
    ${layout.distribution.map(path => flowToken(path, 'usdc', .63, .96)).join('')}
    ${flowNode(...pump, 'pump')}${flowNode(...claim, 'claim')}${flowNode(...anyswap, 'anyswap')}${flowNode(...balance, 'balance')}${flowNode(...burn, 'split')}
    ${users.map(([x,y]) => flowNode(x, y, 'user') + flowLabel(x, y + 49, ['Sent to X user'])).join('')}
    ${labels}
    ${flowLabel(anyswap[0], anyswap[1] + 49, ['Off-ramp through', 'ANYSWAP API'])}
    ${flowLabel(balance[0], balance[1] + 49, ['Sent to X Money', 'balance'])}
    ${flowLabel(burn[0], burn[1] + 49, ['$SPLITX bought back', 'and burnt'])}
    ${layout.shareLabels.map(([x,y,label]) => `<text class="percent-label" x="${x}" y="${y}" text-anchor="middle">${label}</text>`).join('')}
  </svg>`;
}

function flowCard() {
  return `<section class="flow-card" aria-label="Capital flow diagram"><div id="diagram">${diagram()}</div></section>`;
}
