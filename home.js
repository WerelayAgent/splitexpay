function homeRecipientAvatar(y) {
  return `<svg class="home-recipient-avatar" viewBox="1332 ${y} 76 76" aria-hidden="true"><image href="/assets/split-banner.png" width="2172" height="724"/></svg>`;
}
function homePage() {
  return `<div class="home-page"><section class="home-hero"><h1>Split token fees<br>through <span class="home-x">𝕏</span> Money</h1><p>One token. Multiple X accounts. Choose who shares the creator fees. <br>Launch on <span class="home-pump">${launchPumpIcon} Pump</span></p><div class="home-hero-actions"><a class="button primary" href="/launch">Launch a token</a><a class="button" href="/docs">Read the docs</a></div></section>
  <section class="home-preview-grid" aria-label="Explore SplitexPay"><a class="home-feature home-feature-wide" href="/explore" aria-label="Explore tokens launched on SplitexPay"><div id="home-launch-cards" class="home-launch-cards"><div class="home-coming-soon"><span class="home-coming-icon">${icon('launch')}</span><h2>Latest launches</h2><p>Loading tokens…</p></div></div><div class="home-feature-label"><span>Explore</span><span>Open →</span></div></a>
  <a class="home-feature home-feature-wide" href="/payments" aria-label="View payments"><div class="home-coming-soon"><span class="home-coming-icon">${icon('payments')}</span><h2>Coming soon</h2><p>Creator-fee payouts will appear here.</p></div><div class="home-feature-label"><span>Payments</span><span>Open →</span></div></a>
  <a class="home-feature home-feature-small" href="/analytics" aria-label="View analytics"><div class="home-analytics-preview" id="home-analytics-preview"><span>Confirmed launches</span><strong>Live launch<br>activity.</strong><p class="home-analytics-count">Loading activity…</p></div><div class="home-feature-label"><span>Analytics</span><span>Open →</span></div></a>
  <a class="home-feature home-feature-small" href="/launch" aria-label="Launch a token"><div class="home-launch-preview"><span>FEES SPLITX BETWEEN</span>${[['elonmusk','50',288],['SpaceX','30',407],['Tesla','20',522]].map(([handle,share,y])=>`<div>${homeRecipientAvatar(y)}<strong>@${handle}</strong><span>${share}%</span></div>`).join('')}<p>Choose any X accounts.</p></div><div class="home-feature-label"><span>Launch</span><span>Open →</span></div></a>
  <a class="home-feature home-feature-small" href="/docs" aria-label="Read the docs"><div class="home-docs-preview"><span>HOW IT WORKS</span><div><i>01</i><p><strong>Launch on ponsfamily.com</strong><small>Create your token with ETH.</small></p></div><div><i>02</i><p><strong>Choose the recipients</strong><small>Multiple X accounts. Your split.</small></p></div><div><i>03</i><p><strong>Follow the fees</strong><small>See where the creator fees go.</small></p></div></div><div class="home-feature-label"><span>Docs</span><span>Open →</span></div></a></section>
  <div class="home-live-grid"><section class="home-token-section"><div class="home-section-heading"><h2>Latest launches</h2><span class="pump-pill">${launchPumpIcon} Pump</span><a href="/explore">View all →</a></div><div id="home-tokens" class="home-empty"><span class="home-empty-icon">${icon('launch')}</span><h3>Your community starts here</h3><p>Confirmed SplitexPay launches will appear here.</p><a href="/launch" class="button">Launch a token</a></div></section><section><div class="home-section-heading"><h2>Top X Profiles</h2></div><div id="home-profiles" class="home-empty"><span class="home-empty-icon">${icon('people')}</span><h3>Shared from the start</h3><p>Recipient profiles appear after the first confirmed launch.</p></div></section></div>
  <div class="home-live-grid home-payment-sections"><section><div class="home-section-heading"><h2>Recent payments</h2><a href="/payments">View all →</a></div><div class="home-empty compact"><p>No verified X Money payments yet.</p></div></section><section><div class="home-section-heading"><h2>Most Payments</h2></div><div class="home-empty compact"><p>Payment rankings will appear here.</p></div></section></div></div>`;
}
async function loadHomeAnalytics(){
 const card=document.querySelector('#home-analytics-preview');if(!card)return;
 try{
  const response=await fetch('/api/analytics');if(!response.ok)throw new Error('Unavailable');
  const data=await response.json();if(!card.isConnected)return;
  card.querySelector('strong').textContent=analyticsNumber.format(data.totals.launches);
  card.querySelector('p').textContent=`tokens launched · ${analyticsNumber.format(data.totals.launches24h)} in the last 24h`;
  const profiles=document.querySelector('#home-profiles');if(profiles&&data.profiles.length){profiles.className='home-profile-list';profiles.innerHTML=data.profiles.slice(0,5).map(({handle,launches})=>`<a href="https://x.com/${encodeURIComponent(handle)}" target="_blank" rel="noopener noreferrer"><i>𝕏</i><div><strong>@${esc(handle)}</strong><small>${launches} ${launches===1?'token':'tokens'} assigned</small></div><span>↗</span></a>`).join('');}
 }catch{if(card.isConnected)card.querySelector('p').textContent='View launch analytics →';}
}
function homeAnimatedToken(token){
 return `<div class="home-marquee-token" data-featured-mint="${esc(token.mint)}"><div class="home-live-art">${tokenImageMarkup(token,'',false)}<span class="home-token-badge">${launchPumpIcon} ${token.recipients.length} recipients</span></div><p>${esc(token.name)} <small>${esc(token.symbol)}</small></p><span>Launched on ponsfamily.com</span></div>`;
}
function paintLaunchCards(target,tokens){
 if(!tokens.length)return;
 const featured=tokens.slice(0,9);
 if(!target.querySelector('.home-token-marquee'))target.innerHTML=`<div class="home-token-marquee" aria-hidden="true">${Array.from({length:3},()=>'<div class="home-marquee-column"><div class="home-marquee-group"></div><div class="home-marquee-group"></div></div>').join('')}</div>`;
 target.querySelectorAll('.home-marquee-column').forEach((column,c)=>column.querySelectorAll('.home-marquee-group').forEach(group=>{
  for(let row=0;row<3;row++){
   const token=featured[(row*3+c)%featured.length],existing=group.children[row];
   if(existing?.dataset.featuredMint===token.mint)continue;
   const template=document.createElement('template');template.innerHTML=homeAnimatedToken(token);
   if(existing)existing.replaceWith(template.content.firstElementChild);else group.append(template.content.firstElementChild);
  }
 }));
 bindTokenImageFallbacks(target);
}
function bindHome(){
 const target=document.querySelector('#home-tokens'),profiles=document.querySelector('#home-profiles'),cards=document.querySelector('#home-launch-cards');
 const isExplore=currentRoute==='/explore',input=document.querySelector('#explore-search'),more=document.querySelector('#load-more-tokens'),status=document.querySelector('#token-list-status');
 let stopped=false,timer,controller,loading=false,query=input?.value.trim()||'',cursor=null,initialized=false,debounce;
 const known=new Map();
 function setStatus(message){if(status)status.textContent=message;}
 function syncCards(tokens,append){
  const hadTokens=known.size>0;
  for(const token of tokens)known.set(token.mint,token);
  const ordered=[...known.values()].sort((a,b)=>b.created-a.created||a.mint.localeCompare(b.mint));
  target.className=`home-real-tokens${isExplore?' explore-tokens':''}`;
  if(!target.querySelector('[data-mint]'))target.replaceChildren();
  const visible=isExplore?ordered:ordered.slice(0,8);
  const existing=new Map([...target.children].map(el=>[el.dataset.mint,el]));
  let previous=null;
  for(const token of visible){
   let el=existing.get(token.mint);
   if(!el){const template=document.createElement('template');template.innerHTML=tokenCard(token,initialized&&hadTokens&&!append);el=template.content.firstElementChild;}
   const expected=previous?previous.nextElementSibling:target.firstElementChild;
   if(el!==expected)target.insertBefore(el,expected);
   previous=el;existing.delete(token.mint);
  }
  existing.forEach(el=>el.remove());bindTokenCards(target);refreshTokenAges(target);
  if(cards)paintLaunchCards(cards,ordered);
  if(more){more.hidden=!cursor;more.disabled=false;more.textContent='Load more';}
  setStatus(`${known.size} ${known.size===1?'token':'tokens'}${query?' found':' loaded'}${cursor?' · more available':''}`);
 }
 async function update(append=false){
  if(stopped||loading)return;
  clearTimeout(timer);
  if(document.hidden&&!append){timer=setTimeout(()=>update(),30000);return;}
  loading=true;controller=new AbortController();const requestController=controller;const timeout=setTimeout(()=>requestController.abort('timeout'),15000);
  if(more)more.disabled=true;
  if(!append)loadHomeAnalytics();
  try{
   const params=new URLSearchParams({limit:isExplore?'24':'9'});if(query)params.set('q',query);if(append&&cursor)params.set('cursor',cursor);
   const response=await fetch(`/api/tokens?${params}`,{signal:controller.signal});if(!response.ok)throw new Error('Tokens unavailable');
   const data=await response.json();if(stopped||!target.isConnected)return;
   // Refresh the newest page while preserving the pagination boundary for loaded older pages.
   if(append||!initialized)cursor=data.nextCursor;
   if(!data.tokens.length&&!known.size){
    target.className='home-empty';target.innerHTML=query?'<h3>No tokens found</h3><p>Try a token name, ticker, contract address or X handle.</p>':'<h3>No confirmed launches yet</h3><p>New token launches will appear here.</p>';
    if(cards)cards.innerHTML='<div class="home-coming-soon"><h2>Be the first to launch</h2><p>Confirmed tokens will appear here.</p></div>';
    if(more)more.hidden=true;setStatus(query?'No matching tokens':'');
   }else syncCards(data.tokens,append);
   initialized=true;retryTokenImages(target);
  }catch(e){
   if(stopped||requestController.signal.reason==='search')return;
   setStatus('Could not refresh tokens. Try again shortly.');
   if(!known.size){target.className='home-empty';target.innerHTML='<h3>Tokens are temporarily unavailable</h3><p>Retrying shortly.</p>';}
   if(cards&&!known.size)cards.innerHTML='<div class="home-coming-soon"><h2>Latest launches</h2><p>Retrying shortly…</p></div>';
  }finally{clearTimeout(timeout);loading=false;if(more)more.disabled=false;if(!stopped)timer=setTimeout(()=>update(),30000);}
 }
 if(input)input.addEventListener('input',()=>{
  clearTimeout(debounce);controller?.abort('search');
  debounce=setTimeout(()=>{query=input.value.trim();known.clear();cursor=null;initialized=false;target.innerHTML=tokenSkeletons(8);target.className='home-real-tokens explore-tokens';if(more)more.hidden=true;setStatus('Searching…');update();},250);
 });
 if(more)more.onclick=()=>{more.textContent='Loading…';update(true);};
 const onVisible=()=>{if(!document.hidden){retryTokenImages();update();}};
 const onLaunched=()=>update();
 document.addEventListener('visibilitychange',onVisible);document.addEventListener('splitexpay:launched',onLaunched);
 update();
 return()=>{stopped=true;clearTimeout(timer);clearTimeout(debounce);controller?.abort('search');document.removeEventListener('visibilitychange',onVisible);document.removeEventListener('splitexpay:launched',onLaunched);};
}
function tokenSkeletons(count=8){return Array.from({length:count},()=>'<div class="token-skeleton" aria-hidden="true"><div></div><span></span><span></span></div>').join('');}
