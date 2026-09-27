const tokenImageStates=new WeakMap();
function tokenImageMarkup(token,alt='',lazy=true){
 return `<img data-token-image data-original="${esc(token.image)}" src="${esc(token.thumbnail||token.image)}" alt="${esc(alt)}" width="256" height="256" decoding="async" ${lazy?'loading="lazy"':''}><span class="token-image-fallback" hidden><b>${esc(token.symbol)}</b><small>Image temporarily unavailable</small></span>`;
}
function bindTokenImageFallbacks(target){
 target.querySelectorAll('img[data-token-image]').forEach(img=>{
  if(tokenImageStates.has(img))return;
  const state={attempt:0,timer:null};tokenImageStates.set(img,state);
  const retry=()=>{
   clearTimeout(state.timer);if(!img.isConnected)return;
   const url=new URL(img.dataset.original||img.src,location.origin);url.searchParams.set('retry',String(Date.now()));
   img.src=url.href;
  };
  img.addEventListener('load',()=>{clearTimeout(state.timer);img.hidden=false;img.dataset.failed='false';if(img.nextElementSibling)img.nextElementSibling.hidden=true;});
  const unavailable=()=>{
   img.hidden=true;img.dataset.failed='true';if(img.nextElementSibling)img.nextElementSibling.hidden=false;
   if(state.attempt<3){const delay=[1500,5000,15000][state.attempt++];state.timer=setTimeout(retry,delay);}
  };
  state.retry=()=>{if(img.dataset.failed==='true'&&!document.hidden){state.attempt=0;retry();}};
  img.addEventListener('error',unavailable);
  if(img.complete&&!img.naturalWidth)unavailable();
 });
}
function retryTokenImages(target=document){target.querySelectorAll('img[data-failed="true"]').forEach(img=>tokenImageStates.get(img)?.retry());}
window.addEventListener('online',()=>retryTokenImages());
function tokenAge(created){
 const seconds=Math.max(0,Math.floor((Date.now()-created)/1000));
 return seconds<60?'just now':seconds<3600?`${Math.floor(seconds/60)}m ago`:seconds<86400?`${Math.floor(seconds/3600)}h ago`:`${Math.floor(seconds/86400)}d ago`;
}
function tokenCard(token,animate=false){
 const fresh=Date.now()-token.created<300000;
 return `<article class="home-live-token${animate?' token-arriving':''}" data-mint="${esc(token.mint)}"><a class="token-art-link" href="/token/${esc(token.mint)}" aria-label="View ${esc(token.name)} token page"><div class="home-live-art">${tokenImageMarkup(token,`${token.name} token image`)}${fresh?'<span class="token-new">Just launched</span>':''}</div></a><div class="token-title"><a href="/token/${esc(token.mint)}">${esc(token.name)}</a><span>${esc(token.symbol)}</span></div><div class="token-card-meta"><span>Pump</span><time datetime="${new Date(token.created).toISOString()}" data-created="${token.created}" title="${new Date(token.created).toLocaleString()}">${tokenAge(token.created)}</time></div><details class="token-split"><summary>${token.recipients.length} recipients <span>⌄</span></summary><div class="token-recipient-list"><p>Share of the 80% recipient allocation</p>${token.recipients.map(r=>`<a href="https://x.com/${encodeURIComponent(r.handle)}" target="_blank" rel="noopener noreferrer"><span>@${esc(r.handle)}</span><b>${r.share}%</b></a>`).join('')}</div></details><button class="token-copy" data-copy-mint="${esc(token.mint)}" aria-label="Copy contract address for ${esc(token.name)}"><span>${esc(token.mint.slice(0,5))}…${esc(token.mint.slice(-5))}</span><span>Copy CA</span></button></article>`;
}
function bindTokenCards(target){
 bindTokenImageFallbacks(target);
 target.querySelectorAll('.home-live-token:not([data-card-bound])').forEach(card=>{card.dataset.cardBound="true";card.addEventListener("click",e=>{if(e.target.closest("a,button,details,input")||window.getSelection()?.toString())return;card.querySelector(".token-art-link").click();});});
 target.querySelectorAll('[data-copy-mint]:not([data-bound])').forEach(button=>{
  button.dataset.bound='true';button.onclick=async()=>{
   try{await navigator.clipboard.writeText(button.dataset.copyMint);button.lastElementChild.textContent='Copied ✓';setTimeout(()=>{if(button.isConnected)button.lastElementChild.textContent='Copy CA';},1800);}
   catch{toast('Clipboard unavailable. The contract address is shown below.');const text=document.createElement('input');text.value=button.dataset.copyMint;text.readOnly=true;text.className='token-contract-select';button.after(text);text.select();}
  };
 });
 target.querySelectorAll('.token-split:not([data-bound])').forEach(details=>{
  details.dataset.bound='true';let pinned=false;
  details.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')details.open=true;});
  details.addEventListener('pointerleave',()=>{if(!pinned&&!details.contains(document.activeElement))details.open=false;});
  details.querySelector('summary').onclick=e=>{e.preventDefault();pinned=!pinned;details.open=pinned;};
  details.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=false;details.open=false;details.querySelector('summary').focus();}});
 });
}
function refreshTokenAges(target){
 target.querySelectorAll('time[data-created]').forEach(time=>time.textContent=tokenAge(Number(time.dataset.created)));
 target.querySelectorAll('.token-new').forEach(badge=>{const time=badge.closest('[data-mint]')?.querySelector('time');if(time&&Date.now()-Number(time.dataset.created)>=300000)badge.remove();});
}
