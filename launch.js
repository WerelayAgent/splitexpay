let launchRows = [];
let launchDraft = null;
let launchState = null;
let imageLoadVersion = 0;
const launchImageIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m4 18 6-6 4 4 3-3 4 4"/></svg>';
const launchPumpIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#080808"/><text x="12" y="16" fill="#83d9ad" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">P</text></svg>';

function recipientInputs() {
  return launchRows.map((row, index) => `<div class="recipient-edit-row"><div class="launch-handle">${icon('search')}<input class="recipient-input" aria-label="X handle for recipient ${index + 1}" placeholder="X account handle" value="${esc(row.handle)}" data-row="${index}" data-field="handle" maxlength="16" autocomplete="off" spellcheck="false" required></div><div class="share-input"><input class="recipient-input" aria-label="Percentage for recipient ${index + 1}" type="number" min="0.01" max="100" step="0.01" value="${row.share}" data-row="${index}" data-field="share" required><span>%</span></div><button class="icon-button" type="button" aria-label="Remove recipient ${index + 1}" data-remove="${index}" ${launchRows.length === 2 ? 'disabled' : ''}>×</button></div>`).join('');
}

function launchPage() {
  imageLoadVersion++;
  // A new visit is a fresh form. Examples never become submitted input values.
  launchRows = [{handle: '', share: 50}, {handle: '', share: 50}];
  launchDraft = null;
  launchState = {name: '', symbol: '', description: '', initialBuy: '', website: window.SplitexPay.website, telegram: '', x: '', paymentNote: 'Creator fees via SplitexPay', image: null};
  return `<div class="launch-page"><section class="launch-intro"><h1>Launch and split fees through X Money</h1><p>Launch a token on ponsfamily.com and share its creator fees across multiple X accounts. Choose the recipients and set their shares.</p></section>
    <div class="launch-workspace"><form id="launch-form" class="launch-form">
      <div class="launch-form-head"><h2>Launch token</h2><span class="pump-pill">${launchPumpIcon} ponsfamily.com</span></div>
      <fieldset><legend>Launch currency</legend><div class="currency-selected"><img src="/assets/solana-logo.svg" alt="">Launch with ETH</div><p class="launch-help">Your token trades in ETH on ponsfamily.com. ETH is also used for network fees.</p></fieldset>
      <section class="launch-recipient-section" aria-labelledby="recipient-title"><div class="launch-recipient-head"><span id="recipient-title" class="launch-field-label">X Money sent to</span><span>Share of recipient allocation</span></div><div id="launch-recipients" class="recipient-editor">${recipientInputs()}</div><div class="launch-recipient-actions"><button class="button" id="launch-add" type="button">${icon('plus')} Add recipient</button><div id="launch-total" class="split-total valid"><span>Total allocation</span><strong>100% / 100%</strong></div></div><p class="launch-help">Recipients share 80% of creator fees. Their percentages must add up to 100%.</p><p class="error" id="launch-error" role="alert"></p></section>
      <hr class="launch-divider">
      <div class="launch-name-row"><div class="field"><label for="token-name">Name</label><input id="token-name" name="name" placeholder="Split Cat" maxlength="32" autocomplete="off" required></div><div class="field"><label for="token-symbol">Ticker</label><input id="token-symbol" name="symbol" placeholder="SCAT" maxlength="10" pattern="[A-Za-z0-9]{1,10}" autocomplete="off" required></div></div>
      <div class="field"><span class="launch-field-label" id="token-image-label">Token image</span><input id="token-image" hidden type="file" accept="image/png,image/jpeg,image/webp,image/gif" aria-labelledby="token-image-label" tabindex="-1"><div id="image-dropzone" class="image-upload-zone"><button id="choose-image" class="image-upload-button" type="button" aria-label="Choose token image"><span class="upload-icon" id="upload-thumbnail">${launchImageIcon}</span><span class="upload-copy"><span id="upload-name">Choose image</span><small id="upload-hint">PNG, JPG, WEBP or GIF · up to 5 MB</small></span></button><button id="remove-image" class="upload-remove" type="button" aria-label="Remove token image" hidden>×</button></div><p id="image-error" class="error" role="alert"></p></div>
      <div class="field"><label for="token-description">Description</label><textarea id="token-description" name="description" placeholder="What the token is." maxlength="256"></textarea><small id="description-count">0/256 characters</small></div>
      <details class="launch-options"><summary>SOCIAL LINKS (OPTIONAL)</summary><div class="field"><label for="token-website">Website</label><input id="token-website" name="website" type="url" value="${window.SplitexPay.website}" readonly aria-describedby="website-help"><small id="website-help">Included on every token launched with SplitexPay.</small></div><div class="field"><label for="token-telegram">Telegram</label><input id="token-telegram" name="telegram" type="url" placeholder="https://t.me/yourcommunity"></div><div class="field"><label for="token-x">X</label><input id="token-x" name="x" type="url" placeholder="https://x.com/youraccount"></div></details>
      <hr class="launch-divider">
      <div class="field"><label for="initial-buy">Initial buy <span class="muted">(optional)</span></label><div class="initial-buy"><input id="initial-buy" name="initialBuy" type="number" min="0" max="1000" step="0.000000001" placeholder="0.00" inputmode="decimal"><img src="/assets/solana-logo.svg" alt="ETH"></div><small>Buy some of your token when it launches. Leave extra ETH for token creation and network fees.</small></div>
      <details class="launch-options"><summary>MORE OPTIONS</summary><div class="field"><label for="payment-note">Payment note</label><input id="payment-note" name="paymentNote" value="Creator fees via SplitexPay" maxlength="250"><small>The message recipients see with a payout.</small></div></details>
      <div class="launch-service-status" id="launch-service-status" role="status"></div><div id="launch-pending"></div><hr class="launch-divider"><button type="submit" class="button primary launch-submit">Review launch ${icon('arrow')}</button><p class="launch-submit-note">Your wallet approves the launch on Robinhood Chain. Creator fees accrue to the SplitexPay fee wallet.</p>
    </form>
    <aside class="launch-preview-column" aria-label="Live token preview"><div class="launch-preview-sticky"><div class="launch-preview-heading"><span>Preview</span><span>Updates as you type</span></div><div class="payment-preview"><span class="payment-preview-logo"><img src="/assets/split-pfp.png" alt=""></span><div class="payment-preview-amount">$250</div><div class="payment-preview-recipient">sent to <strong id="preview-payment-recipient">Recipient</strong></div><div class="payment-preview-note"><span id="preview-payment-note">“Creator fees via SplitexPay”</span><span>now</span></div></div>
    <article class="token-preview-card"><div id="preview-image" class="token-preview-image" aria-label="Token image preview"><span>−</span></div><div class="token-preview-body"><div class="token-preview-title"><strong id="preview-token-name">Token name</strong><span id="preview-token-symbol">TICKER</span></div><p id="preview-description" class="token-preview-description"></p><div class="preview-market"><span><b>$0</b>MC</span><span><b>$0</b>Sent</span></div><dl class="preview-details"><div><dt>X Money sent to</dt><dd id="preview-recipients">—</dd></div><div><dt>Recipient share</dt><dd>80%</dd></div><div><dt>$SPLITX buybacks and burn</dt><dd>20%</dd></div></dl></div></article></div></aside></div></div>`;
}

