#!/usr/bin/env python3
"""
Generate summary.json for frontend consumption.
"""
import json
from collections import defaultdict
from typing import Dict, List


def load_reviews(filepath: str = "cx_reviews.json") -> List[Dict]:
    """Load reviews from JSON file."""
    with open(filepath, 'r') as f:
        return json.load(f)


def analyze_and_generate_summary(reviews: List[Dict], output_path: str = "summary.json"):
    """
    Analyze reviews and generate summary.json with all required data.
    """
    total_reviews = len(reviews)

    # Collect stats per tag
    tag_stats = defaultdict(lambda: {
        'count': 0,
        'ratings': [],
        'ltv': 0.0,
        'review_ids': set(),
        'sample_reviews': []
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

            # Collect sample reviews (up to 5 per tag)
            if len(tag_stats[tag]['sample_reviews']) < 5:
                tag_stats[tag]['sample_reviews'].append({
                    'review_text': review.get('review_text', ''),
                    'rating': rating,
                    'product': review.get('product', 'Unknown')
                })

    # Calculate derived metrics
    issues = []
    systemic_tags = set()

    for tag, stats in tag_stats.items():
        count = stats['count']
        pct = (count / total_reviews) * 100
        avg_rating = sum(stats['ratings']) / len(stats['ratings']) if stats['ratings'] else 0
        ltv_at_risk = stats['ltv']

        is_systemic = pct > 5 and avg_rating < 2.5

        if is_systemic:
            systemic_tags.add(tag)

        issues.append({
            'tag': tag,
            'count': count,
            'pct': round(pct, 2),
            'avg_rating': round(avg_rating, 2),
            'ltv_at_risk': round(ltv_at_risk, 2),
            'systemic': is_systemic
        })

    # Sort by count descending
    issues.sort(key=lambda x: x['count'], reverse=True)

    # Calculate deduplicated LTV at risk for systemic issues
    affected_review_ids = set()
    for review in reviews:
        tags = set(review.get('detected_issues', []))
        if tags & systemic_tags:
            affected_review_ids.add(review.get('review_id', id(review)))

    total_ltv_at_risk = sum(
        review.get('customer_ltv', 0.0)
        for review in reviews
        if review.get('review_id', id(review)) in affected_review_ids
    )

    # Build sample_reviews dict
    sample_reviews = {}
    for tag, stats in tag_stats.items():
        sample_reviews[tag] = stats['sample_reviews']

    # Build final summary object
    summary = {
        'total_ltv_at_risk': round(total_ltv_at_risk, 2),
        'total_reviews': total_reviews,
        'affected_reviews': len(affected_review_ids),
        'issues': issues,
        'sample_reviews': sample_reviews
    }

    # Write to file
    with open(output_path, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"✓ Generated {output_path}")
    print(f"  Total LTV at Risk: ₹{total_ltv_at_risk:,.2f}")
    print(f"  Affected Reviews: {len(affected_review_ids):,} / {total_reviews:,}")
    print(f"  Issues Tracked: {len(issues)}")
    print(f"  Systemic Issues: {len(systemic_tags)}")


def main():
    reviews = load_reviews()
    analyze_and_generate_summary(reviews)


if __name__ == "__main__":
    main()
