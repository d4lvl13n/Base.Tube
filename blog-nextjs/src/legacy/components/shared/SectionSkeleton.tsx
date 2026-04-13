export default function SectionSkeleton({ height = '100vh' }: { height?: string }) {
  return (
    <div 
      className="section-skeleton"
      style={{ height }}
    >
      <div className="skeleton-content">
        <div className="skeleton-pulse skeleton-title"></div>
        <div className="skeleton-pulse skeleton-subtitle"></div>
        <div className="skeleton-grid">
          <div className="skeleton-pulse skeleton-card"></div>
          <div className="skeleton-pulse skeleton-card"></div>
          <div className="skeleton-pulse skeleton-card"></div>
        </div>
      </div>
    </div>
  );
} 