function refreshRecipients() {
  document.querySelector('#launch-recipients').innerHTML = recipientInputs();
  document.querySelector('#launch-add').disabled = launchRows.length >= 6;
  updateLaunchPreview();
}

function updateLaunchPreview() {
  if (!document.querySelector('#preview-token-name')) return;
  const form = document.querySelector('#launch-form');
  ['name', 'symbol', 'description', 'initialBuy', 'telegram', 'x', 'paymentNote'].forEach(key => launchState[key] = form.elements.namedItem(key).value);
  launchState.website = window.SplitexPay.website;
  document.querySelector('#preview-token-name').textContent = launchState.name.trim() || 'Token name';
  document.querySelector('#preview-token-symbol').textContent = launchState.symbol.trim().toUpperCase() || 'TICKER';
  document.querySelector('#preview-description').textContent = launchState.description;
  document.querySelector('#description-count').textContent = `${launchState.description.length}/256 characters`;
  document.querySelector('#preview-payment-note').textContent = `“${launchState.paymentNote.trim() || 'Creator fees via SplitexPay'}”`;
  const entered = launchRows.filter(row => row.handle);
  document.querySelector('#preview-payment-recipient').textContent = entered.length ? `@${entered[0].handle}${entered.length > 1 ? ` + ${entered.length - 1}` : ''}` : 'Recipient';
  document.querySelector('#preview-recipients').innerHTML = entered.length ? `<span class="preview-recipient-list">${entered.map(row => `<span>@${esc(row.handle)}<em>${Number.isFinite(row.share) ? row.share : 0}%</em></span>`).join('')}</span>` : '—';
  const total = launchRows.reduce((sum, row) => sum + (Number.isFinite(row.share) ? row.share : 0), 0);
  const totalNode = document.querySelector('#launch-total');
  totalNode.className = `split-total ${Math.abs(total - 100) < .0001 ? 'valid' : 'invalid'}`;
  totalNode.innerHTML = `<span>Total allocation</span><strong>${Number(total.toFixed(2))}% / 100%</strong>`;
}

