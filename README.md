# Review Intelligence // CX Division

An enterprise customer experience intelligence platform that analyzes 5,000 customer reviews, isolates systemic customer complaints, and quantifies total customer lifetime value (LTV) exposure.

## Key Metrics
- **Total Reviews Analyzed**: 5,000
- **Systemic Issues Identified**: 8 (>5% frequency and <2.5 avg rating)
- **Total LTV at Risk**: ₹22,317,621.17 (deduplicated across affected customers)

## Tech Stack & Architecture
- **Analysis Engine**: Python 3 (`analyze.py`, `generate_summary.py`)
- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling & Design System**: Tailwind CSS v4 CSS-First Architecture (`@tailwindcss/vite`, `@import "tailwindcss"`, `@theme`)
- **Motion & Physics**: `motion/react` spring physics, cursor spotlight tracking, 3D tilt cards, and directional scroll navbar

## Quickstart

### 1. Run Python Analysis & Data Generation
```bash
python3 analyze.py
python3 generate_summary.py
```

### 2. Run Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

### 3. Production Build
```bash
cd frontend
npm run build
```
Build output is generated in `frontend/dist/`.
