import sg from "@sendgrid/mail";
sg.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function handler(event) {
  const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "ok" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method Not Allowed" };

  let data;
  try { data = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers, body: "Invalid JSON" }; }

  if (!data.name || !data.email || !data.phone || !data.vin) {
    return { statusCode: 400, headers, body: "Missing required fields" };
  }

  const adfXml = `<?xml version="1.0"?>
<adf>
  <prospect status="new">
    <requestdate>${new Date().toISOString()}</requestdate>
    <vehicle interest="trade-in">
      <year>${data.year||""}</year>
      <make>${data.make||""}</make>
      <model>${data.model||""}</model>
      <vin>${data.vin||""}</vin>
    </vehicle>
    <customer>
      <contact>
        <name part="full">${data.name}</name>
        <phone>${data.phone}</phone>
        <email>${data.email}</email>
      </contact>
    </customer>
    <vendor>
      <contact><name part="full">Quirk Auto</name></contact>
    </vendor>
  </prospect>
</adf>`;

  const msg = {
    to: process.env.VINSOLUTIONS_TO,
    from: process.env.FROM_EMAIL,
    subject: `Trade-In Lead: ${data.name}`,
    text: adfXml,
    html: `<pre>${adfXml}</pre>`,
  };
  try { await sg.send(msg); }
  catch (e) { return { statusCode: 502, headers, body: "Send failed" }; }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
}