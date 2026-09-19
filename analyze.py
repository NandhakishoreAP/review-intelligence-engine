#!/usr/bin/env python3
"""
Analyze customer reviews and identify systemic issues.
"""
import json
from collections import defaultdict
from typing import Dict, List, Set


def load_reviews(filepath: str = "cx_reviews.json") -> List[Dict]:
    """Load reviews from JSON file."""
    with open(filepath, 'r') as f:
        return json.load(f)


def analyze_issues(reviews: List[Dict]) -> Dict:
    """
    Analyze detected_issues tags across all reviews.

    Returns dict with per-tag stats and systemic issue identification.
    """
    total_reviews = len(reviews)

    # Collect stats per tag
    tag_stats = defaultdict(lambda: {
        'count': 0,
        'ratings': [],
        'ltv': 0.0,
        'review_ids': set()
    })

    for review in reviews:
        review_id = review.get('review_id', id(review))
        rating = review.get('rating', 0)
        ltv = review.get('customer_ltv', 0.0)

        for tag in review.get('detected_issues', []):
            tag_stats[tag]['count'] += 1
            tag_stats[tag]['ratings'].append(rating)
            tag_stats[tag]['ltv'] += ltv
            tag_stats[tag]['review_ids'].add(review_id)

    # Calculate derived metrics
    issue_summary = []
    systemic_tags = set()

    for tag, stats in tag_stats.items():
        count = stats['count']
        pct = (count / total_reviews) * 100
        avg_rating = sum(stats['ratings']) / len(stats['ratings']) if stats['ratings'] else 0
        ltv_at_risk = stats['ltv']

        is_systemic = pct > 5 and avg_rating < 2.5

        if is_systemic:
            systemic_tags.add(tag)

        issue_summary.append({
            'tag': tag,
            'count': count,
            'pct': pct,
            'avg_rating': avg_rating,
            'ltv_at_risk': ltv_at_risk,
            'systemic': is_systemic
        })

    # Sort by count descending
    issue_summary.sort(key=lambda x: x['count'], reverse=True)

    # Calculate deduplicated LTV at risk for systemic issues
    affected_review_ids = set()
    for review in reviews:
        tags = set(review.get('detected_issues', []))
        if tags & systemic_tags:  # Intersection: has at least one systemic tag
            affected_review_ids.add(review.get('review_id', id(review)))

    total_ltv_at_risk = sum(
        review.get('customer_ltv', 0.0)
        for review in reviews
        if review.get('review_id', id(review)) in affected_review_ids
    )

    return {
        'issue_summary': issue_summary,
        'total_ltv_at_risk': total_ltv_at_risk,
        'affected_reviews': len(affected_review_ids),
        'systemic_tags': systemic_tags
    }


def print_summary(analysis: Dict, total_reviews: int):
    """Print a clean summary table."""
    print("\n" + "="*100)
    print("REVIEW INTELLIGENCE ANALYSIS")
    print("="*100)
    print(f"\nTotal Reviews: {total_reviews:,}")
    print(f"Reviews Affected by Systemic Issues: {analysis['affected_reviews']:,}")
    print(f"\n{'Issue Tag':<40} {'Count':<8} {'%':<8} {'Avg Rating':<12} {'LTV Impact':<15} {'Systemic'}")
    print("-"*100)

    for issue in analysis['issue_summary']:
        systemic_marker = "⚠ YES" if issue['systemic'] else ""
        print(f"{issue['tag']:<40} {issue['count']:<8} {issue['pct']:<8.2f} "
              f"{issue['avg_rating']:<12.2f} ₹{issue['ltv_at_risk']:<14,.2f} {systemic_marker}")

    print("-"*100)
    print(f"\n💰 TOTAL LTV AT RISK (Systemic Issues): ₹{analysis['total_ltv_at_risk']:,.2f}")
    print("="*100 + "\n")


def main():
    reviews = load_reviews()
    analysis = analyze_issues(reviews)
    print_summary(analysis, len(reviews))


if __name__ == "__main__":
    main()
