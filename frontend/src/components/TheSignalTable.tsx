import React, { useState } from 'react';
import { Issue } from './HeroContent';

interface TheSignalTableProps {
  issues: Issue[];
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

export function TheSignalTable({ issues }: TheSignalTableProps) {
  const [sortKey, setSortKey] = useState<keyof Issue>('count');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: keyof Issue, type: 'string' | 'number') => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(type === 'string' ? 'asc' : 'desc');
    }
  };

  const sorted = [...issues].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === 'string' && typeof vb === 'string') {
      return sortDir === 'asc'
        ? va.localeCompare(vb)
        : vb.localeCompare(va);
    }
    if (typeof va === 'boolean' && typeof vb === 'boolean') {
      const na = va ? 1 : 0;
      const nb = vb ? 1 : 0;
      return sortDir === 'asc' ? na - nb : nb - na;
    }
    return sortDir === 'asc'
      ? (va as number) - (vb as number)
      : (vb as number) - (va as number);
  });

  const renderSortArrow = (key: keyof Issue) => {
    if (sortKey !== key) return <span className="sort-arrow" />;
    return (
      <span className="sort-arrow inline-block ml-1 text-[var(--accent-signal)] font-bold">
        {sortDir === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="table-wrap">
      <table className="data-table" id="signal-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('tag', 'string')}>
              Issue{renderSortArrow('tag')}
            </th>
            <th
              className="col-num"
              onClick={() => handleSort('count', 'number')}
            >
              Count{renderSortArrow('count')}
            </th>
            <th
              className="col-num"
              onClick={() => handleSort('pct', 'number')}
            >
              % of Reviews{renderSortArrow('pct')}
            </th>
            <th
              className="col-num"
              onClick={() => handleSort('avg_rating', 'number')}
            >
              Avg Rating{renderSortArrow('avg_rating')}
            </th>
            <th
              className="col-num"
              onClick={() => handleSort('ltv_at_risk', 'number')}
            >
              LTV at Risk{renderSortArrow('ltv_at_risk')}
            </th>
            <th
              className="col-status"
              onClick={() => handleSort('systemic', 'number')}
            >
              Status{renderSortArrow('systemic')}
            </th>
          </tr>
        </thead>
        <tbody id="signal-tbody">
          {sorted.map((issue) => {
            const isSystemic = issue.systemic;
            return (
              <tr
                key={issue.tag}
                className={isSystemic ? 'row-systemic' : 'row-normal'}
              >
                <td>
                  <div className="col-tag">
                    {isSystemic && <span className="dot-badge" />}
                    <span className="tag-name">{formatTag(issue.tag)}</span>
                  </div>
                </td>
                <td className="col-num">{issue.count.toLocaleString('en-US')}</td>
                <td className="col-num">{issue.pct.toFixed(2)}%</td>
                <td className="col-num">{issue.avg_rating.toFixed(2)}</td>
                <td className="col-num">{formatCurrency(issue.ltv_at_risk)}</td>
                <td className="col-status">
                  {isSystemic ? (
                    <span className="badge badge-systemic">Systemic</span>
                  ) : (
                    <span className="badge badge-normal">Normal</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
