import React from 'react';
import { SpotlightCard } from './velora/spotlight-card';
import { Issue } from './HeroContent';

interface SystemicGridProps {
  issues: Issue[];
  onSelectIssue: (tag: string) => void;
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

export function SystemicGrid({ issues, onSelectIssue }: SystemicGridProps) {
  const sorted = [...issues]
    .filter((i) => i.systemic)
    .sort((a, b) => b.ltv_at_risk - a.ltv_at_risk);

  return (
    <div className="card-grid" id="systemic-grid">
      {sorted.map((issue, idx) => {
        const rank = idx + 1;
        return (
          <SpotlightCard
            key={issue.tag}
            data-rank={rank}
            data-tag={issue.tag}
            color="color-mix(in oklab, var(--brand-from) 22%, transparent)"
            radius={320}
            className="card cursor-pointer border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_85%,white_4%)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_4px_16px_rgba(0,0,0,0.2)] rounded-xl p-7 transition-all duration-150 hover:border-[var(--brand-from)] hover:-translate-y-0.5"
            onClick={() => onSelectIssue(issue.tag)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectIssue(issue.tag);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`${formatTag(issue.tag)} detail`}
          >
            <div className="flex flex-col justify-between h-full w-full select-none">
              <div className="card-tag font-mono text-[13px] font-medium tracking-wider uppercase text-[var(--text-secondary)]">
                {formatTag(issue.tag)}
              </div>
              <div
                className={`card-ltv font-display font-bold text-[var(--text-primary)] tracking-tight leading-none my-3 ${
                  rank <= 2 ? 'text-[38px]' : 'text-[28px]'
                }`}
              >
                {formatCurrency(issue.ltv_at_risk)}
              </div>
              <div className="card-stats flex gap-6 font-sans text-[13px] text-[var(--text-secondary)]">
                <div className="card-stat flex items-baseline gap-1.5">
                  <span className="card-stat-label text-[var(--text-secondary)]">Frequency</span>
                  <span className="card-stat-value font-mono font-medium text-[var(--text-primary)]">
                    {issue.pct.toFixed(2)}%
                  </span>
                </div>
                <div className="card-stat flex items-baseline gap-1.5">
                  <span className="card-stat-label text-[var(--text-secondary)]">Avg Rating</span>
                  <span className="card-stat-value font-mono font-medium text-[var(--text-primary)]">
                    {issue.avg_rating.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
}
