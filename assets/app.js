document.addEventListener('DOMContentLoaded', ()=> {
  const form = document.getElementById('tradeForm');
  const vinInput = document.getElementById('vin');

  vinInput.addEventListener('input', async (e)=> {
    const vin = e.target.value.trim();
    if (vin.length === 17) {
      try {
        const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
        const data = await res.json();
        const results = data.Results || [];
        document.querySelector('input[name=year]').value = results.find(r => r.Variable === 'Model Year')?.Value || '';
        document.querySelector('input[name=make]').value = results.find(r => r.Variable === 'Make')?.Value || '';
        document.querySelector('input[name=model]').value = results.find(r => r.Variable === 'Model')?.Value || '';
      } catch(err) { console.error('VIN decode failed', err); }
    }
  });

  form.addEventListener('submit', async (e)=> {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch(form.action, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        window.location.href = '/success/';
      } else {
        alert('Submission failed');
      }
    } catch(err) {
      alert('Error submitting form');
    }
  });
});