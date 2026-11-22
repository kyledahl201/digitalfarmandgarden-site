// hire-form.js: sends the Hire me for a day form without leaving the page (served as /assets/hire-form.js).
// It is kyledahl.dev's js/hire.js with the contact address read from the form's data-contact attribute, so the page needs
// no inline script and the site-wide page policy (CSP) needs no new hash (AEGIS-FS-003, Phase 5).
// With scripts off the form still posts the plain way and the handler answers with a page of its own.
// tools/prerender.mjs copies this file into dist/assets/ only when INCLUDE_HIRE is on.
const form = document.querySelector('#hire-form');
if (form) {
  const out = form.querySelector('output'), btn = form.querySelector('button[type=submit]');
  const contact = form.dataset.contact || '';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    out.textContent = 'Sending...';
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const d = await r.json();
      out.textContent = d.message;
      if (d.ok) { form.reset(); out.focus(); return; }   // the button stays off; focus moves to the answer
    } catch {
      out.textContent = `That did not send. Please email me instead: ${contact}`;
    }
    btn.disabled = false;
    if (window.turnstile) window.turnstile.reset();   // a spam token works once
  });
}
