// Utility function to delay function execution
function debounce(fn, wait = 500) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
}

// Utility function for fetch requests with a timeout
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(resource, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// --- Language Translation ---
const translations = {
  en: {
    title: "Sight Unseen Trade-In Appraisal Form",
    welcome: "Welcome to the Quirk Auto Dealers Sight Unseen Appraisal Program",
    instructions: "Please fill out this form with accurate and complete details about your vehicle. The trade-in value we provide will be honored as long as the vehicle condition matches your answers. We'll verify everything when you bring the vehicle in. If the condition differs, the offer will be adjusted accordingly.",
    decodeVinBtn: "Decode VIN & Prefill",
    clearBtn: "Clear Form",
    langToggle: "versión en español",
    aboutYou: "Tell us about Yourself",
    nameLabel: "Full Name",
    phoneLabel: "Phone Number",
    phoneHint: "US format only. Numbers only; we'll format it.",
    emailLabel: "Email Address",
    vehDetails: "Vehicle Details",
    vinLabel: "VIN (required)",
    vinHint: "VIN auto-capitalizes; letters I, O, Q are invalid.",
    mileageLabel: "Current Mileage",
    yearLabel: "Year",
    selectYear: "Select Year",
    makeLabel: "Make",
    selectMake: "Select Make",
    modelLabel: "Model",
    selectModel: "Select Model",
    trimLabel: "Trim Level (if known)",
    extColorLabel: "Exterior Color",
    intColorLabel: "Interior Color",
    keysLabel: "Number of Keys Included",
    titleStatus: "Title Status",
    titleClean: "Clean",
    titleLien: "Lien",
    titleRebuilt: "Rebuilt",
    titleSalvage: "Salvage",
    ownersLabel: "Number of Owners (estimate OK)",
    accidentLabel: "Has the vehicle ever been in an accident?",
    accidentRepair: "If yes, was it professionally repaired?",
    vehCondition: "Vehicle Condition",
    warnings: "Any warning lights on dashboard?",
    mech: "Mechanical issues",
    cosmetic: "Cosmetic issues",
    interior: "Interior clean and damage-free?",
    mods: "Aftermarket parts or modifications?",
    smells: "Unusual smells?",
    service: "Routine services up to date?",
    wearables: "Wearable Items Check",
    tires: "Tire Condition",
    brakes: "Brake Condition",
    wearOther: "Other Wear Items (issues?)",
    photos: "Photo Uploads (Optional)",
    photosExterior: "Exterior Photos",
    photosInterior: "Interior Photos",
    photosDash: "Dashboard / Odometer",
    photosDamage: "Damage / Flaws",
    photoHint: "Max 10MB per file; 24 files total.",
    finalDisclaimerTitle: "Final Disclaimer",
    finalDisclaimer: "I confirm the information provided is accurate to the best of my knowledge. I understand that the appraisal value may change if the vehicle's actual condition does not match the details above.",
    agreeLabel: "I agree and confirm",
    submit: "Get My Trade Appraisal",
    smallprint: "By submitting, you agree to be contacted by Quirk Auto. We won't spam you."
  },
  es: {
    title: "Formulario de Tasación de Vehículo a Distancia",
    welcome: "Bienvenido al Programa de Tasación a Distancia de Quirk Auto Dealers",
    instructions: "Por favor, complete este formulario con detalles precisos y completos sobre su vehículo. El valor de tasación que proporcionamos será respetado siempre que la condición del vehículo coincida con sus respuestas. Verificaremos todo cuando traiga el vehículo. Si la condición difiere, la oferta se ajustará en consecuencia.",
    decodeVinBtn: "Decodificar VIN y Rellenar",
    clearBtn: "Limpiar Formulario",
    langToggle: "English Version",
    aboutYou: "Cuéntenos sobre Usted",
    nameLabel: "Nombre Completo",
    phoneLabel: "Número de Teléfono",
    phoneHint: "Solo formato de EE. UU. Solo números; nosotros lo formatearemos.",
    emailLabel: "Correo Electrónico",
    vehDetails: "Detalles del Vehículo",
    vinLabel: "VIN (requerido)",
    vinHint: "El VIN se capitaliza automáticamente; las letras I, O, Q no son válidas.",
    mileageLabel: "Millaje Actual",
    yearLabel: "Año",
    selectYear: "Seleccione el Año",
    makeLabel: "Marca",
    selectMake: "Seleccione la Marca",
    modelLabel: "Modelo",
    selectModel: "Seleccione el Modelo",
    trimLabel: "Nivel de Acabado (si lo sabe)",
    extColorLabel: "Color Exterior",
    intColorLabel: "Color Interior",
    keysLabel: "Número de Llaves Incluidas",
    titleStatus: "Estado del Título",
    titleClean: "Limpio",
    titleLien: "Gravamen",
    titleRebuilt: "Reconstruido",
    titleSalvage: "Salvamento",
    ownersLabel: "Número de Propietarios (estimado OK)",
    accidentLabel: "¿Ha tenido el vehículo algún accidente?",
    accidentRepair: "Si es así, ¿fue reparado profesionalmente?",
    vehCondition: "Condición del Vehículo",
    warnings: "¿Alguna luz de advertencia en el tablero?",
    mech: "Problemas mecánicos",
    cosmetic: "Problemas cosméticos",
    interior: "¿Interior limpio y sin daños?",
    mods: "¿Piezas o modificaciones no originales?",
    smells: "¿Olores inusuales?",
    service: "¿Servicios de rutina al día?",
    wearables: "Revisión de Artículos de Desgaste",
    tires: "Condición de los Neumáticos",
    brakes: "Condición de los Frenos",
    wearOther: "Otros Artículos de Desgaste (¿problemas?)",
    photos: "Subir Fotos (Opcional)",
    photosExterior: "Fotos Exteriores",
    photosInterior: "Fotos Interiores",
    photosDash: "Tablero / Odómetro",
    photosDamage: "Daños / Defectos",
    photoHint: "Máx. 10MB por archivo; 24 archivos en total.",
    finalDisclaimerTitle: "Aviso Final",
    finalDisclaimer: "Confirmo que la información proporcionada es precisa a mi leal saber y entender. Entiendo que el valor de la tasación puede cambiar si la condición real del vehículo no coincide con los detalles anteriores.",
    agreeLabel: "Acepto y confirmo",
    submit: "Obtener Mi Tasación",
    smallprint: "Al enviar, usted acepta ser contactado por Quirk Auto. No le enviaremos spam."
  }
};

let currentLang = 'en';
const langToggleBtn = document.getElementById('langToggle');

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

langToggleBtn.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    setLanguage(newLang);
});


