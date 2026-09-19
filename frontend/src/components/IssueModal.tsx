import React from 'react';
import { Issue } from './HeroContent';
import { Review } from './CustomerEvidence';

interface IssueModalProps {
  issue: Issue | null;
  sampleReviews: Review[];
  isOpen: boolean;
  onClose: () => void;
}

function formatTag(tag: string) {
  return tag.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCurrency(value: number) {
  return (
    '₹' +
    value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function IssueModal({ issue, sampleReviews, isOpen, onClose }: IssueModalProps) {
  if (!isOpen || !issue) return null;

  return (
    <div className={`modal ${isOpen ? 'is-open' : ''}`} id="issue-modal" aria-hidden={!isOpen}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div>
            <div className="modal-tag-badge">
              <span className="badge badge-systemic">Systemic Risk</span>
            </div>
            <h3 className="modal-title" id="modal-title">
              {formatTag(issue.tag)}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close panel">
            <span>ESC</span> &times;
          </button>
        </div>

        <div className="modal-content" id="modal-content">
          <div className="modal-metrics-grid">
            <div className="modal-metric-box">
              <span className="modal-metric-lbl">Total Reviews</span>
              <span className="modal-metric-val">{issue.count.toLocaleString('en-US')}</span>
            </div>
            <div className="modal-metric-box">
              <span className="modal-metric-lbl">Frequency</span>
              <span className="modal-metric-val">{issue.pct.toFixed(2)}%</span>
            </div>
            <div className="modal-metric-box">
              <span className="modal-metric-lbl">Avg Rating</span>
              <span className="modal-metric-val">{issue.avg_rating.toFixed(2)} / 5.0</span>
            </div>
            <div className="modal-metric-box">
              <span className="modal-metric-lbl">LTV at Risk</span>
              <span className="modal-metric-val signal">{formatCurrency(issue.ltv_at_risk)}</span>
            </div>
          </div>

          <div className="modal-qualification">
            <div className="modal-qual-title">Systemic Risk Qualification</div>
            <ul className="modal-qual-list">
              <li>Frequency: {issue.pct.toFixed(2)}% (Threshold: &gt; 5.0%)</li>
              <li>Average Rating: {issue.avg_rating.toFixed(2)} (Threshold: &lt; 2.50)</li>
            </ul>
          </div>

          <div className="modal-quotes-section">
            <h4>Customer Review Excerpts (Sample of 3)</h4>
            <div className="modal-quotes-list">
              {sampleReviews.slice(0, 3).map((r, idx) => {
                const isRisk = r.rating <= 2;
                return (
                  <div key={idx} className="modal-quote-item">
                    <p className="quote-text font-sans italic text-[14px] text-[var(--text-primary)] mb-1.5">
                      "{r.review_text.trim()}"
                    </p>
                    <div className="quote-meta flex items-center justify-between gap-2 pt-0">
                      <span className="quote-product font-mono text-[11px] uppercase text-[var(--text-secondary)]">
                        {r.product}
                      </span>
                      <span
                        className={`quote-rating font-mono text-[12px] ${
                          isRisk ? 'text-[var(--accent-signal)]' : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        ★ {r.rating}.0
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
