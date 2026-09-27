const icons = {
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
 search:'<circle cx="10.8" cy="10.8" r="7.4"/><path d="m16 16 5 5"/>',
 analytics:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 16v-4m5 4V7m5 9v-6"/>',
 launch:'<path d="M12 16 8 12c1-5 5-9 13-9 0 8-4 12-9 13ZM8 12l-5 1 4-6 5-1m0 10-1 5 6-4 1-5M7 17l-3 3m0-3-1 4 4-1"/><circle cx="16" cy="8" r="1.5"/>',
 flow:'<circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 12h3a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3h1M10 12a3 3 0 0 1 3 3v1a3 3 0 0 0 3 3h1"/>',
 docs:'<path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M8 8h5M8 12h3m1 5 6-6a2 2 0 0 1 3 3l-6 6-4 1Z"/>',
 chevron:'<path d="m13 7-5 5 5 5m5-10-5 5 5 5"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 claim:'<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>',
 people:'<path d="M3 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2m1-7a5 5 0 0 1 5 5v2"/><circle cx="9" cy="6" r="4"/><path d="M16 2a4 4 0 0 1 0 8"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 edit:'<path d="m16 3 5 5M4 16 16 4a3 3 0 0 1 4 4L8 20l-5 1Z"/>',
 pause:'<path d="M8 5v14M16 5v14"/>',
 play:'<path d="m7 4 14 8-14 8Z"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>'
};
const icon = (name, cls='') => name === 'payments'
 ? `<svg class="x-money-icon ${cls}" viewBox="75 45 250 310" aria-hidden="true"><image href="/assets/x-money.png" width="400" height="400"/></svg>`
 : `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.flow}</svg>`;
const esc = (value) => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav = [{name:'Home',path:'/home',icon:'home'},{name:'Explore',path:'/explore',icon:'search'},{name:'Payments',path:'/payments',icon:'payments'},{name:'Analytics',path:'/analytics',icon:'analytics'},{name:'Launch',path:'/launch',icon:'launch'},{name:'Capital Flow',path:'/capital-flow',icon:'flow'},{name:'Docs',path:'/docs',icon:'docs'}];
let currentRoute='';
let pageCleanup=()=>{};
const main=document.querySelector('#main');
document.querySelector('#collapse').innerHTML=icon('chevron');
document.querySelector('#mobile-menu').innerHTML=icon('menu');
document.querySelector('#search-icon').innerHTML=icon('search');
document.querySelector('#navigation').innerHTML=nav.map(n=>`<a class="nav-link" href="${n.path}" title="${n.name}">${icon(n.icon)}<span>${n.name}</span></a>`).join('');

function steps(){return `<section class="how-section" aria-label="How SPLITX works">
 <article class="how-step"><span class="step-icon">${icon('launch')}</span><div><h3>Creator fees are claimed from ponsfamily.com</h3><p>Trading generates creator fees in ETH. Once claimed, the fees follow two paths: recipient payouts and $SPLITX buybacks and burns.</p></div></article>
 <article class="how-step"><span class="step-icon">${icon('payments')}</span><div><h3>80% goes to the X Money balance</h3><p>The recipient allocation moves through ANYSWAP API into the X Money balance, ready to be distributed.</p></div></article>
 <article class="how-step"><span class="step-icon">${icon('people')}</span><div><h3>Multiple X users receive their share</h3><p>The balance is split between the assigned X accounts. Each account receives its share of the recipient allocation.</p></div></article>
 <article id="split-buybacks" class="how-step"><span class="step-icon">${icon('flow')}</span><div><h3>20% buys back and burns $SPLITX</h3><p>The remaining allocation stays on the ETH path to buy back $SPLITX and burn the purchased tokens.</p></div></article>
 </section>`;}
