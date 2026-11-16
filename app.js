/* Project AURA website: navigation, illustrative examples and optional media. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);

  // Accessible, lightweight mobile navigation.
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = byId('site-nav');
  function setMenu(open) {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', open);
  }
  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
      }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 800) setMenu(false); });
  }

  // Default firmware thresholds, with preset, explicitly simulated inputs.
  // The full digital twins and the downloadable guide contain the complete rule set.
  const examples = {
    baseline: { uv: 2, hr: 78, spo2: 98, temp: 36.8, spf: true, title: 'Fewer demo flags.', description: 'Fewer penalties under these example settings.' },
    caution: { uv: 6, hr: 110, spo2: 95, temp: 37.5, spf: false, title: 'Signals need a look.', description: 'More of the demo rules are contributing penalties.' },
    high: { uv: 9, hr: 130, spo2: 95, temp: 37.5, spf: true, title: 'Several signals align.', description: 'Multiple indicators add up under the demo rules.' }
  };
  function exampleScore(e) {
    let penalty = 0;
    const uvIndex = Math.round(e.uv);
    const effectiveUv = e.uv; // all three examples use Standard sensitivity
    if (effectiveUv > 2) penalty += Math.min(38, (effectiveUv - 2) * 4);
    if (!e.spf && uvIndex >= 3) penalty += 8;
    if (e.hr > 120) penalty += 18 + Math.min(14, (e.hr - 120) * 0.45);
    else if (e.hr < 50) penalty += 18 + Math.min(14, (50 - e.hr) * 0.65);
    else if (e.hr > 106) penalty += (e.hr - 106) * 0.4;
    if (e.spo2 < 92) penalty += 22 + Math.min(16, (92 - e.spo2) * 3);
    else if (e.spo2 < 96) penalty += (96 - e.spo2) * 2;
    if (e.temp > 38) penalty += 18 + Math.min(14, (e.temp - 38) * 10);
    else if (e.temp > 37.3) penalty += (e.temp - 37.3) * 9;
    if (uvIndex >= 6 && (e.temp >= 37.4 || e.hr >= 108)) penalty += 12;
    return Math.max(0, Math.min(100, Math.round(100 - penalty)));
  }
  function metric(id, value, unit) {
    const element = byId(id);
    if (!element) return;
    element.textContent = String(value);
    if (unit) {
      const small = document.createElement('small');
      small.textContent = unit;
      element.appendChild(small);
    }
  }
  function showScenario(name) {
    const example = examples[name];
    if (!example) return;
    const score = exampleScore(example);
    const band = score >= 80 ? 'OPTIMAL' : score >= 55 ? 'CAUTION' : 'HIGH RISK';
    byId('score-value').textContent = String(score);
    byId('score-ring').style.setProperty('--score', String(score));
    byId('score-ring').setAttribute('aria-valuenow', String(score));
    byId('scenario-label').textContent = example.title;
    byId('scenario-description').textContent = example.description;
    byId('scenario-band').textContent = `${band} · DEMO`;
    metric('example-uv', example.uv);
    metric('example-hr', example.hr, ' BPM');
    metric('example-spo2', example.spo2, '%');
    metric('example-temp', example.temp.toFixed(1), '°C');
    byId('example-spf').textContent = `SUNSCREEN: ${example.spf ? 'LOGGED' : 'NOT LOGGED'}`;
    document.querySelectorAll('[data-scenario]').forEach(button => {
      const active = button.dataset.scenario === name;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  document.querySelectorAll('[data-scenario]').forEach(button => {
    button.addEventListener('click', () => showScenario(button.dataset.scenario));
  });

  // Render only owner-supplied content. Empty inputs keep the honest Coming soon states.
  const content = window.AURA_CONTENT || {};
  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value.trim(), document.baseURI);
      if (url.protocol === 'http:' || url.protocol === 'https:' || (url.protocol === 'file:' && location.protocol === 'file:')) return url.href;
    } catch (_) { /* An invalid URL stays unavailable. */ }
    return null;
  }
  function createPhoto(item, index) {
    if (!item || typeof item !== 'object') return null;
    const url = safeUrl(item.src);
    if (!url) return null;
    const figure = document.createElement('figure');
    figure.className = 'gallery-card';
    const imageWrap = document.createElement('div');
    imageWrap.className = 'gallery-image';
    const image = document.createElement('img');
    image.src = url;
    image.alt = String(item.alt || item.title || 'Project AURA photograph');
    image.loading = 'lazy';
    imageWrap.appendChild(image);
    const caption = document.createElement('figcaption');
    const copy = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = String(item.title || `Project photo ${index + 1}`);
    const description = document.createElement('small');
    description.textContent = String(item.caption || 'From the AURA build.');
    const marker = document.createElement('span');
    marker.textContent = 'PROJECT PHOTO';
    copy.append(title, description);
    caption.append(copy, marker);
    figure.append(imageWrap, caption);
    return figure;
  }
  const photoGrid = byId('photo-grid');
  if (photoGrid && Array.isArray(content.photos)) {
    const photos = content.photos.map(createPhoto).filter(Boolean);
    const placeholders = Array.from(photoGrid.children);
    photos.forEach((photo, index) => {
      if (placeholders[index]) placeholders[index].replaceWith(photo);
      else photoGrid.appendChild(photo);
    });
  }

  function youtubeId(input) {
    try {
      const url = new URL(input);
      const host = url.hostname.toLowerCase();
      let id = '';
      if (host === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
      else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
        if (url.pathname === '/watch') id = url.searchParams.get('v') || '';
        else if (/^\/(embed|shorts)\//.test(url.pathname)) id = url.pathname.split('/')[2] || '';
      }
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    } catch (_) { return null; }
  }
  const videoSlot = byId('video-slot');
  const video = content.video;
  if (videoSlot && video && typeof video === 'object') {
    const url = safeUrl(video.url);
    const type = String(video.type || '').toLowerCase();
    let player = null;
    if (url && type === 'file') {
      player = document.createElement('video');
      player.src = url;
      player.controls = true;
      player.preload = 'metadata';
      player.playsInline = true;
      player.setAttribute('aria-label', String(video.title || 'AURA prototype video'));
    } else if (url && type === 'youtube') {
      const id = youtubeId(url);
      if (id) {
        player = document.createElement('iframe');
        player.src = `https://www.youtube-nocookie.com/embed/${id}`;
        player.title = String(video.title || 'AURA prototype video');
        player.loading = 'lazy';
        player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        player.allowFullscreen = true;
        player.referrerPolicy = 'strict-origin-when-cross-origin';
      }
    }
    if (player) {
      const title = document.createElement('h3');
      title.className = 'ready-title';
      title.textContent = String(video.title || 'AURA prototype demonstration');
      videoSlot.replaceChildren(title, player);
      videoSlot.classList.add('has-video');
    }
  }

  const documentList = byId('document-list');
  if (documentList && Array.isArray(content.documents) && content.documents.length) {
    const rows = content.documents.filter(item => item && typeof item === 'object').map(item => {
      const url = safeUrl(item.url);
      const row = document.createElement(url ? 'a' : 'div');
      row.className = 'document-row';
      const title = String(item.title || 'Document');
      if (url) {
        row.href = url;
        row.target = '_blank';
        row.rel = 'noopener noreferrer';
        row.setAttribute('aria-label', `${title} (opens in a new tab)`);
      }
      const label = document.createElement('span');
      label.textContent = title;
      const status = document.createElement('small');
      status.textContent = url ? 'VIEW DOCUMENT ↗' : 'COMING SOON';
      row.append(label, status);
      return row;
    });
    if (rows.length) documentList.replaceChildren(...rows);
  }
})();