function displayLaunchImage() {
  const image = launchState.image;
  document.querySelector('.launch-submit').disabled = false;
  document.querySelector('#preview-image').innerHTML = image ? `<img src="${image.dataUrl}" alt="Selected token image">` : '<span>−</span>';
  document.querySelector('#upload-thumbnail').innerHTML = image ? `<img src="${image.dataUrl}" alt="">` : launchImageIcon;
  document.querySelector('#upload-name').textContent = image ? image.name : 'Choose image';
  document.querySelector('#upload-hint').textContent = image ? 'Click to change image' : 'PNG, JPG, WEBP or GIF · up to 5 MB';
  document.querySelector('#remove-image').hidden = !image;
}

async function selectLaunchImage(file) {
  if (!file) return;
  const version = ++imageLoadVersion;
  const error = document.querySelector('#image-error');
  error.textContent = '';
  displayLaunchImage();
  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) { error.textContent = 'Choose a PNG, JPG, WEBP or GIF image.'; return; }
  if (file.size > 5 * 1024 * 1024) { error.textContent = 'Choose an image smaller than 5 MB.'; return; }
  document.querySelector('#upload-hint').textContent = 'Loading image…';
  document.querySelector('.launch-submit').disabled = true;
  try {
    const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
    const decoded = new Image(); decoded.src = dataUrl; await decoded.decode();
    if (!decoded.naturalWidth || !decoded.naturalHeight) throw new Error('Invalid image');
    if (version !== imageLoadVersion || !document.querySelector('#launch-form')) return;
    let thumbnail=null;
    try{const canvas=document.createElement('canvas'),scale=Math.min(1,320/Math.max(decoded.naturalWidth,decoded.naturalHeight));canvas.width=Math.max(1,Math.round(decoded.naturalWidth*scale));canvas.height=Math.max(1,Math.round(decoded.naturalHeight*scale));canvas.getContext('2d').drawImage(decoded,0,0,canvas.width,canvas.height);const thumbUrl=canvas.toDataURL('image/webp',.8);const blob=await(await fetch(thumbUrl)).blob();if(blob.size<file.size&&blob.size<=150000)thumbnail={dataUrl:thumbUrl,type:blob.type,size:blob.size};}catch{/* The original image remains available if thumbnail creation is unsupported. */}
    if(version!==imageLoadVersion||!document.querySelector('#launch-form'))return;
    launchState.image = {name: file.name, type: file.type, size: file.size, dataUrl,thumbnail};
    displayLaunchImage();
  } catch {
    if (version !== imageLoadVersion || !document.querySelector('#launch-form')) return;
    error.textContent = 'This image could not be opened. Choose another file.';
    displayLaunchImage();
  }
}

