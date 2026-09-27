const analyticsNumber=new Intl.NumberFormat('en-US');
function analyticsPage(){
 return `<section id="analytics-page"><div class="analytics-heading"><div><h1>Analytics</h1><p class="intro">Confirmed launches through SplitexPay.</p></div><div class="analytics-sync"><span id="analytics-updated" role="status">Loading activity…</span><button class="button" id="analytics-refresh">Refresh</button></div></div>
 <p id="analytics-error" class="analytics-error" role="alert" hidden></p>
 <div class="analytics-stats">${[['launches','Tokens launched','All time'],['launches24h','Launches in 24h','Rolling 24 hours'],['wallets','Launch wallets','Unique wallets · all time'],['accounts','X accounts assigned','Unique accounts · all time']].map(([key,label,note])=>`<article class="analytics-stat"><span>${label}</span><strong data-metric="${key}">—</strong><small>${note}</small></article>`).join('')}</div>
 <section class="analytics-panel analytics-chart-panel" aria-labelledby="launch-activity-heading"><div class="analytics-section-head"><div><h2 id="launch-activity-heading">Launch activity</h2><p><strong id="analytics-period-total">—</strong> <span id="analytics-period-label">launches in the last 7 days</span></p></div><div class="analytics-range" aria-label="Activity period"><button type="button" data-days="7" aria-pressed="true">7D</button><button type="button" data-days="30" aria-pressed="false">30D</button></div></div><div id="analytics-chart" class="analytics-chart" aria-label="Daily confirmed launches"><p class="analytics-placeholder">Loading launch activity…</p></div><div class="analytics-chart-caption"><span id="analytics-date-range"></span><span>Daily launches · UTC</span></div></section>
 <div class="analytics-detail-grid"><section class="analytics-panel analytics-recent"><div class="analytics-section-head"><h2>Latest launches</h2><a href="/explore">Explore →</a></div><div id="analytics-launches"><p class="analytics-placeholder">Loading confirmed launches…</p></div></section>
 <section class="analytics-panel"><div class="analytics-section-head"><h2>X accounts assigned</h2></div><p class="analytics-explainer">Ranked by tokens assigning a share.</p><div id="analytics-profiles"><p class="analytics-placeholder">Loading accounts…</p></div></section></div>
 <section class="analytics-fee-note"><span class="analytics-note-icon">${icon('payments')}</span><div><h2>Fee & payout tracking</h2><p>Coming soon. Collected fees, X Money payouts and $SPLITX burns aren’t tracked here yet. Assignments above show selected recipients, not completed payments.</p></div></section></section>`;
}
function paintAnalyticsChart(root,data,days){
 const series=data.daily.slice(-days),max=Math.max(1,...series.map(d=>d.launches));
 const date=day=>new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
 root.querySelector('#analytics-period-total').textContent=analyticsNumber.format(series.reduce((sum,d)=>sum+d.launches,0));
 root.querySelector('#analytics-period-label').textContent=`launches in the last ${days} days`;
 root.querySelector('#analytics-date-range').textContent=`${date(series[0].day)} – ${date(series.at(-1).day)}`;
 root.querySelector('#analytics-chart').innerHTML=`<div class="analytics-chart-bars ${days===30?'is-month':''}" role="list">${series.map(d=>`<div class="analytics-day" role="listitem" tabindex="0" aria-label="${date(d.day)} UTC: ${d.launches} ${d.launches===1?'launch':'launches'}"><div class="analytics-bar-track"><span class="analytics-bar" style="--height:${d.launches/max*100}%" ${d.launches===0?'data-zero':''}><span class="analytics-bar-value">${analyticsNumber.format(d.launches)}</span></span></div><span class="analytics-day-label">${date(d.day)}</span><span class="analytics-chart-tooltip" aria-hidden="true">${date(d.day)} · ${d.launches} ${d.launches===1?'launch':'launches'}</span></div>`).join('')}</div>`;
}
function paintAnalytics(root,data,days){
 root.querySelectorAll('[data-metric]').forEach(el=>el.textContent=analyticsNumber.format(data.totals[el.dataset.metric]));
 paintAnalyticsChart(root,data,days);
 root.querySelector('#analytics-launches').innerHTML=data.recent.length?`<div class="analytics-table-wrap"><table class="analytics-table"><thead><tr><th>Token</th><th>X accounts</th><th>Launched</th><th><span class="visually-hidden">Links</span></th></tr></thead><tbody>${data.recent.map(t=>`<tr><td><a class="analytics-token" href="https://ponsfamily.com/coin/${esc(t.mint)}" target="_blank" rel="noopener noreferrer"><span class="analytics-token-art"><img src="${esc(t.image)}" alt="" loading="lazy"><span hidden>${esc(t.symbol.slice(0,2))}</span></span><span><strong>${esc(t.name)}</strong><small>${esc(t.symbol)}</small></span></a></td><td>${t.recipients.length}</td><td><time datetime="${new Date(t.created).toISOString()}" title="${esc(new Date(t.created).toLocaleString())}">${new Date(t.created).toLocaleDateString('en-US',{month:'short',day:'numeric'})}<small>${new Date(t.created).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</small></time></td><td><a class="analytics-tx" href="https://solscan.io/tx/${esc(t.signature)}" target="_blank" rel="noopener noreferrer" aria-label="View ${esc(t.name)} launch transaction">↗</a></td></tr>`).join('')}</tbody></table></div><p class="analytics-table-note">${Math.min(20,data.totals.launches)} most recent confirmed launches · times in your timezone</p>`:'<p class="analytics-placeholder">No confirmed launches yet. <a href="/launch">Launch a token →</a></p>';
 root.querySelectorAll('.analytics-token-art img').forEach(img=>{const failed=()=>{img.hidden=true;img.nextElementSibling.hidden=false;};img.addEventListener('error',failed,{once:true});if(img.complete&&!img.naturalWidth)failed();});
 root.querySelector('#analytics-profiles').innerHTML=data.profiles.length?data.profiles.map((p,i)=>`<a class="analytics-profile" href="https://x.com/${encodeURIComponent(p.handle)}" target="_blank" rel="noopener noreferrer"><span class="analytics-rank">${i+1}</span><strong>@${esc(p.handle)}</strong><span>${analyticsNumber.format(p.launches)} <small>${p.launches===1?'token':'tokens'}</small></span></a>`).join(''):'<p class="analytics-placeholder">Accounts appear after the first confirmed launch.</p>';
}
function bindAnalytics(){
 const root=document.querySelector('#analytics-page'),refresh=root.querySelector('#analytics-refresh'),error=root.querySelector('#analytics-error'),status=root.querySelector('#analytics-updated');
 let stopped=false,timer,controller,data,days=7,loading=false;
 async function update(){
  if(stopped||loading)return;
  if(document.hidden){clearTimeout(timer);timer=setTimeout(update,30000);return;}
  clearTimeout(timer);loading=true;refresh.disabled=true;controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch('/api/analytics',{cache:'no-store',signal:controller.signal});
   if(!response.ok)throw new Error('Unavailable');
   const next=await response.json();if(stopped)return;data=next;
   paintAnalytics(root,data,days);error.hidden=true;
   status.textContent=`Updated ${new Date(data.updatedAt).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'})} · refreshes every 30s`;
  }catch{
   if(stopped)return;
   error.hidden=false;error.textContent=data?'Couldn’t refresh. Showing the last successful update; retrying shortly.':'Analytics is temporarily unavailable. Try Refresh; we’ll also retry automatically.';
   if(!data){status.textContent='Waiting for activity data';root.querySelectorAll('.analytics-placeholder').forEach(el=>el.textContent='Activity data could not be loaded.');}
  }finally{clearTimeout(timeout);loading=false;if(!stopped){refresh.disabled=false;timer=setTimeout(()=>{if(document.hidden){timer=setTimeout(update,30000);}else update();},30000);}}
 }
 refresh.addEventListener('click',update);
 root.querySelectorAll('[data-days]').forEach(button=>button.addEventListener('click',()=>{days=Number(button.dataset.days);root.querySelectorAll('[data-days]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));if(data)paintAnalyticsChart(root,data,days);}));
 const onVisible=()=>{if(!document.hidden)update();};document.addEventListener('visibilitychange',onVisible);
 update();
 return ()=>{stopped=true;clearTimeout(timer);controller?.abort();document.removeEventListener('visibilitychange',onVisible);};
}
