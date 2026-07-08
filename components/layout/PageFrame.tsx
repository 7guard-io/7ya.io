export type PageFrameProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: unknown;
  status?: string;
  children: unknown;
};

export function PageFrame({ children }: PageFrameProps) {
  return <main id="main" className="page-frame">{children}</main>;
}