// --- Form Initialization ---

// Populate Year dropdown
(function initYears() {
  const y = document.getElementById('year');
  if (!y) return;
  const thisYear = new Date().getFullYear();
  const start = thisYear + 1;
  for (let i = start; i >= 1995; i--) {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = i;
    y.appendChild(o);
  }
})();

// Populate common Makes
const COMMON_MAKES = ['Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ford', 'GMC', 'Genesis', 'Honda', 'Hyundai', 'INFINITI', 'Jeep', 'Kia', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo', 'Porsche'];
(function initMakes() {
  const m = document.getElementById('make');
  COMMON_MAKES.forEach(x => {
    const o = document.createElement('option');
    o.value = x;
    o.textContent = x;
    m.appendChild(o);
  });
})();


// --- Dynamic Model Loading ---
const makeSel = document.getElementById('make');
const yearSel = document.getElementById('year');
const modelSel = document.getElementById('model');
const modelStatus = document.getElementById('modelStatus');

function resetModels(disable = true) {
  modelSel.innerHTML = `<option value="">${currentLang === 'es' ? 'Seleccione el Modelo' : 'Select Model'}</option>`;
  modelSel.disabled = disable;
  modelStatus.textContent = '';
}

let modelsAborter = null;
async function loadModels() {
  const make = makeSel.value;
  const year = yearSel.value;
  resetModels(true);
  if (!make || !year) return;

  modelStatus.textContent = 'Loading models…';
  try {
    if (modelsAborter) { modelsAborter.abort(); }
    modelsAborter = new AbortController();
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/makeyear/${encodeURIComponent(make)}/modelyear/${encodeURIComponent(year)}?format=json`;
    const res = await fetchWithTimeout(url, { timeout: 9000, signal: modelsAborter.signal });
    const data = await res.json();
    const list = (data.Results || []).map(r => r.Model_Name).filter(Boolean).sort((a, b) => a.localeCompare(b));

    if (list.length) {
      modelSel.disabled = false;
      list.forEach(m => {
        const o = document.createElement('option');
        o.value = m;
        o.textContent = m;
        modelSel.appendChild(o);
      });
      modelStatus.textContent = `${list.length} models found.`;
    } else {
      modelStatus.textContent = 'No models found for that year/make.';
    }
  } catch (e) {
    modelStatus.textContent = 'Could not load models. Try again or type model in Trim field.';
  }
}

makeSel.addEventListener('change', loadModels);
yearSel.addEventListener('change', loadModels);


// --- VIN Decoding ---
const vinInput = document.getElementById('vin');
let lastDecodedVin = '';
let vinAborter = null;

function canDecode(v) { return v.length >= 11; }

async function decodeVin(vin) {
  if (!canDecode(vin) || vin === lastDecodedVin) return;

  if (vinAborter) { vinAborter.abort(); }
  vinAborter = new AbortController();

  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${encodeURIComponent(vin)}?format=json`;
    const r = await fetchWithTimeout(url, { timeout: 9000, signal: vinAborter.signal });
    const j = await r.json();
    const row = (j.Results && j.Results[0]) || {};

    let yearChanged = false;
    let makeChanged = false;

    // Set Year
    if (row.ModelYear && yearSel.value !== row.ModelYear) {
      yearSel.value = row.ModelYear;
      yearChanged = true;
    }

    // Set Make
    if (row.Make) {
      const makeValue = String(row.Make).toUpperCase();
      const existingOption = [...makeSel.options].find(o => o.value.toUpperCase() === makeValue);

      if (!existingOption) {
        const opt = document.createElement('option');
        opt.value = row.Make;
        opt.textContent = row.Make;
        makeSel.appendChild(opt);
      }
      if (makeSel.value.toUpperCase() !== makeValue) {
        makeSel.value = row.Make;
        makeChanged = true;
      }
    }

    // If year or make changed, we must reload models
    if (yearChanged || makeChanged) {
      await loadModels();
    }
    
    // Set Model - after models have been loaded
    if (row.Model) {
        const modelToSet = String(row.Model).toUpperCase();
        const matchingOption = [...modelSel.options].find(opt => opt.value.toUpperCase() === modelToSet);
        if (matchingOption) {
            modelSel.value = matchingOption.value;
        } else {
            console.warn(`VIN-decoded model "${row.Model}" not found in the loaded list.`);
        }
    }

    lastDecodedVin = vin;
  } catch (e) {
    console.error("VIN decoding failed:", e);
  }
}

const debouncedAutoDecode = debounce(() => decodeVin(vinInput.value.trim()), 600);
vinInput.addEventListener('input', (e) => {
  const v = e.target.value.toUpperCase().replace(/[IOQ\s]/g, '');
  e.target.value = v;
  if (canDecode(v)) debouncedAutoDecode();
});

// Manual decode button
document.getElementById('decodeVinBtn').addEventListener('click', () => {
    const vin = vinInput.value.trim();
    if (vin.length === 17) {
        decodeVin(vin);
    } else {
        showToast('Please enter a full 17-character VIN.');
    }
});


// --- Form Input Formatting & Handling ---
const phone = document.getElementById('phone');
const phoneRaw = document.getElementById('phoneRaw');
phone.addEventListener('input', () => {
  const d = phone.value.replace(/\D/g, '').slice(0, 10);
  let out = d;
  if (d.length > 6) {
    out = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  } else if (d.length > 3) {
    out = `(${d.slice(0, 3)}) ${d.slice(3)}`;
  }
  phone.value = out;
  phoneRaw.value = d;
});

// Clear form button
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('tradeForm').reset();
    resetModels(); // Reset model dropdown to initial state
    updateSubmitState();
});


