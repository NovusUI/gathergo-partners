import React from 'react';
import { COLOR } from '../constants';

const GOGO_FEATURES = [
  {
    title: 'Start with an idea',
    description: 'Tell Gogo what you have in mind. Get help drafting your event, then review the details and make it your own.',
  },
  {
    title: 'Give your impact a voice',
    description: 'Explore suggested global goals and impact paths for your project. You choose what fits your story.',
  },
];

export default function SectionGogo({ isMobile, onExplore }) {
  return (
    <section aria-labelledby="gogo-heading" style={{ background: '#EFFFFC', padding: isMobile ? '72px 24px' : '96px 64px', cursor: 'auto', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? 40 : 72 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#087B6D', fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 16px' }}>Your GatherGo companion</p>
          <h2 id="gogo-heading" style={{ color: '#0A1628', fontWeight: 800, fontSize: isMobile ? 36 : 52, lineHeight: 1.12, margin: '0 0 24px' }}>Meet Gogo.<br />Big ideas start<br />with a little help.</h2>
          <p style={{ color: '#455A58', fontSize: 15, lineHeight: 1.85, maxWidth: 490, margin: '0 0 32px' }}>A friendly face along the way, and an AI guide when you need a hand. Gogo helps you turn an idea into an event and find the impact behind it, one step at a time.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
            {GOGO_FEATURES.map((feature, index) => (
              <div key={feature.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, flexShrink: 0, borderRadius: '50%', background: '#C8F5EC', color: '#087B6D', fontWeight: 700, fontSize: 13 }}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 style={{ color: '#0A1628', fontWeight: 700, fontSize: 17, margin: '2px 0 8px' }}>{feature.title}</h3>
                  <p style={{ color: '#455A58', fontSize: 14, lineHeight: 1.8, margin: 0, maxWidth: 430 }}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={onExplore} style={{ background: '#0A1628', color: '#fff', border: 'none', borderRadius: 50, padding: '15px 28px', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>Explore GatherGo →</button>
        </div>

        <div style={{ flex: 1, minWidth: 0, width: '100%', maxWidth: 440, position: 'relative', borderRadius: 32, background: '#030A31', padding: isMobile ? '32px 24px' : '40px 32px', textAlign: 'center' }}>
          <p style={{ display: 'inline-block', color: COLOR, border: '1px solid rgba(20,217,196,0.3)', borderRadius: 50, padding: '8px 16px', fontSize: 12, fontWeight: 600, margin: 0 }}>A little encouragement goes a long way</p>
          <img loading="lazy" decoding="async" src="/mascot/gogo-wave.svg" alt="Gogo, GatherGo’s mint-coloured companion, waving hello" width="448" height="456" style={{ display: 'block', width: '100%', maxWidth: 330, height: 'auto', margin: '20px auto 0' }} />
          <p style={{ color: '#fff', fontSize: isMobile ? 20 : 23, fontWeight: 700, lineHeight: 1.5, maxWidth: 320, margin: '8px auto 12px' }}>“Got an idea?<br />Let’s bring it together.”</p>
          <p style={{ color: '#B1C8CA', fontSize: 13, lineHeight: 1.8, maxWidth: 300, margin: '0 auto' }}>From the first draft to a moment worth celebrating, you’ll see Gogo along the way.</p>
        </div>
      </div>
    </section>
  );
}
