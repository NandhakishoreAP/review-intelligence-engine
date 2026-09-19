import React, { useEffect, useState } from 'react';
import { AppNavbar } from './components/AppNavbar';
import { RetroGrid } from './components/velora/retro-grid';
import { LightRays } from './components/velora/light-rays';
import HeroContent, { Issue } from './components/HeroContent';
import { TheSignalTable } from './components/TheSignalTable';
import { SystemicGrid } from './components/SystemicGrid';
import { CustomerEvidence, Review } from './components/CustomerEvidence';
import { IssueModal } from './components/IssueModal';

interface SummaryData {
  total_ltv_at_risk: number;
  total_reviews: number;
  affected_reviews: number;
  issues: Issue[];
  sample_reviews: Record<string, Review[]>;
}

export default function App() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/summary.json')
      .then((res) => res.json())
      .then((d: SummaryData) => setData(d))
      .catch(console.error);
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  const handleOpenModal = (tag: string) => {
    setSelectedTag(tag);
    setIsModalOpen(true);
    document.body.classList.add('modal-open');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTag(null);
    document.body.classList.remove('modal-open');
  };

  const issues = data?.issues || [];
  const sampleReviews = data?.sample_reviews || {};
  const selectedIssue = issues.find((i) => i.tag === selectedTag) || null;
  const selectedReviews = selectedTag ? sampleReviews[selectedTag] || [] : [];

  return (
    <>
      <AppNavbar />

      <main id="app">
        {/* Hero Section */}
        <section className="hero reveal relative overflow-hidden" id="overview">
          <RetroGrid className="-z-10" />
          <LightRays className="-z-10" />
          <HeroContent issues={issues} totalLtv={data?.total_ltv_at_risk} />
        </section>

        {/* The Signal: sortable issue table */}
        <section className="section reveal" id="signal">
          <div className="section-inner">
            <h2 className="section-title">The Signal</h2>
            <p className="section-desc">
              All detected issue tags across 5,000 reviews, ranked by frequency.
            </p>
            <TheSignalTable issues={issues} />
          </div>
        </section>

        {/* Systemic Issues: card grid */}
        <section className="section reveal" id="systemic">
          <div className="section-inner">
            <h2 className="section-title">Systemic Issues</h2>
            <p className="section-desc">
              Issues affecting &gt;5% of reviews with average rating below 2.5 — sized by LTV exposure.
            </p>
            <SystemicGrid issues={issues} onSelectIssue={handleOpenModal} />
          </div>
        </section>

        {/* Customer Evidence */}
        <section className="section reveal" id="evidence">
          <div className="section-inner">
            <h2 className="section-title">Customer Evidence</h2>
            <p className="section-desc">
              Direct review excerpts citing systemic issues across 5,000 customer feedback records.
            </p>
            <CustomerEvidence issues={issues} sampleReviews={sampleReviews} />
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      <IssueModal
        issue={selectedIssue}
        sampleReviews={selectedReviews}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
