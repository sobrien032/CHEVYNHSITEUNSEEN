function debounce(fn, wait=500){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }
async function fetchWithTimeout(resource, options={}){ const { timeout = 8000, ...rest } = options; const controller = new AbortController(); const id = setTimeout(()=>controller.abort(), timeout); try{ return await fetch(resource, { ...rest, signal: controller.signal }); } finally { clearTimeout(id); } }

(function initYears(){ const y=document.getElementById('year'); if(!y) return; const thisYear=new Date().getFullYear(); const start=thisYear+1; for(let i=start;i>=1995;i--){ const o=document.createElement('option'); o.value=i; o.textContent=i; y.appendChild(o);} })();

const COMMON_MAKES=['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Genesis','Honda','Hyundai','INFINITI','Jeep','Kia','Lexus','Lincoln','Mazda','Mercedes-Benz','MINI','Mitsubishi','Nissan','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo','Porsche'];
(function initMakes(){ const m=document.getElementById('make'); COMMON_MAKES.forEach(x=>{ const o=document.createElement('option'); o.value=x; o.textContent=x; m.appendChild(o); }); })();

const makeSel=document.getElementById('make'); const yearSel=document.getElementById('year'); const modelSel=document.getElementById('model'); const modelStatus=document.getElementById('modelStatus');
function resetModels(disable=true){ modelSel.innerHTML='<option value="">Select Model</option>'; modelSel.disabled=disable; modelStatus.textContent=''; }

let modelsAborter=null;
async function loadModels(){ const make=makeSel.value; const year=yearSel.value; resetModels(true); if(!make||!year) return; modelStatus.textContent='Loading models…'; try{ if(modelsAborter){modelsAborter.abort();} modelsAborter=new AbortController(); const url=`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/makeyear/${encodeURIComponent(make)}/modelyear/${encodeURIComponent(year)}?format=json`; const res=await fetchWithTimeout(url,{timeout:9000,signal:modelsAborter.signal}); const data=await res.json(); const list=(data.Results||[]).map(r=>r.Model_Name).filter(Boolean).sort((a,b)=>a.localeCompare(b)); if(list.length){ modelSel.disabled=false; list.forEach(m=>{ const o=document.createElement('option'); o.value=m; o.textContent=m; modelSel.appendChild(o); }); modelStatus.textContent=`${list.length} models found.`; } else { modelStatus.textContent='No models found for that year/make.'; } } catch(e){ modelStatus.textContent='Could not load models (offline or blocked). Try again or type model in Trim field.'; } }
makeSel.addEventListener('change', loadModels); yearSel.addEventListener('change', loadModels);

const vinInput=document.getElementById('vin'); let lastDecodedVin=''; let vinAborter=null;
function canDecode(v){ return v.length>=11; }
async function decodeVin(vin){ if(!canDecode(vin)) return; if(vin===lastDecodedVin) return; if(vinAborter){vinAborter.abort();} vinAborter=new AbortController(); try{ const url=`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${encodeURIComponent(vin)}?format=json`; const r=await fetchWithTimeout(url,{timeout:9000,signal:vinAborter.signal}); const j=await r.json(); const row=(j.Results&&j.Results[0])||{}; if(row.ModelYear){ yearSel.value=row.ModelYear; } if(row.Make){ if(![...makeSel.options].some(o=>o.value.toLowerCase()===String(row.Make).toLowerCase())){ const opt=document.createElement('option'); opt.value=row.Make; opt.textContent=row.Make; makeSel.appendChild(opt);} makeSel.value=row.Make; } await loadModels(); if(row.Model){ modelSel.value=row.Model; } lastDecodedVin=vin; } catch(e){} }
const debouncedAutoDecode=debounce(()=>decodeVin(vinInput.value.trim()),600);
vinInput.addEventListener('input',(e)=>{ const v=e.target.value.toUpperCase().replace(/[IOQ\s]/g,''); e.target.value=v; if(canDecode(v)) debouncedAutoDecode(); });

const phone=document.getElementById('phone'); const phoneRaw=document.getElementById('phoneRaw');
phone.addEventListener('input',()=>{ const d=phone.value.replace(/\D/g,'').slice(0,10); let out=d; if(d.length>6){ out=`(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`; } else if(d.length>3){ out=`(${d.slice(0,3)}) ${d.slice(3)}`; } phone.value=out; phoneRaw.value=d; });

const form=document.getElementById('tradeForm'); const submitBtn=document.getElementById('submitBtn'); const agree=document.getElementById('agree'); function showToast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); } function updateSubmitState(){ submitBtn.disabled=!agree.checked; }
form.noValidate=true; updateSubmitState(); agree.addEventListener('change',updateSubmitState);

form.addEventListener('submit', async (e)=>{ e.preventDefault();
  if(!agree.checked){ showToast('Please confirm the final disclaimer.'); return; }
  const vinVal=vinInput.value.trim(); if(!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vinVal)){ showToast('Please enter a valid 17‑character VIN.'); vinInput.focus(); return; }
  const digits=(phoneRaw.value||'').replace(/\D/g,''); if(digits.length!==10){ showToast('Please enter a valid 10‑digit US phone.'); phone.focus(); return; }
  if((document.getElementById('company').value||'').trim()){ showToast('Submitted.'); return; }
  submitBtn.disabled=true; submitBtn.textContent='Submitting…'; form.setAttribute('aria-busy','true');
  const fd=new FormData(form); const payload={}; fd.forEach((v,k)=>payload[k]=v); payload.phoneRaw=(payload.phoneRaw||(payload.phone||'').replace(/\D/g,'')).slice(0,10);
  try{ const res=await fetchWithTimeout('/.netlify/functions/trade-appraisal',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),timeout:15000}); if(!res.ok) throw new Error('Network'); showToast('Submitted! A specialist will contact you shortly.'); setTimeout(()=>{ window.location.href='/success/'; },400); }
  catch(err){ showToast('Could not submit right now. Please try again.'); }
  finally{ submitBtn.disabled=false; submitBtn.textContent='Get My Trade Appraisal'; form.removeAttribute('aria-busy'); }
});