function validateRows(rows) {
  if (rows.some(row => !/^\w{1,15}$/.test(row.handle))) return 'Enter a valid X handle for each recipient (1–15 letters, numbers, or underscores).';
  if (new Set(rows.map(row => row.handle.toLowerCase())).size !== rows.length) return 'Each X account can only appear once.';
  if (rows.some(row => !Number.isFinite(row.share) || row.share <= 0 || row.share > 100)) return 'Each percentage must be greater than 0 and no more than 100.';
  if (Math.abs(rows.reduce((sum, row) => sum + row.share, 0) - 100) > .0001) return 'The recipient percentages must add up to 100%.';
  return '';
}

function bindLaunch() {
  const form = document.querySelector('#launch-form');
  form.addEventListener('input', event => {
    const {field, row} = event.target.dataset;
    if (field) launchRows[Number(row)][field] = field === 'share' ? Number(event.target.value) : event.target.value.replace(/^@/, '').trim();
    document.querySelector('#launch-error').textContent = '';
    if (event.target.id === 'token-name') event.target.setCustomValidity('');
    updateLaunchPreview();
  });
  document.querySelector('#launch-recipients').addEventListener('click', event => {
    const remove = event.target.closest('[data-remove]');
    if (remove && launchRows.length > 2) { launchRows.splice(Number(remove.dataset.remove), 1); refreshRecipients(); }
  });
  document.querySelector('#launch-add').onclick = () => {
    if (launchRows.length >= 6) return;
    launchRows.push({handle: '', share: 0}); refreshRecipients();
    document.querySelector(`[data-row="${launchRows.length - 1}"][data-field="handle"]`).focus();
  };
  const imageInput = document.querySelector('#token-image');
  document.querySelector('#choose-image').onclick = () => imageInput.click();
  imageInput.onchange = () => { selectLaunchImage(imageInput.files[0]); imageInput.value = ''; };
  document.querySelector('#remove-image').onclick = () => { imageLoadVersion++; launchState.image = null; imageInput.value = ''; document.querySelector('#image-error').textContent = ''; displayLaunchImage(); };
  const zone = document.querySelector('#image-dropzone');
  zone.ondragover = event => { event.preventDefault(); zone.classList.add('is-dragging'); };
  zone.ondragleave = () => zone.classList.remove('is-dragging');
  zone.ondrop = event => { event.preventDefault(); zone.classList.remove('is-dragging'); selectLaunchImage(event.dataTransfer.files[0]); };
  form.onsubmit = event => {
    event.preventDefault(); updateLaunchPreview();
    if (document.querySelector('.launch-submit').disabled) return;
    const error = validateRows(launchRows);
    document.querySelector('#launch-error').textContent = error;
    if (error) return;
    if (!launchState.name.trim()) { const name = document.querySelector('#token-name'); name.setCustomValidity('Enter a token name.'); name.reportValidity(); return; }
    launchDraft = {...launchState, name: launchState.name.trim(), symbol: launchState.symbol.trim().toUpperCase(), description: launchState.description.trim(), recipients: launchRows.map(row => ({...row}))};
    openReview();
  };
  updateLaunchPreview();
  updateLaunchAvailability();
}

