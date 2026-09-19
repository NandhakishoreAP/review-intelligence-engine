import React, { useEffect, useState } from 'react';
import { BlurFade } from './velora/blur-fade';
import { TextReveal } from './velora/text-reveal';
import SignalPipeline from './SignalPipeline';

export interface Issue {
  tag: string;
  count: number;
  pct: number;
  avg_rating: number;
  ltv_at_risk: number;
  systemic: boolean;
}

interface HeroContentProps {
  issues?: Issue[];
  totalLtv?: number;
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

export default function HeroContent({ issues: initialIssues, totalLtv: initialTotalLtv }: HeroContentProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues || []);
  const [totalLtv, setTotalLtv] = useState<number | null>(initialTotalLtv ?? null);
  const [animatedLtv, setAnimatedLtv] = useState<number>(0);

  useEffect(() => {
    if (initialIssues && initialIssues.length > 0) {
      setIssues(initialIssues);
    }
    if (initialTotalLtv != null) {
      setTotalLtv(initialTotalLtv);
    }
  }, [initialIssues, initialTotalLtv]);

  useEffect(() => {
    if (issues.length === 0) {
      fetch('/summary.json')
        .then((res) => res.json())
        .then((data) => {
          if (data.issues) setIssues(data.issues);
          if (data.total_ltv_at_risk != null) setTotalLtv(data.total_ltv_at_risk);
        })
        .catch(console.error);
    }
  }, [issues.length]);

  // Animate total LTV counting up
  useEffect(() => {
    if (totalLtv == null) return;
    const duration = 1200;
    const start = 0;
    const end = totalLtv;
    const startTime = performance.now();

    function easeOutCubic(x: number) {
      return 1 - Math.pow(1 - x, 3);
    }

    let frameId: number;
    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = start + (end - start) * easeOutCubic(progress);
      setAnimatedLtv(val);
      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      } else {
        setAnimatedLtv(end);
      }
    }
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [totalLtv]);

  const maxLtv = issues.length > 0 ? Math.max(...issues.map((i) => i.ltv_at_risk)) : 1;

  return (
    <div className="hero-content-wrapper max-w-[1100px] mx-auto w-full px-10 box-border">
      {/* a. Label */}
      <BlurFade delay={0.1}>
        <div className="mb-12">
          <p className="hero-label m-0">REVIEW INTELLIGENCE // CX DIVISION</p>
        </div>
      </BlurFade>

      {/* b. Heading with TextReveal */}
      <BlurFade delay={0.2}>
        <div className="mb-12">
          <TextReveal
            text="Some complaints are noise. Some are signal."
            highlightWord="signal."
            as="h1"
            className="hero-heading m-0"
          />
        </div>
      </BlurFade>

      {/* c. Subtext */}
      <BlurFade delay={0.3}>
        <div className="mb-12">
          <p className="hero-sub m-0 max-w-[620px]">
            5,000 customer reviews. We found which complaints are costing you the most — and exactly how much.
          </p>
        </div>
      </BlurFade>

      {/* d. Two-column row at desktop (1fr 1fr, gap 40px) */}
      <BlurFade delay={0.4}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12 w-full">
          {/* LEFT: LTV EXPOSURE BY ISSUE Bar Chart */}
          <div className="flex flex-col justify-between w-full">
            <div className="hero-bars-label mb-3">LTV EXPOSURE BY ISSUE</div>
            <div className="flex items-end gap-2 h-32 w-full p-3 rounded-lg bg-[color-mix(in_oklab,var(--card)_85%,white_4%)] border border-[var(--border)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
              {issues.map((issue) => (
                <div
                  key={issue.tag}
                  className="flex flex-col items-center gap-2 flex-1 h-full justify-end group relative cursor-pointer"
                >
                  <div
                    className="w-full rounded-t transition-all group-hover:opacity-85"
                    style={{
                      height: `${Math.max(8, (issue.ltv_at_risk / maxLtv) * 100)}%`,
                      background: issue.systemic ? 'var(--brand-from)' : 'var(--border)',
                    }}
                  />
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[var(--background)] border border-[var(--border)] text-[var(--text)] font-mono text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                    {formatTag(issue.tag)}: {formatCurrency(issue.ltv_at_risk)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Signal Pipeline */}
          <div className="w-full flex justify-center lg:justify-end overflow-visible">
            <SignalPipeline />
          </div>
        </div>
      </BlurFade>

      {/* e. TOTAL LTV AT RISK */}
      <BlurFade delay={0.5}>
        <div className="ltv-block w-full">
          <div className="ltv-label">TOTAL LTV AT RISK</div>
          <div className="ltv-number" id="ltv-value">
            {totalLtv != null ? formatCurrency(animatedLtv) : '—'}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
