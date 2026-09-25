import React from 'react';

export function SkeletonBox({ height = 120, width = '100%', borderRadius = '14px' }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear',
      }}
    />
  );
}

export default function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Hero Card Skeleton */}
      <SkeletonBox height={200} borderRadius="28px" />

      {/* Grid Skeleton */}
      <div className="dashboard-grid">
        <div className="col-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <SkeletonBox height={110} />
          <SkeletonBox height={110} />
          <SkeletonBox height={110} />
          <SkeletonBox height={110} />
          <SkeletonBox height={110} />
          <SkeletonBox height={110} />
        </div>

        <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SkeletonBox height={150} />
          <SkeletonBox height={150} />
        </div>

        <div className="col-8">
          <SkeletonBox height={260} />
        </div>

        <div className="col-4">
          <SkeletonBox height={260} />
        </div>
      </div>
    </div>
  );
}
