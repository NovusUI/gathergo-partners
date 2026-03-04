import React from 'react';
import { COLOR } from '../constants';

export default function SdgTile({ sdg }) {
  return (
    <div style={{ width: sdg.size, height: sdg.size, borderRadius: 10, background: 'transparent', border: `1.5px solid ${COLOR}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `rotate(${sdg.rotate}deg)` }}>
      <span style={{ fontSize: sdg.size * 0.38, filter: 'grayscale(1) brightness(10)' }}>{sdg.symbol}</span>
      <span style={{ fontSize: sdg.size * 0.14, fontWeight: 800, color: COLOR }}>{sdg.n < 10 ? `0${sdg.n}` : sdg.n}</span>
    </div>
  );
}
