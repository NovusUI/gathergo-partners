import React, { useState } from 'react';
import { IMG_W, NOTCH } from '../constants';

export default function MarqueeCard({ card }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ width: 450, height: 170, flexShrink: 0, position: 'relative', marginRight: 24 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'absolute', inset: 0, background: '#A8F5E8', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -NOTCH, left: IMG_W - NOTCH, width: NOTCH * 2, height: NOTCH * 2, borderRadius: '50%', background: '#132142', zIndex: 4 }} />
        <div style={{ position: 'absolute', bottom: -NOTCH, left: IMG_W - NOTCH, width: NOTCH * 2, height: NOTCH * 2, borderRadius: '50%', background: '#132142', zIndex: 4 }} />
        <div style={{ position: 'absolute', left: IMG_W, top: NOTCH, bottom: NOTCH, width: 0, borderLeft: '2px dashed rgba(10,22,40,0.25)', zIndex: 3 }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: IMG_W, padding: 10, boxSizing: 'border-box', borderRadius: '18px 0 0 18px' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden' }}>
            <img loading="lazy" decoding="async" src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: IMG_W + 1, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{ position: 'relative', width: '100%', minHeight: 90 }}>
            <p style={{ color: '#0A1628', fontWeight: 600, fontSize: 20, lineHeight: 1.35, margin: 0, textAlign: 'center', opacity: hovered ? 0 : 1, transform: hovered ? 'translateY(-8px)' : 'translateY(0)', transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
              {card.title}
            </p>
            <p style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: hovered ? 'translateY(-50%)' : 'translateY(-42%)', color: '#0A1628', fontWeight: 500, fontSize: 14, lineHeight: 1.6, margin: 0, textAlign: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease, transform 0.3s ease' }}>
              {card.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