function capitalPage(){return `<div class="page-heading"><h1>Capital flow</h1><p class="intro">Creator fees from ponsfamily.com are claimed and split. <strong>80%</strong> goes to the X Money balance for payouts to multiple X accounts. <strong>20%</strong> buys back and burns $SPLITX.</p></div>
 <section class="flow-explanation"><h2>How the fees split</h2><ol><li>Creator fees from ponsfamily.com are claimed in ETH.</li><li>80% goes through ANYSWAP API to the X Money balance, then splits between the assigned X accounts.</li><li>20% is used to buy back and burn $SPLITX.</li></ol></section>
 ${flowCard()}${steps()}
 <section class="faq"><h2>A few details</h2><details><summary>Can one token have multiple recipients?</summary><p>Yes. A token can assign its recipient allocation to multiple X accounts, each with its own share.</p></details><details><summary>How are creator fees divided?</summary><p>80% of claimed creator fees funds X account payouts. The other 20% buys back and burns $SPLITX. Each recipient’s chosen share applies to the 80% payout allocation.</p></details><details><summary>Does the diagram show real payments?</summary><p>The animation explains the fee flow. This is an explanation of the intended flow, not live payment activity. Automated claims, X Money payouts, buybacks, and burns are not enabled yet.</p></details></section>`;}
