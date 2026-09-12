import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || '';
const WHATSAPP_NUMBER = '919769131599';

const productApiUrl = API ? `${API.replace(/\/$/, '')}/api/products` : '/api/products';

const imageSrc = (url) => {
  if (url.startsWith('data:')) return url;
  return API ? `${API.replace(/\/$/, '')}${url}` : url;
};

const categoryLabel = (category = '') => {
  const normalized = String(category).toLowerCase().trim();
  const map = {
    football: 'Football',
    cricket: 'Cricket',
    school: 'School',
    party: 'Party',
    occasion: 'Special Occasion',
    events: 'Events',
  };

  return map[normalized] || normalized
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

function wa(item) {
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in ${item}. Please share the price, available sizes, availability and details.`)}`,
    '_blank'
  );
}

function Box({ title, items, action }) {
  return (
    <div className="box">
      <h3>{title}</h3>
      <p>Custom teamwear for groups that want a common identity.</p>
      <div className="list">
        {items.map((entry) => {
          const [label, detail] = entry.split('|');
          return (
            <div key={`${title}-${label}`}>
              <b>{label}</b>
              <small>{detail}</small>
            </div>
          );
        })}
      </div>
      <button className="cta" onClick={() => wa(action)}>
        Discuss Custom Design <ArrowRight />
      </button>
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => {
    fetch(productApiUrl)
      .then((response) => response.json())
      .then(setItems)
      .catch(console.error);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const tabs = [
    { key: 'all', label: 'All' },
    ...Array.from(new Set(items.map((item) => item.category))).map((category) => ({
      key: category,
      label: categoryLabel(category),
    })),
  ];

  const shown = filter === 'all' ? items : items.filter((x) => x.category === filter);

  return (
    <>
      <nav>
        <b>THE GENZ FASHION</b>
        <div className="links">
          <a href="#shop">Shop</a>
          <a href="#custom">Custom Jerseys</a>
          <a href="#occasions">Occasions</a>
        </div>
        <button className="wa" onClick={() => wa('General enquiry')}>
          <MessageCircle /> WhatsApp Us
        </button>
      </nav>

      <header className="hero">
        <div>
          <small>JERSEYS • TEAMWEAR • CUSTOM MADE</small>
          <h1>
            YOUR GAME.<br />
            YOUR STYLE.
          </h1>
          <p>
            Football, cricket and custom-made jerseys for schools, colleges, offices,
            restaurants, teams and special occasions.
          </p>
          <div className="buttons">
            <a className="btn" href="#shop">Explore Jerseys</a>
            <a className="btn dark" href="#custom">Create Custom Jersey</a>
          </div>
        </div>

        <div className="heroimg">
          {items[0] && <img src={imageSrc(items[0].url)} alt="Latest jersey" />}
          <span>
            <Sparkles /> Latest drop
          </span>
        </div>
      </header>

      <section className="section" id="shop">
        <h2>Shop the Collection</h2>
        <div className="auto">
          ✨ {items.length} jersey photos • newest first • auto-refresh every 30 seconds
        </div>

        <div className="pills">
          {tabs.map((tab) => (
            <button
              className={filter === tab.key ? 'active' : ''}
              onClick={() => setFilter(tab.key)}
              key={tab.key}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid">
          {shown.map((item) => (
            <article className="card" key={item.id}>
              <img src={imageSrc(item.url)} alt={item.title} loading="lazy" />
              <div className="body">
                <small>{item.category}</small>
                <h3>{item.title}</h3>
                <p>Message us for price, sizes, availability and ordering.</p>
                <button className="cardwa" onClick={() => wa(item.title)}>
                  <MessageCircle /> Ask on WhatsApp
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="custom">
        <h2>Custom Jersey Design</h2>
        <div className="boxes">
          <Box
            title="College Teams"
            items={[
              'College Pride|Custom team identity',
              'Campus Matchday|Add your college name and colors',
              'Training Kit|High-performance custom fit',
            ]}
            action="College team jerseys"
          />
          <Box
            title="Business & Events"
            items={[
              'Corporate Match|Staff jersey branding',
              'Restaurant Team|Unique event uniforms',
              'Birthday/Occasion|Personalized custom look',
            ]}
            action="Business and event jerseys"
          />
          <Box
            title="Group Orders"
            items={[
              'School Team|Set identity for every player',
              'Office League|Workplace pride and unity',
              'Social Club|Stand out at every match',
            ]}
            action="Group jersey orders"
          />
        </div>
      </section>

      <section className="section" id="occasions">
        <h2>Special Occasions & Events</h2>
        <div className="mini">
          <div>
            <strong>Wedding & Family Events</strong>
            <p>Matching team jerseys for occasions, family functions and event uniforms.</p>
          </div>
          <div>
            <strong>Birthday & Party</strong>
            <p>Custom festive jerseys to match your theme, group and celebration.</p>
          </div>
          <div>
            <strong>School & College Events</strong>
            <p>Unified team looks for inter-school events, tournaments and spirit days.</p>
          </div>
        </div>
      </section>

      <div className="footer">© 2026 The Genz Fashion</div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
