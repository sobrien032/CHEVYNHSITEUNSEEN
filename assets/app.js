function debounce(fn, wait=500){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }
async function fetchWithTimeout(resource, options={}){ const { timeout=10000, ...rest } = options; const controller = new AbortController(); const id=setTimeout(()=>controller.abort(), timeout); try { return await fetch(resource, { ...rest, signal: controller.signal }); } finally { clearTimeout(id); } }

(function initYears(){ const y=document.getElementById('year'); const thisYear=new Date().getFullYear(); for(let i=thisYear+1;i>=1990;i--){ const o=document.createElement('option'); o.value=i; o.textContent=i; y.appendChild(o);} })();

const COMMON_MAKES=['Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC','Honda','Hyundai','Infiniti','Jeep','Kia','Lexus','Lincoln','Mazda','Mercedes-Benz','MINI','Nissan','Ram','Subaru','Tesla','Toyota','Volkswagen','Volvo','Porsche'];
(function initMakes(){ const m=document.getElementById('make'); COMMON_MAKES.forEach(x=>{ const o=document.createElement('option'); o.value=x; o.textContent=x; m.appendChild(o); }); })();

const makeSel=document.getElementById('make'); const yearSel=document.getElementById('year'); const modelSel=document.getElementById('model'); const modelStatus=document.getElementById('modelStatus');
function resetModels(disable=true){ modelSel.innerHTML='<option value="">Select Model</option>'; modelSel.disabled=disable; modelStatus.textContent=''; }

