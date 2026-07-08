import { PageFrame } from './PageFrame';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export function AppShell({ children, currentPath = '/', pageLabel = 'Command' }: { children: unknown; currentPath?: string; pageLabel?: string }) {
  return <div className="app-shell"><Sidebar currentPath={currentPath} /><div className="app-main"><TopHeader label={pageLabel} /><PageFrame title={pageLabel}>{children}</PageFrame></div></div>;
}
