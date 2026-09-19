<div align="center">

# Review Intelligence Engine

### Turning 5,000 raw customer reviews into a single, defensible number.

[![Live Site](https://img.shields.io/badge/Live-review--intelligence--engine-black?style=for-the-badge)](https://review-intelligence-engine-six.vercel.app)
[![Built with Vite](https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3-blue?style=for-the-badge&logo=python)](https://www.python.org)

![Typing SVG](https://readme-typing-svg.demolab.com?font=Space+Grotesk&size=22&pause=1000&color=FF5A36&center=true&vCenter=true&width=600&lines=Some+complaints+are+noise.;Some+are+signal.;This+finds+which+is+which.)

</div>

---

## What this is

A data pipeline and dashboard that takes 5,000 customer reviews across 18
products and answers one question with a specific rupee figure: **which
customer complaints are actually costing the business money, and how much.**

Not every bad review matters. A single customer having a rough delivery
experience is noise — it happens, it's not a pattern, and reacting to it
wastes attention. But when hundreds of customers independently flag the same
kind of failure, and their ratings collapse when they do, that's a structural
problem in the product or the operation, not bad luck. This project draws
that line mathematically instead of by gut feeling, and then prices it using
the metric that actually matters for retention: **customer lifetime value**,
not the value of the one order that triggered the complaint.

<div align="center">

### The answer this project produces

## ₹22,317,621.17

**total customer LTV sitting at risk across 8 systemic issues**

</div>

---

## Why this was built

This project was built as a submission for the **Mosaic Fellowship Builder
Challenge** — an application process structured around picking a real
business problem statement, downloading a dataset intentionally too large to
paste into any LLM's context window, and being required to actually *write
and run code* to arrive at a verified numerical answer rather than guessing
one out of a chat window.

The rules of that challenge shaped every decision in this repo:

- The dataset (5,000 reviews, 2.5MB) had to be processed programmatically —
  no manual reading, no synthetic substitute data.
- AI tools were explicitly permitted and encouraged for writing the code, but
  not permitted to *be* the code — the dataset could not simply be pasted
  into a chat and asked for the answer.
- The final answer had to be a specific, verifiable number, checked
  programmatically against an answer key.
- The submission is judged on the correctness of that number, on code
  quality, on system design, and on product thinking — not just on getting
  to a plausible-looking dashboard.

Everything below reflects building toward those four judging criteria
directly, rather than treating the dashboard as the deliverable and the
analysis as an afterthought.

---

## How the answer is calculated

An issue tag is classified as **systemic** only when both of these hold
across the full 5,000-review dataset — not just the negative subset:
frequency > 5% of all reviews
avg_rating < 2.5 stars, for reviews carrying that tag

Frequency alone isn't proof of a real problem — plenty of common complaints
are still just noise. Low ratings alone aren't proof either — a rare but
severe issue can average a bad score without being structural. Requiring
both at once is what separates a systemic failure from a loud minority.

Once the systemic tags are identified, the exposure figure is the sum of
`customer_ltv` across every review touching **at least one** systemic issue
— deduplicated, so a review flagged for two systemic issues at once is only
counted a single time. LTV, not order value, is deliberately the unit of
risk: a customer who has spent ₹15,000 over time and hits a systemic issue
represents a much larger loss than a ₹500 first-time buyer having the same
experience.

```bash
cd frontend/scripts
python3 analyze.py            # prints the full breakdown to the terminal
python3 generate_summary.py   # writes summary.json to frontend/public/, consumed by the dashboard
```

<details>
<summary><strong>Full systemic issues table</strong></summary>

| Issue              | Count | % of Reviews | Avg Rating | LTV at Risk    |
|---------------------|:-----:|:-------------:|:----------:|---------------:|
| Customer Service     | 586   | 11.72%        | 1.63       | ₹56,56,808.86  |
| No Results           | 564   | 11.28%        | 1.59       | ₹51,37,360.58  |
| Packaging Damage     | 563   | 11.26%        | 1.65       | ₹52,07,430.35  |
| Product Quality      | 562   | 11.24%        | 1.64       | ₹49,35,044.58  |
| Wrong Product        | 560   | 11.20%        | 1.63       | ₹52,03,308.74  |
| Delivery Delay       | 558   | 11.16%        | 1.61       | ₹49,72,332.70  |
| Pricing Concern      | 554   | 11.08%        | 1.65       | ₹52,01,254.37  |
| Side Effects         | 551   | 11.02%        | 1.65       | ₹50,87,039.80  |

**2,444 unique reviews** (of 5,000) mention at least one systemic issue.

</details>

---

## What the dashboard shows

- The headline exposure number, with a live breakdown of how it's composed
- A sortable table of every issue tag detected — systemic and non-systemic
  side by side, so the threshold logic is visible, not just its conclusion
- A ranked card view of the 8 systemic issues, sized by financial exposure
- Real customer review excerpts pulled directly from the dataset per issue,
  so the numbers stay tied to what customers actually said
- A visual walk-through of the two-threshold filter itself: raw reviews in,
  frequency and rating filters applied, systemic signal out

---

## What the data actually shows

All eight detected issue tags cleared both thresholds — there is no single
outlier problem here. Each appears in roughly 11% of all reviews with
average ratings clustered tightly between 1.59 and 1.65. That pattern itself
is informative: this isn't one broken product line dragging the average
down, it's a **consistent quality floor problem** spanning fulfillment
(wrong product, packaging damage), support (customer service, no results),
and the product itself (quality, side effects) all at once.

`customer_service` carries the single largest LTV exposure of any tag,
narrowly ahead of `packaging_damage` and `wrong_product` — meaning support
and fulfillment failures are landing disproportionately on higher-value,
repeat customers rather than one-time buyers.

### Recommendations for the CX team

1. **Fix fulfillment quality control first.** `wrong_product` and
   `packaging_damage` together represent over ₹1 crore in exposure and are
   the most mechanically tractable — a pre-ship verification step and better
   packing materials directly address both.
2. **Audit what customer service agents are actually resolving, not just how
   fast they respond.** This is the highest single-issue exposure, and the
   review language ("waste of money") points at failure to resolve, not
   slow response times.
3. **Route `side_effects` reviews to a product safety review separately from
   the rest.** It carries real legal and brand-trust risk beyond lost
   revenue, and deserves its own triage path even though its LTV exposure is
   the smallest of the eight.

---

## Project structure
review-intelligence/
└── frontend/
    ├── scripts/
    │   ├── analyze.py            # core analysis logic, prints results
    │   ├── generate_summary.py   # writes summary.json for the dashboard
    │   ├── cx_reviews.json       # the provided dataset
    │   └── summary.json          # generated output (mirrored into public/)
    ├── public/
    │   └── summary.json          # runtime copy fetched by the dashboard
    ├── src/                       # React + TypeScript dashboard
    └── vercel.json                # static deployment config

## Running locally

```bash
git clone https://github.com/NandhakishoreAP/review-intelligence-engine.git
cd review-intelligence-engine/frontend
npm install
npm run dev
```

<div align="center">

Built for the Mosaic Fellowship Builder Challenge — Customer Experience track.

</div>
