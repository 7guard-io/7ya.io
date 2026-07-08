import { layoutStatus, navigationItems } from '../../config/navigation';

export function Sidebar({ currentPath = '/' }: { currentPath?: string }) {
  return <aside className="app-sidebar" aria-label="7YA layout navigation">
    <a className="brand-lockup" href="/" lang="en"><span className="brand-mark">7YA.IO</span><span className="brand-subtitle">Public command shell</span></a>
    <nav className="layout-nav" aria-label="Primary">
      {navigationItems.map((item) => item.status === 'pending' ? <span key={item.href} className="nav-link" aria-disabled="true">{item.label}</span> : <a key={item.href} className="nav-link" href={item.href} aria-current={currentPath === item.href ? 'page' : undefined}>{item.label}</a>)}
    </nav>
    <section className="system-status" aria-label="System status"><div className="status-line"><span className="status-dot" />{layoutStatus.label}</div><p className="status-copy">{layoutStatus.detail}</p></section>
  </aside>;
}
