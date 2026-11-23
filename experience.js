/* AURA's page-specific interactions. No external services or simulated live readings. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const signals = {
    uv: { index: '01', glyph: '☼', kicker: 'UV AWARENESS', heading: 'The outside signal.', description: 'The prototype estimates UV levels and tracks approximate exposure time. Its mapping needs calibration against a reference.' },
    heart: { index: '02', glyph: '♥', kicker: 'HEART RATE', heading: 'A pulse to explore.', description: 'The MAX30102 explores an optical heart-rate estimate when a usable signal is detected. Accuracy is not guaranteed.' },
    oxygen: { index: '03', glyph: 'O₂', kicker: 'BLOOD OXYGEN', heading: 'One more indicator.', description: 'An experimental SpO₂ estimate is included. The current calculation has an 86% floor and may hide lower values.' },
    temp: { index: '04', glyph: '°', kicker: 'SENSOR TEMPERATURE', heading: 'Degrees of context.', description: 'A DS18B20 reports sensor temperature in Celsius and Fahrenheit; it is not a core body-temperature measurement.' }
  };
  const signalButtons = Array.from(document.querySelectorAll('[data-signal]'));
  signalButtons.forEach(button => button.addEventListener('click', () => {
    const data = signals[button.dataset.signal];
    if (!data || !$('signal-heading')) return;
    $('signal-index').textContent = data.index;
    $('signal-glyph').textContent = data.glyph;
    $('signal-kicker').textContent = data.kicker;
    $('signal-heading').textContent = data.heading;
    $('signal-description').textContent = data.description;
    signalButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }));

  // Let visitors pause decorative motion; system reduced-motion always wins.
  const motionButtons = Array.from(document.querySelectorAll('[data-motion-toggle]'));
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = window.localStorage.getItem('aura-motion-paused') === 'true'; } catch (_) {}
  function updateMotion() {
    const effective = paused || media.matches;
    document.documentElement.classList.toggle('motion-paused', effective);
    motionButtons.forEach(button => {
      button.disabled = media.matches;
      button.setAttribute('aria-pressed', String(effective));
      button.textContent = media.matches ? 'Reduced motion on' : (paused ? 'Resume motion' : 'Pause motion');
    });
  }
  motionButtons.forEach(button => button.addEventListener('click', () => {
    if (media.matches) return;
    paused = !paused;
    try { window.localStorage.setItem('aura-motion-paused', String(paused)); } catch (_) {}
    updateMotion();
  }));
  if (typeof media.addEventListener === 'function') media.addEventListener('change', updateMotion);
  else if (typeof media.addListener === 'function') media.addListener(updateMotion);
  updateMotion();

  const screenRail = $('screen-rail');
  document.querySelectorAll('[data-screen-nav]').forEach(button => button.addEventListener('click', () => {
    if (!screenRail) return;
    const width = screenRail.firstElementChild?.getBoundingClientRect().width || 200;
    const direction = Number(button.dataset.screenNav) < 0 ? -1 : 1;
    screenRail.scrollBy({ left: direction * (width + 12) * 2, behavior: paused || media.matches ? 'auto' : 'smooth' });
  }));

  const copyButton = document.querySelector('[data-copy-email]');
  if (copyButton) copyButton.addEventListener('click', async () => {
    const text = copyButton.dataset.email || '';
    const status = document.querySelector('.copy-status');
    let copied = false;
    if (status) status.textContent = 'Copying…';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      } else {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.style.position = 'fixed';
        temp.style.left = '-10000px';
        document.body.appendChild(temp);
        temp.select();
        copied = document.execCommand('copy');
        temp.remove();
      }
    } catch (_) { copied = false; }
    if (status) status.textContent = copied ? 'Email address copied.' : 'Copy unavailable — select the address above.';
  });

  // This is a mailto draft, never a fake form submission or a remote service.
  const form = $('contact-form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = $('contact-name').value.trim();
    const topic = $('contact-topic').value;
    const message = $('contact-message').value.trim();
    const status = form.querySelector('.form-status');
    if (!message) {
      if (status) status.textContent = 'Please enter a message.';
      $('contact-message').focus();
      return;
    }
    const body = message + (name ? `\n\nFrom: ${name}` : '');
    const mailto = `mailto:armaan.jain@british-school.org?subject=${encodeURIComponent('Project AURA — ' + topic)}&body=${encodeURIComponent(body)}`;
    if (status) {
      const retry = document.createElement('a');
      retry.href = mailto;
      retry.textContent = 'Open the draft again';
      status.replaceChildren(document.createTextNode('Review and send the message in your email app. '), retry);
    }
    window.location.href = mailto;
  });
})();
