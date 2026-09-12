const WHATSAPP_NUMBER = '919769131599';

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}[character]));

function openWhatsApp(message) {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function addSportBadges() {
  document.querySelectorAll('.card').forEach((card) => {
    if (card.querySelector('.sport-badge')) return;
    const category = card.querySelector('.body small')?.textContent?.trim() || 'Teamwear';
    const label = category === 'football' ? 'MATCH READY' : category === 'cricket' ? 'MATCH KIT' : 'TEAMWEAR';
    const badge = document.createElement('span');
    badge.className = 'sport-badge';
    badge.textContent = label;
    card.appendChild(badge);
  });

  document.querySelectorAll('.card').forEach((card) => {
    const description = card.querySelector('.body p');
    const category = card.querySelector('.body small')?.textContent?.trim().toLowerCase() || 'team';
    if (!description || description.dataset.enhanced === 'true') return;

    const copy = {
      football: 'Match-ready energy for your squad.',
      cricket: 'Built for the crease, made for your team.',
      school: 'Bring your school colours to game day.',
      party: 'Make your squad the main event.',
      occasion: 'Custom style for every celebration.',
      events: 'Stand out together at every event.',
    }[category] || 'Built to make your team stand out.';

    description.textContent = `${copy} Ask us for sizes and availability.`;
    description.dataset.enhanced = 'true';
  });
}

function addMatchdayMessage() {
  const hero = document.querySelector('.hero h1');
  if (!hero || document.querySelector('.matchday-line')) return;

  const line = document.createElement('div');
  line.className = 'matchday-line';
  hero.insertAdjacentElement('afterend', line);
  const messages = ['BUILT FOR MATCHDAY', 'MADE FOR YOUR SQUAD', 'WEAR YOUR IDENTITY'];
  let index = 0;
  const update = () => {
    line.classList.remove('is-visible');
    window.setTimeout(() => {
      line.textContent = messages[index];
      line.classList.add('is-visible');
      index = (index + 1) % messages.length;
    }, 180);
  };
  update();
  window.setInterval(update, 3200);
}

function updateHeroBadge() {
  const badge = document.querySelector('.heroimg span');
  if (!badge || badge.dataset.updated === 'true') return;

  const textNode = Array.from(badge.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode) textNode.textContent = ' MATCHDAY SPOTLIGHT';
  badge.dataset.updated = 'true';
}

function loadTopHeroImage() {
  const image = document.querySelector('.heroimg img');
  if (!image || image.dataset.topLoaded === 'true') return;

  fetch('/api/products')
    .then((response) => response.json())
    .then((items) => {
      const topImages = items.filter((item) => item.category === 'top');
      if (!topImages.length) return;

      let index = 0;
      const showTopImage = () => {
        const topImage = topImages[index];
        image.src = topImage.url;
        image.alt = `Top design ${index + 1}`;
        index = (index + 1) % topImages.length;
      };

      showTopImage();
      window.setInterval(showTopImage, 5000);
      image.dataset.topLoaded = 'true';
    })
    .catch(console.error);
}

function addSportsInfo() {
  const shop = document.querySelector('#shop');
  const grid = shop?.querySelector('.grid');
  if (!shop || !grid || shop.querySelector('.sports-info')) return;

  const info = document.createElement('div');
  info.className = 'sports-info';
  info.innerHTML = '<strong>TEAM ORDERS</strong><span>Custom names, numbers and logos</span><span>Bulk orders welcome</span><span>Message for sizes and delivery time</span>';
  grid.insertAdjacentElement('beforebegin', info);
}

function addFolderTabs() {
  const pills = document.querySelector('#shop .pills');
  const grid = document.querySelector('#shop .grid');
  const cards = Array.from(document.querySelectorAll('#shop .card'));
  if (!pills || !grid || !cards.length) return;

  const categories = Array.from(new Set(cards.map((card) => card.querySelector('.body small')?.textContent?.trim()).filter(Boolean)));
  const labels = (category) => category.split(/[-_\s]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  const current = pills.dataset.folderTabs;
  const signature = categories.join('|');
  const expectedLabels = ['All', ...categories.map(labels)].join('|');
  const visibleLabels = Array.from(pills.querySelectorAll('button')).map((button) => button.textContent.trim()).join('|');
  if (current === signature && visibleLabels === expectedLabels) return;

  pills.dataset.folderTabs = signature;
  pills.innerHTML = '';
  const show = (category) => {
    grid.dataset.folderFilter = category;
    cards.forEach((card) => {
      card.style.display = category === 'all' || card.querySelector('.body small')?.textContent?.trim() === category ? '' : 'none';
    });
  };
  [['all', 'All'], ...categories.map((category) => [category, labels(category)])].forEach(([key, label], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = index === 0 ? 'active' : '';
    button.addEventListener('click', () => {
      pills.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      show(key);
    });
    pills.appendChild(button);
  });
}

function addFeaturedSquad() {
  const footer = document.querySelector('footer');
  if (!footer || document.querySelector('.featured-squad')) return;

  const section = document.createElement('section');
  section.className = 'section featured-squad';
  section.innerHTML = '<div class="section-kicker">THE TEAM EDIT</div><h2>Featured Squad</h2><p class="lead">One design. One crew. One unforgettable look.</p><div class="squad-grid"><article><b>THE WEEKEND XI</b><span>Matchday football kits</span></article><article><b>SCHOOL SPORTS KIT</b><span>Built for every house</span></article><article><b>OFFICE LEAGUE</b><span>Bring your team together</span></article><article><b>BIRTHDAY SQUAD</b><span>Custom looks for every celebration</span></article></div>';
  footer.insertAdjacentElement('beforebegin', section);
}

function addCatalogControls() {
  const grid = document.querySelector('#shop .grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.card'));
  if (grid.dataset.folderFilter && grid.dataset.folderFilter !== 'all') {
    cards.forEach((card) => {
      card.style.display = card.querySelector('.body small')?.textContent?.trim() === grid.dataset.folderFilter ? '' : 'none';
    });
    document.querySelector('.load-more-designs')?.remove();
    return;
  }
  const limit = Number(grid.dataset.visibleLimit || 12);
  cards.forEach((card, index) => {
    card.style.display = index < limit ? '' : 'none';
  });

  let button = document.querySelector('.load-more-designs');
  if (cards.length <= limit) {
    button?.remove();
    return;
  }

  if (!button) {
    button = document.createElement('button');
    button.className = 'load-more-designs';
    button.type = 'button';
    button.textContent = 'Load More Designs';
    grid.insertAdjacentElement('afterend', button);
    button.addEventListener('click', () => {
      grid.dataset.visibleLimit = String(Number(grid.dataset.visibleLimit || 12) + 12);
      addCatalogControls();
    });
  }

  button.textContent = limit >= cards.length ? 'All Designs Loaded' : 'Load More Designs';
  button.disabled = limit >= cards.length;
}

function addBuildKit() {
  if (document.querySelector('.kit-launcher')) return;

  const launcher = document.createElement('button');
  launcher.className = 'kit-launcher';
  launcher.type = 'button';
  launcher.innerHTML = '<span>+</span> Build Your Kit';

  const modal = document.createElement('div');
  modal.className = 'kit-modal';
  modal.hidden = true;
  modal.innerHTML = `<div class="kit-dialog" role="dialog" aria-modal="true" aria-labelledby="kit-title">
    <button class="kit-close" type="button" aria-label="Close">×</button>
    <div class="section-kicker">MATCHDAY CUSTOMIZER</div>
    <h2 id="kit-title">Build Your Kit</h2>
    <p>Share your team details and start a custom WhatsApp enquiry.</p>
    <form class="kit-form">
      <label>Sport<select name="sport"><option>Football</option><option>Cricket</option><option>School Sports</option><option>Other Event</option></select></label>
      <label>Team colours<input name="colors" placeholder="Example: orange and black" required></label>
      <label>Jersey type<select name="type"><option>Match Jersey</option><option>Full Kit</option><option>Training Kit</option><option>Custom Event Jersey</option></select></label>
      <label>Quantity<input name="quantity" type="number" min="1" value="10" required></label>
      <label>Names and numbers<textarea name="players" rows="3" placeholder="Example: Rahul 7, Aisha 10"></textarea></label>
      <label>Logo file<input name="logo" type="file" accept="image/*"></label>
      <button class="kit-submit" type="submit">Start on WhatsApp <span>→</span></button>
    </form>
  </div>`;

  document.body.append(launcher, modal);
  const close = () => { modal.hidden = true; };
  launcher.addEventListener('click', () => { modal.hidden = false; modal.querySelector('input')?.focus(); });
  modal.querySelector('.kit-close').addEventListener('click', close);
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  modal.querySelector('.kit-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const logo = form.get('logo');
    const message = [
      'Hi! I want to build a custom jersey kit.',
      `Sport: ${form.get('sport')}`,
      `Colours: ${form.get('colors')}`,
      `Jersey type: ${form.get('type')}`,
      `Quantity: ${form.get('quantity')}`,
      `Names and numbers: ${form.get('players') || 'To be discussed'}`,
      `Logo: ${logo?.name || 'To be shared'}`,
    ].join('\n');
    openWhatsApp(message);
    close();
  });
}

function initSportsEnhancements() {
  addSportBadges();
  addMatchdayMessage();
  updateHeroBadge();
  loadTopHeroImage();
  addSportsInfo();
  addFolderTabs();
  addFeaturedSquad();
  addCatalogControls();
  addBuildKit();
  window.setInterval(() => {
    addSportBadges();
    updateHeroBadge();
    loadTopHeroImage();
    addCatalogControls();
    addSportsInfo();
    addFolderTabs();
    addFeaturedSquad();
  }, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSportsEnhancements, { once: true });
} else {
  initSportsEnhancements();
}
