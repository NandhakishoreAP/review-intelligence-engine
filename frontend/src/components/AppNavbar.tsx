import React from 'react';
import { FloatingNavbar } from './velora/floating-navbar';

export function AppNavbar() {
  return (
    <FloatingNavbar
      revealAfter={60}
      className="navbar fixed top-0 left-0 right-0 z-50 flex w-full max-w-none items-center justify-between px-10 py-5 rounded-none border-x-0 border-t-0 border-b border-[var(--border)] bg-[#0b0e14]/90 backdrop-blur-md shadow-none mx-0 box-border"
    >
      <a
        href="#overview"
        className="navbar-logo justify-self-start font-mono text-[14px] font-medium text-[var(--text-primary)] tracking-wider hover:opacity-90 transition-opacity"
      >
        REVIEW INTELLIGENCE
      </a>
      <div className="navbar-links flex items-center gap-7">
        <a
          href="#overview"
          className="nav-link font-sans text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Overview
        </a>
        <a
          href="#signal"
          className="nav-link font-sans text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Signals
        </a>
        <a
          href="#systemic"
          className="nav-link font-sans text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Issues
        </a>
        <a
          href="#evidence"
          className="nav-link font-sans text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Evidence
        </a>
      </div>
    </FloatingNavbar>
  );
}
