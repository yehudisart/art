/**
 * Serverless function: sends the contact / painting-inquiry form straight to
 * the artist's inbox, server-side, using Resend.
 *
 * Nothing here runs in the browser, so the Resend API key never reaches the
 * visitor — it lives only in a Vercel Environment Variable. See README.md
 * for the one-time setup.
 */

const TO_EMAIL = 'yehudisart@gmail.com';
const ALLOWED_HOST = 'yehudisjacobs.com';

// Same-origin only. This endpoint accepts no configuration from the client
// (no destination address, no "from" override) — the only thing a request
// can influence is the body of the email itself — so there is nothing for a
// third-party page to gain by calling it, but the Origin check keeps the
// server logs clean of stray traffic from anywhere else.
//
// Uses proper URL/hostname parsing rather than a string prefix check, so it
// correctly allows any subdomain (www.yehudisjacobs.com, a Vercel preview
// deployment, etc.) instead of only the exact bare domain — a prefix check
// like origin.startsWith('https://yehudisjacobs.com') rejects
// https://www.yehudisjacobs.com outright, which is what was blocking every
// real submission from the live site.
function isAllowedOrigin(req) {
  const check = (val) => {
    if (!val) return false;
    try {
      const host = new URL(val).hostname;
      return host === ALLOWED_HOST || host.endsWith('.' + ALLOWED_HOST)
          || host.endsWith('.vercel.app')
          || host === 'localhost' || host === '127.0.0.1';
    } catch { return false; }
  };
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  if (!origin && !referer) return true; // same-origin requests often omit both
  return check(origin) || check(referer);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const { name, email, phone, subject, message, work, hp } = body;

  // Honeypot: a hidden field a real visitor never sees or fills. If it has
  // a value, report success without actually sending anything, so a bot
  // gets no signal that it was caught.
  if (hp) return res.status(200).json({ ok: true });

  const nameTrim = String(name || '').trim();
  const emailTrim = String(email || '').trim();
  const messageTrim = String(message || '').trim();

  if (!nameTrim || !emailTrim || !messageTrim) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }
  if (!EMAIL_RE.test(emailTrim)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address' });
  }
  if (messageTrim.length > 5000 || nameTrim.length > 200) {
    return res.status(400).json({ ok: false, error: 'Input too long' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set in the Vercel project settings.');
    return res.status(500).json({ ok: false, error: 'Email service not configured' });
  }

  const subjectLine = subject
    ? String(subject).trim().slice(0, 200)
    : (work ? `Inquiry: ${String(work).trim().slice(0, 150)}` : 'New message from yehudisjacobs.com');

  const phoneTrim = phone ? String(phone).trim().slice(0, 60) : '';
  const workTrim = work ? String(work).trim().slice(0, 150) : '';

  const textLines = [
    `Name: ${nameTrim}`,
    `Email: ${emailTrim}`,
    phoneTrim ? `Phone: ${phoneTrim}` : null,
    workTrim ? `Painting: ${workTrim}` : null,
    '',
    messageTrim,
  ].filter((l) => l !== null).join('\n');

  const htmlRows = [
    ['Name', nameTrim],
    ['Email', emailTrim],
    phoneTrim ? ['Phone', phoneTrim] : null,
    workTrim ? ['Painting', workTrim] : null,
  ].filter(Boolean)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#767676">${k}</td><td>${escapeHtml(v)}</td></tr>`)
    .join('');

  const html = `
    <div style="font-family:Georgia,serif;color:#111;max-width:520px">
      <table style="border-collapse:collapse;margin-bottom:16px">${htmlRows}</table>
      <p style="white-space:pre-wrap;line-height:1.6;border-top:1px solid #e5e5e5;padding-top:16px">${escapeHtml(messageTrim)}</p>
    </div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Yehudis Jacobs Website <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: emailTrim,
        subject: subjectLine,
        text: textLines,
        html,
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      console.error('Resend API error:', r.status, errText);
      return res.status(502).json({ ok: false, error: 'Failed to send' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form send failed:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};