let modelsAborter=null;
async function loadModels(){ const make=makeSel.value; const year=yearSel.value; resetModels(!make||!year); if(!make||!year) return; modelStatus.textContent='Loading models…'; try{ if(modelsAborter){modelsAborter.abort();} modelsAborter=new AbortController(); const res=await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${encodeURIComponent(year)}?format=json`,{signal:modelsAborter.signal}); const data=await res.json(); const list=(data.Results||[]).map(r=>r.Model_Name).filter(Boolean).sort((a,b)=>a.localeCompare(b)); list.forEach(m=>{ const o=document.createElement('option'); o.value=m; o.textContent=m; modelSel.appendChild(o); }); modelSel.disabled=false; modelStatus.textContent=`${list.length} models loaded`; } catch(e){ modelStatus.textContent='Could not load models (offline or blocked). Try again or type model in Trim field.'; } }
makeSel.addEventListener('change', loadModels); yearSel.addEventListener('change', loadModels);

const vinInput=document.getElementById('vin'); let lastDecodedVin=''; let vinAborter=null;
function canDecode(v){ return v.length>=11; }
// (pre-existing minimal decode was here in your file)

// ... (YOUR OTHER EXISTING LOGIC — formatting phone, toasts, submit handler, etc.) ...

const form=document.getElementById('tradeForm'); const submitBtn=document.getElementById('submitBtn'); const agree=document.getElementById('agree'); const phone=document.getElementById('phone'); const phoneRaw=document.getElementById('phoneRaw');
function updateSubmitState(){ submitBtn.disabled=!agree.checked; }
form.noValidate=true; updateSubmitState(); agree.addEventListener('change',updateSubmitState);

form.addEventListener('submit', async (e)=>{ e.preventDefault();
  if(!agree.checked){ showToast('Please confirm the final disclaimer.'); return; }
  const vinVal=vinInput.value.trim(); if(!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vinVal)){ showToast('Please enter a valid 17-character VIN.'); vinInput.focus(); return; }
  const digits=(phoneRaw.value||'').replace(/\D/g,''); if(digits.length<10){ showToast('Please enter a valid 10-digit US phone.'); phone.focus(); return; }
  const companyEl=document.getElementById('company'); if(companyEl && (companyEl.value||'').trim()){ showToast('Submitted.'); return; }
  submitBtn.disabled=true; submitBtn.textContent='Submitting…'; form.setAttribute('aria-busy','true');
  const fd=new FormData(form); const payload={}; fd.forEach((v,k)=>payload[k]=v); payload.phoneRaw=payload.phoneRaw||(payload.phone||'').replace(/\D/g,'').slice(0,10);
  try{ const res=await fetchWithTimeout('/.netlify/functions/trade-appraisal',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) }); if(!res.ok) throw new Error('Submit failed'); showToast('Thanks! We received your info.'); setTimeout(()=>{ window.location.href='/success/'; },400); }
  catch(err){ showToast('Could not submit right now. Please try again.'); }
  finally{ submitBtn.disabled=false; submitBtn.textContent='Get My Trade Appraisal'; form.removeAttribute('aria-busy'); }
});

// === Quirk Enhancements v2.4 ===
// Language toggle for headers only (English <-> Español)
(function(){
  const btn = document.getElementById('langToggle');
  if(!btn) return;
  const h1 = document.querySelector('h1[data-i18n="title"]');
  const h2s = {
    aboutYou: document.querySelector('h2[data-i18n="aboutYou"]'),
    vehDetails: document.querySelector('h2[data-i18n="vehDetails"]'),
    vehCondition: document.querySelector('h2[data-i18n="vehCondition"]'),
    wearables: document.querySelector('h2[data-i18n="wearables"]'),
    photos: document.querySelector('h2[data-i18n="photos"]'),
    finalDisclaimerTitle: document.querySelector('h2[data-i18n="finalDisclaimerTitle"]')
  };
  const es = {
    title: "Formulario de Tasación Sin Inspección",
    aboutYou: "Cuéntenos sobre usted",
    vehDetails: "Detalles del Vehículo",
    vehCondition: "Condición del Vehículo",
    wearables: "Revisión de Elementos Desgastables",
    photos: "Cargas de Fotos (Opcional)",
    finalDisclaimerTitle: "Descargo de Responsabilidad Final"
  };
  const en = {
    title: "Sight Unseen Trade-In Appraisal Form",
    aboutYou: "Tell us about Yourself",
    vehDetails: "Vehicle Details",
    vehCondition: "Vehicle Condition",
    wearables: "Wearable Items Check",
    photos: "Photo Uploads (Optional)",
    finalDisclaimerTitle: "Final Disclaimer"
  };
  let spanish = false;
  function apply(){
    const t = spanish ? es : en;
    if(h1) h1.textContent = t.title;
    if(h2s.aboutYou) h2s.aboutYou.textContent = t.aboutYou;
    if(h2s.vehDetails) h2s.vehDetails.textContent = t.vehDetails;
    if(h2s.vehCondition) h2s.vehCondition.textContent = t.vehCondition;
    if(h2s.wearables) h2s.wearables.textContent = t.wearables;
    if(h2s.photos) h2s.photos.textContent = t.photos;
    if(h2s.finalDisclaimerTitle) h2s.finalDisclaimerTitle.textContent = t.finalDisclaimerTitle;
    btn.textContent = spanish ? "English version" : "versión en español";
    document.documentElement.setAttribute('lang', spanish ? 'es' : 'en');
  }
  btn.addEventListener('click', ()=>{ spanish = !spanish; apply(); });
  apply();
})();

// VIN decode: fill Year, Make, and Model when a full VIN is present.
(function(){
  const vinInput = document.getElementById('vin');
  if(!vinInput) return;
  const yearSel = document.getElementById('year');
  const makeSel = document.getElementById('make');
  const modelSel = document.getElementById('model');
  const trimInput = document.getElementById('trim');
  let inFlight = null;

  function validVin(v){ return /^[A-HJ-NPR-Z0-9]{17}$/i.test(v||''); }

  async function decode(vin){
    if(!validVin(vin)) return;
    if(inFlight) inFlight.abort();
    const ctl = new AbortController(); inFlight = ctl;
    try{
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${encodeURIComponent(vin)}?format=json`;
      const res = await fetch(url, { signal: ctl.signal });
      const data = await res.json();
      const row = (data.Results && data.Results[0]) || {};
      const year = row.ModelYear || row.Model_Year || "";
      const make = row.Make || "";
      const model = row.Model || row.Model_Name || "";
      const trim = row.Trim || row.Series || "";

      // Set Year
      if(yearSel && year){
        yearSel.value = String(year);
        yearSel.dispatchEvent(new Event('change'));
      }

      // Set Make (ensure option exists)
      if(makeSel && make){
        const makeLower = String(make).toLowerCase();
        let opt = Array.from(makeSel.options).find(o => o.value.toLowerCase() === makeLower);
        if(!opt){
          opt = document.createElement('option');
          opt.value = make; opt.textContent = make;
          makeSel.appendChild(opt);
        }
        makeSel.value = opt.value;
        makeSel.dispatchEvent(new Event('change'));
      }

      // Load/select Model
      if(modelSel && makeSel && yearSel){
        // wait for any async model load
        await new Promise(r => setTimeout(r, 700));
        const modelLower = String(model).toLowerCase();
        let modelOpt = Array.from(modelSel.options).find(o => o.value.toLowerCase() === modelLower || o.textContent.toLowerCase() === modelLower);
        if(modelOpt){
          modelSel.value = modelOpt.value;
        } else if (model) {
          const opt = document.createElement('option');
          opt.value = model; opt.textContent = model;
          modelSel.appendChild(opt);
          modelSel.value = opt.value;
        }
      }

      // Put series/trim into Trim if helpful
      if(trimInput && !trimInput.value && (trim || model)){
        trimInput.value = trim || model;
      }
    } catch(e){
      // ignore (user can still fill manually)
    } finally{
      if(inFlight === ctl) inFlight = null;
    }
  }

  const btn = document.getElementById('decodeVinBtn');
  if(btn){
    btn.addEventListener('click', ()=> decode(vinInput.value.trim()));
  }
  vinInput.addEventListener('input', debounce(()=> decode(vinInput.value.trim()), 500));
  if(validVin(vinInput.value)) decode(vinInput.value.trim());
})();
