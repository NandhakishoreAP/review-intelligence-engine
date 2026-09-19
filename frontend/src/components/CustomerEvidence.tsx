import React, { useState } from 'react';
import { SpotlightCard } from './velora/spotlight-card';
import { Issue } from './HeroContent';

export interface Review {
  review_text: string;
  rating: number;
  product: string;
  tag?: string;
}

interface CustomerEvidenceProps {
  issues: Issue[];
  sampleReviews: Record<string, Review[]>;
}

function formatTag(tag: string) {
  return tag.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CustomerEvidence({ issues, sampleReviews }: CustomerEvidenceProps) {
  const systemicIssues = issues.filter((i) => i.systemic);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filters = [
    { label: 'All Systemic Issues', tag: 'ALL' },
    ...systemicIssues.map((i) => ({ label: formatTag(i.tag), tag: i.tag })),
  ];

  let reviewsToRender: Review[] = [];
  if (activeFilter === 'ALL') {
    for (const [tag, reviews] of Object.entries(sampleReviews)) {
      reviews.slice(0, 4).forEach((r) => {
        reviewsToRender.push({ ...r, tag });
      });
    }
  } else {
    const reviews = sampleReviews[activeFilter] || [];
    reviews.forEach((r) => {
      reviewsToRender.push({ ...r, tag: activeFilter });
    });
  }

  return (
    <>
      <div className="evidence-filters" id="evidence-filters">
        {filters.map((f) => (
          <button
            key={f.tag}
            type="button"
            className={`filter-btn ${f.tag === activeFilter ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.tag)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="evidence-grid" id="evidence-grid">
        {reviewsToRender.map((r, idx) => {
          const isRisk = r.rating <= 2;
          return (
            <SpotlightCard
              key={`${r.tag || ''}-${idx}`}
              color="color-mix(in oklab, var(--brand-from) 20%, transparent)"
              radius={280}
              className="quote-card border-[var(--border)] border-l-[3px] border-l-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,white_4%)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_4px_16px_rgba(0,0,0,0.2)] rounded-xl p-6 flex flex-col justify-between min-h-[180px] h-full gap-3 transition-all duration-150 hover:border-l-[var(--brand-from)] hover:-translate-y-0.5"
            >
              <p className="quote-text font-sans italic text-[15px] leading-relaxed text-[var(--text-primary)] line-clamp-4 m-0">
                "{r.review_text.trim()}"
              </p>
              <div className="quote-meta flex items-center justify-between gap-2 pt-2 border-t border-[var(--border)]/40">
                <span className="quote-product font-mono text-[11px] font-medium uppercase text-[var(--text-secondary)] tracking-wider truncate">
                  {r.product}
                </span>
                <span
                  className={`quote-rating font-mono text-[12px] font-medium whitespace-nowrap ${
                    isRisk ? 'text-[var(--accent-signal)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  ★ {r.rating}.0
                </span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </>
  );
}