// --- Form Submission ---
const form = document.getElementById('tradeForm');
const submitBtn = document.getElementById('submitBtn');
const agree = document.getElementById('agree');

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function updateSubmitState() {
  submitBtn.disabled = !agree.checked;
}

form.noValidate = true;
updateSubmitState();
agree.addEventListener('change', updateSubmitState);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!agree.checked) {
    showToast('Please confirm the final disclaimer.');
    return;
  }
  const vinVal = vinInput.value.trim();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vinVal)) {
    showToast('Please enter a valid 17-character VIN.');
    vinInput.focus();
    return;
  }
  const digits = (phoneRaw.value || '').replace(/\D/g, '');
  if (digits.length !== 10) {
    showToast('Please enter a valid 10-digit US phone.');
    phone.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';
  form.setAttribute('aria-busy', 'true');

  const fd = new FormData(form);
  // Note: FormData handles file inputs correctly for multipart/form-data submission.
  // The serverless function needs to be adapted to handle multipart data.
  // For now, continuing with JSON submission which will exclude files.
  
  const payload = {};
  fd.forEach((v, k) => {
      // We are not handling file uploads in this JSON payload
      if (typeof v !== 'object') {
          payload[k] = v;
      }
  });
  payload.phoneRaw = (payload.phoneRaw || (payload.phone || '').replace(/\D/g, '')).slice(0, 10);

  try {
    const res = await fetchWithTimeout('/.netlify/functions/trade-appraisal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      timeout: 15000
    });
    if (!res.ok) throw new Error('Network response was not ok');
    
    showToast('Submitted! A specialist will contact you shortly.');
    setTimeout(() => { window.location.href = '/success/'; }, 400);

  } catch (err) {
    showToast('Could not submit right now. Please try again.');
  } finally {
    // Re-enable the submit button, even if the user stays on the page
    updateSubmitState();
    submitBtn.textContent = translations[currentLang].submit;
    form.removeAttribute('aria-busy');
  }
});
