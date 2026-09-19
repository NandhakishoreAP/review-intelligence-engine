import React from 'react';
import { TiltCard } from './velora/tilt-card';

export default function SignalPipeline() {
  return (
    <div className="signal-pipeline-wrapper">
      <div className="signal-pipeline">
        {/* Node 1: Raw Reviews */}
        <TiltCard maxTilt={14} className="relative flex flex-col items-center cursor-pointer">
          <div className="pipe-node small">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="8" ry="3" />
              <path d="M4 5v6a8 3 0 0 0 16 0V5" />
              <path d="M4 11v6a8 3 0 0 0 16 0v-6" />
            </svg>
          </div>
          <span className="pipe-label">5,000 Reviews</span>
        </TiltCard>

        {/* Connector Line 1 with Flowing Dot */}
        <div className="pipe-line">
          <div
            className="flowing-dot"
            style={{ animation: 'flow 2.4s linear infinite' }}
          />
        </div>

        {/* Node 2: Filter */}
        <TiltCard maxTilt={14} className="relative flex flex-col items-center cursor-pointer">
          <div className="pipe-node large">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
          <span className="pipe-label">Freq &gt;5% &amp; Rating &lt;2.5</span>
        </TiltCard>

        {/* Connector Line 2 with Flowing Dot */}
        <div className="pipe-line">
          <div
            className="flowing-dot"
            style={{ animation: 'flow 2.4s linear infinite', animationDelay: '1.2s' }}
          />
        </div>

        {/* Node 3: Systemic Signal */}
        <TiltCard maxTilt={14} className="relative flex flex-col items-center cursor-pointer">
          <div className="pipe-node small">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <span className="pipe-label signal-label">8 Systemic Issues</span>
        </TiltCard>
      </div>
    </div>
  );
}