function updateLaunchAvailability() {
  const target=document.querySelector('#launch-service-status');
  if(target){const config=window.SplitexPay?.config;target.textContent=!config?'Checking launch availability…':config.ready?'Robinhood Chain mainnet · Wallet approval required':'Token launching is being set up. You can connect a wallet and review your details.';target.classList.toggle('available',Boolean(config?.ready));}
  const pending=document.querySelector('#launch-pending');
  if(pending&&!window.SplitexPay?.pending)pending.replaceChildren();
  if(pending&&window.SplitexPay?.pending){pending.innerHTML='<button class="button" type="button" id="recover-launch">Check your submitted launch</button>';pending.querySelector('button').onclick=()=>showLaunchResult({...window.SplitexPay.pending,pending:true});}
}
document.addEventListener('splitexpay:config',updateLaunchAvailability);
document.addEventListener('splitexpay:wallet',()=>{updateLaunchAvailability();const button=document.querySelector('#prepare-token');if(button)button.textContent=window.SplitexPay?.address?'Prepare launch':'Connect wallet';});
document.addEventListener('splitexpay:progress',event=>{const status=document.querySelector('#launch-progress');if(status)status.textContent=event.detail;});
document.addEventListener('splitexpay:stage',event=>setLaunchStage(event.detail));
const launchStageNames=['Upload','Review','Approve','Confirmed'];
function launchSteps(stage='upload'){
 const index={upload:0,review:1,approve:2,confirm:2,complete:3}[stage]??0;
 return `<ol class="launch-steps" aria-label="Launch progress">${launchStageNames.map((name,i)=>`<li class="${i<index||stage==='complete'?'is-done':i===index?'is-current':''}" ${i===index?'aria-current="step"':''}><span>${i<index||stage==='complete'?'✓':i+1}</span><b>${name}</b></li>`).join('')}</ol><p class="launch-step-help" id="launch-step-help">${stage==='confirm'?'Submitted to Robinhood Chain. Wait for confirmation before trying again.':stage==='complete'?'Confirmed on Robinhood Chain. Your token is live.':stage==='review'?'Check the estimated cost before approving.':stage==='approve'?'Open your wallet to approve the transaction.':'Save your token image and metadata first.'}</p>`;
}
function setLaunchStage(stage){const el=document.querySelector('#launch-stepper');if(el)el.innerHTML=launchSteps(stage);}
function launchError(error,stage){
 const el=document.querySelector('#launch-review-error');if(!el)return;
 const cancelled=error?.code===4001;
 el.textContent=(cancelled?'Wallet request cancelled.':error.message||'The launch could not continue.')+' '+(stage==='upload'?'Your form is still here. Retry preparation or edit the details.':window.SplitexPay?.pending?'Your transaction may already be submitted. Check its confirmation before preparing another launch.':'Review the error before retrying. Your token details are preserved.');
 const step=document.querySelector('.launch-steps .is-current');step?.classList.add('has-error');
}
const solText=lamports=>(Number(lamports)/1e9).toLocaleString('en-US',{maximumFractionDigits:9});
function launchReviewBase(){
 return `<div id="launch-stepper">${launchSteps()}</div><div class="dialog-head"><h2 id="review-title">Review your launch</h2><button class="icon-button" data-close aria-label="Close dialog">×</button></div><div class="review-token-heading">${launchDraft.image?`<img class="review-image" src="${launchDraft.image.dataUrl}" alt="Token image">`:''}<div><h3>${esc(launchDraft.name)}</h3><p>$${esc(launchDraft.symbol)} · ponsfamily.com</p></div></div><div class="review-fee-wallet"><span>Creator-fee recipient</span><code>${window.SplitexPay.treasury}</code><small>100% of ponsfamily.com creator fees accrue to this wallet’s claimable vault. Token sale proceeds and network fees are separate.</small></div>${launchDraft.recipients.map(row=>`<div class="review-row"><span>@${esc(row.handle)}</span><strong>${row.share}% of recipient allocation</strong></div>`).join('')}<div class="review-row"><span>Recipient / buyback allocation</span><strong>80% / 20%</strong></div><div class="review-row"><span>Initial buy, maximum</span><strong>${esc(launchDraft.initialBuy||'0')} ETH</strong></div><p class="review-payout-note">The X-account allocation is recorded in the token metadata. Automated X Money payouts, buybacks, and burns are not enabled yet.</p>`;
}
function openReview(){
  const dialog=document.querySelector('#review-dialog');dialog.className='launch-review-dialog';
  if(!launchDraft.image){document.querySelector('#image-error').textContent='Choose a token image before launching.';document.querySelector('#choose-image').focus();return;}
  const ready=window.SplitexPay?.config?.ready;
  dialog.innerHTML=launchReviewBase()+`${!ready?'<div class="notice">Launching is not available until SplitexPay’s storage and Robinhood Chain connection are configured. <a href="/docs#launch-setup">Setup guide →</a></div>':''}<div id="launch-progress" class="launch-progress" role="status"></div><p id="launch-review-error" class="error" role="alert"></p><div class="dialog-actions"><button class="button" data-close>Edit details</button><button class="button primary" id="prepare-token" ${ready?'':'disabled'}>${window.SplitexPay?.address?'Prepare launch':'Connect wallet'}</button></div><small class="review-next-step">Preparing saves your image and metadata to public IPFS. You review the transaction cost before launching.</small>`;
  dialog.querySelector('#prepare-token').onclick=async()=>{
    if(!window.SplitexPay.address){window.SplitexPay.connect();return;}
    const button=dialog.querySelector('#prepare-token');button.disabled=true;dialog.querySelectorAll('[data-close]').forEach(b=>b.disabled=true);dialog.querySelector('#launch-review-error').textContent='';
    try{const estimate=await window.SplitexPay.prepare(launchDraft);showFinalLaunchReview(estimate);}
    catch(e){launchError(e,'upload');button.disabled=false;dialog.querySelectorAll('[data-close]').forEach(b=>b.disabled=false);}
  };
  if(!dialog.open)dialog.showModal();
}
function showFinalLaunchReview(estimate){
 const dialog=document.querySelector('#review-dialog');
 dialog.innerHTML=launchReviewBase()+`<div class="review-row"><span>Network + priority fee</span><strong>${solText(estimate.networkFee)} ETH</strong></div>${estimate.estimatedDebit!==null?`<div class="review-row"><span>Estimated total, including rent</span><strong>${solText(estimate.estimatedDebit)} ETH</strong></div>`:''}<small class="review-next-step">Includes a ${solText(estimate.priorityFee)} ETH priority fee. The initial buy includes up to 1% slippage within your entered amount. Your wallet shows the final transaction.</small><div id="launch-progress" class="launch-progress" role="status">Simulation passed. Ready for wallet approval.</div><p id="launch-review-error" class="error" role="alert"></p><div class="dialog-actions"><button class="button" data-close>Cancel</button><button class="button primary" id="launch-on-pump">Launch on ponsfamily.com</button></div>`;
 setLaunchStage('review');
 dialog.querySelector('#launch-on-pump').onclick=async()=>{const button=dialog.querySelector('#launch-on-pump');button.disabled=true;dialog.querySelectorAll('[data-close]').forEach(b=>b.disabled=true);try{showLaunchResult(await window.SplitexPay.send());}catch(e){launchError(e,'approve');button.disabled=false;dialog.querySelectorAll('[data-close]').forEach(b=>b.disabled=false);}};
}
function showLaunchResult(result){
 const dialog=document.querySelector('#review-dialog');dialog.className='launch-review-dialog';
 dialog.innerHTML=`<div id="launch-stepper">${launchSteps(result.pending?'confirm':'complete')}</div><div class="dialog-head"><h2 id="review-title">${result.pending?'Confirming your launch':'Token launched'}</h2><button class="icon-button" data-close aria-label="Close dialog">×</button></div><p>${result.pending?'The transaction has been submitted. Check its status before creating another token.':'Your token is live on ponsfamily.com. Its creator fees are assigned to the SplitexPay fee wallet.'}</p><code class="wallet-address">${esc(result.mint)}</code><div class="launch-result-links"><a href="https://solscan.io/tx/${esc(result.signature)}" target="_blank" rel="noopener noreferrer">View transaction ↗</a>${!result.pending?`<a href="https://ponsfamily.com/coin/${esc(result.mint)}" target="_blank" rel="noopener noreferrer">Open on ponsfamily.com ↗</a>`:''}</div><div id="launch-progress" class="launch-progress" role="status"></div><p id="launch-review-error" class="error" role="alert"></p><div class="dialog-actions">${result.pending?'<button class="button primary" id="check-launch">Check confirmation</button>':'<button class="button primary" data-close>Done</button>'}</div>`;
 if(result.pending)dialog.querySelector('#check-launch').onclick=async()=>{const button=dialog.querySelector('#check-launch');button.disabled=true;try{showLaunchResult(await window.SplitexPay.checkPending());}catch(e){launchError(e,'confirm');button.disabled=false;if(e.failed){button.textContent='Return to form';button.onclick=()=>{dialog.close();updateLaunchAvailability();};}}};
 if(!dialog.open)dialog.showModal();updateLaunchAvailability();
}
document.querySelector('#review-dialog').addEventListener('cancel',event=>{if(window.SplitexPay?.busy)event.preventDefault();});
