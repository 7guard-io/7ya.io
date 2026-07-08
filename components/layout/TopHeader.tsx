export function TopHeader({ label = 'Command' }: { label?: string }) {
  return <header className="top-header"><div><div className="top-meta">Current page</div><div className="top-title">{label}</div></div><div className="command-placeholder" role="search" aria-label="Command search placeholder">Search / command pending</div><div className="identity"><span className="status-dot" aria-hidden="true" />7YA OS</div></header>;
}