function emptyPage(route){
 const data={explore:['Explore','Tokens launched with shared creator fees.','No tokens to explore yet','Tokens will appear here once the SPLITX launchpad is connected.','search'],payments:['Payments','Creator-fee distributions across X accounts.','Coming soon','Verified distributions will appear here when live fee claims and payouts are connected.','payments'],analytics:['Analytics','An overview of token activity and creator fees.','No activity to report yet','Analytics will populate from verified token trades and creator-fee distributions.','analytics']}[route];
 return `<h1>${data[0]}</h1><p class="intro">${data[1]}</p>${route==='analytics'?'<div class="stat-grid"><div class="stat-card"><span>Tokens launched</span><strong>—</strong></div><div class="stat-card"><span>Creator fees allocated</span><strong>—</strong></div><div class="stat-card"><span>X recipients</span><strong>—</strong></div></div>':''}<section class="empty-state"><div class="empty-icon">${icon(data[4])}</div><h2>${data[2]}</h2><p>${data[3]}</p><a class="button primary" href="${route==='explore'?'/launch':'/capital-flow'}">${route==='explore'?'Prepare a launch':'View capital flow'} ${icon('arrow')}</a></section>`;
}
function docsPage(){return `<h1>Docs</h1><p class="intro">Launching tokens and sharing creator fees with SplitexPay.</p><div class="docs-content"><section><h2>Launch on ponsfamily.com</h2><ol><li>Connect your Robinhood Chain wallet.</li><li>Enter the token name, ticker, description, and image.</li><li>Assign 2–6 X accounts and percentages adding up to 100%.</li><li>Review the fee recipient and approve the image upload message.</li><li>Review the simulated transaction cost, then approve the launch in your wallet.</li></ol><p><a href="/launch">Open the launch form →</a></p></section><section><h2>Creator-fee destination</h2><p>Every SplitexPay launch sets this address as the ponsfamily.com creator-fee recipient:</p><code class="wallet-address">ARvq6DX6RLmvwmn9BqJfK7M3WEMZkzYR5cvzDxgchb3v</code><p>Creator fees accrue in a claimable vault. Claiming transfers them to this address. The deploying wallet pays transaction costs and any optional initial buy.</p></section><section><h2>Recipient allocations</h2><p>The token’s public metadata records the X handles and their shares of the planned 80% recipient allocation. The other 20% is allocated to $SPLITX buybacks and burns. These percentages do not divide the token supply.</p></section><section id="preview-status"><h2>Current availability</h2><p>Wallet connection and the ponsfamily.com launch integration are implemented. Live launches require the image-storage and Robinhood Chain services to be configured. Automated claims, X verification, X Money payouts, ANYSWAP conversion, buybacks, and burns are not enabled yet. The Capital Flow animation and Home preview cards illustrate the intended flow; they are not payment receipts.</p></section><section id="launch-setup"><h2>Owner setup</h2><p>Create a <a href="https://app.pinata.cloud/" target="_blank" rel="noopener noreferrer">Pinata account</a> with a Files-write API key, and a <a href="https://dashboard.helius.dev/" target="_blank" rel="noopener noreferrer">Helius account</a> with a Robinhood Chain mainnet RPC URL. Keep both credentials secret.</p><p>The local project includes <code>SETUP.md</code> and a terminal setup script. Run <code>node scripts/configure-services.mjs</code> in the project folder to enter both values privately. Production uses the corresponding server-side secrets.</p></section></div>`;}
function explorePage(){return `<div class="explore-heading"><div><h1>Explore</h1><p class="intro">Every token launched through SplitexPay.</p></div><a class="button primary" href="/launch">Launch a token</a></div><label class="explore-search">${icon('search')}<input id="explore-search" type="search" placeholder="Search name, ticker, contract or @account" value="${esc(new URLSearchParams(location.search).get('q')||'')}" aria-label="Search all tokens"></label><p id="token-list-status" class="token-list-status" role="status">Loading launches…</p><div id="home-tokens" class="home-real-tokens explore-tokens">${tokenSkeletons()}</div><div class="token-pagination"><button id="load-more-tokens" class="button" type="button" hidden>Load more</button></div>`;}
function render(path,scroll=true){
 pageCleanup();pageCleanup=()=>{};
 currentRoute=(path==='/'?'/home':path.replace(/\/$/,''))||'/home';
 const tokenMatch=currentRoute.match(/^\/token\/([1-9A-HJ-NP-Za-km-z]{32,44})$/);
 const page=nav.find(n=>n.path===currentRoute);
 document.title=currentRoute==='/home'?'SplitexPay - Split token fees through X Money':`${page?.name||'Page not found'} - SplitexPay`;
 document.querySelectorAll('.nav-link').forEach(a=>{const active=a.getAttribute('href')===(tokenMatch?'/explore':currentRoute);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(tokenMatch)main.innerHTML=tokenDetailPage();
 else if(currentRoute==='/capital-flow')main.innerHTML=capitalPage();
 else if(currentRoute==='/home')main.innerHTML=homePage();
 else if(currentRoute==='/launch')main.innerHTML=launchPage();
 else if(currentRoute==='/docs')main.innerHTML=docsPage();
 else if(currentRoute==='/explore')main.innerHTML=explorePage();
 else if(currentRoute==='/analytics')main.innerHTML=analyticsPage();
 else if(['/explore','/payments','/analytics'].includes(currentRoute))main.innerHTML=emptyPage(currentRoute.slice(1));
 else main.innerHTML='<h1>Page not found</h1><p class="intro">This page does not exist.</p><div class="home-links"><a class="button primary" href="/capital-flow">View capital flow</a></div>';
 if(tokenMatch)pageCleanup=bindTokenDetail(tokenMatch[1]);
 if(currentRoute==='/launch')bindLaunch();
 if(currentRoute==='/analytics')pageCleanup=bindAnalytics();
 if(currentRoute==='/home'||currentRoute==='/explore')pageCleanup=bindHome();
 document.body.classList.remove('menu-open');document.querySelector('#mobile-menu').setAttribute('aria-expanded','false');
 if(scroll)window.scrollTo(0,0);
}
function navigate(path){history.pushState({},'',path);render(location.pathname);main.focus({preventScroll:true});}
document.addEventListener('click',e=>{
 const close=e.target.closest('[data-close]');if(close){close.closest('dialog').close();return;}
 const a=e.target.closest('a');if(a&&a.origin===location.origin&&!a.hash&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();closeSearch();document.querySelector('#search').value='';navigate(a.pathname+a.search);}
 if(!e.target.closest('.search-wrap'))closeSearch();
 if(document.body.classList.contains('menu-open')&&!e.target.closest('.sidebar')&&!e.target.closest('#mobile-menu')){document.body.classList.remove('menu-open');document.querySelector('#mobile-menu').setAttribute('aria-expanded','false');}
});
window.addEventListener('popstate',()=>render(location.pathname));
document.querySelector('#collapse').onclick=()=>{document.body.classList.toggle('collapsed');const collapsed=document.body.classList.contains('collapsed');document.querySelector('#collapse').setAttribute('aria-expanded',String(!collapsed));document.querySelector('#collapse').setAttribute('aria-label',collapsed?'Expand sidebar':'Collapse sidebar');};
document.querySelector('#mobile-menu').onclick=()=>{document.body.classList.toggle('menu-open');document.querySelector('#mobile-menu').setAttribute('aria-expanded',String(document.body.classList.contains('menu-open')));};
document.querySelector('#wallet').onclick=()=>window.SplitexPay?.connect();
const search=document.querySelector('#search');
let searchTimer,searchController,searchSequence=0;
function closeSearch(){document.querySelector('#search-results').hidden=true;search.setAttribute('aria-expanded','false');searchSequence++;searchController?.abort();clearTimeout(searchTimer);}
search.addEventListener('input',()=>{
 clearTimeout(searchTimer);searchController?.abort();const sequence=++searchSequence,query=search.value.trim(),results=document.querySelector('#search-results');
 results.hidden=!query;search.setAttribute('aria-expanded',String(Boolean(query)));if(!query)return;
 results.innerHTML='<p role="status">Searching tokens…</p>';
 searchTimer=setTimeout(async()=>{
  searchController=new AbortController();const timeout=setTimeout(()=>searchController.abort(),10000);
  const pages=nav.filter(n=>n.name.toLowerCase().includes(query.toLowerCase()));
  try{
   const response=await fetch(`/api/tokens?limit=6&q=${encodeURIComponent(query)}`,{signal:searchController.signal});if(!response.ok)throw new Error();const {tokens,nextCursor}=await response.json();
   if(sequence!==searchSequence)return;
   results.innerHTML=(tokens.length?'<div class="search-section-label">Tokens</div>'+tokens.map(t=>`<a class="search-token-result" href="/token/${esc(t.mint)}"><span class="search-token-art">${tokenImageMarkup(t,'',false)}</span><span><strong>${esc(t.name)} <small>${esc(t.symbol)}</small></strong><small>${t.recipients.map(r=>'@'+esc(r.handle)).join(' · ')}</small></span></a>`).join(''):'<p>No matching tokens</p>')+(tokens.length?`<a class="search-all" href="/explore?q=${encodeURIComponent(query)}">${nextCursor?'See all results':'Explore these tokens'} →</a>`:'')+(pages.length?'<div class="search-section-label">Pages</div>'+pages.map(n=>`<a href="${n.path}">${icon(n.icon)}${n.name}</a>`).join(''):'');
   bindTokenImageFallbacks(results);
  }catch{if(sequence===searchSequence)results.innerHTML='<p>Search is unavailable. Try again shortly.</p>'+pages.map(n=>`<a href="${n.path}">${n.name}</a>`).join('');}
  finally{clearTimeout(timeout);}
 },220);
});
search.addEventListener('keydown',e=>{const results=document.querySelector('#search-results');if(e.key==='Escape'){closeSearch();search.blur();}if(e.key==='ArrowDown'&&!results.hidden){e.preventDefault();results.querySelector('a')?.focus();}if(e.key==='Enter'&&!results.hidden){e.preventDefault();results.querySelector('a')?.click();}});
document.querySelector('#search-results').addEventListener('keydown',e=>{const links=[...e.currentTarget.querySelectorAll('a')],index=links.indexOf(document.activeElement);if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();links[(index+(e.key==='ArrowDown'?1:-1)+links.length)%links.length]?.focus();}if(e.key==='Escape'){closeSearch();search.focus();}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();search.focus();}if(e.key==='Escape'){document.body.classList.remove('menu-open');document.querySelector('#mobile-menu').setAttribute('aria-expanded','false');document.querySelector('#search-results').hidden=true;}});
let toastTimer;function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3000);}
window.matchMedia('(max-width:760px)').addEventListener('change',()=>{const node=document.querySelector('#diagram');if(node)node.innerHTML=diagram();});
render(location.pathname,false);
