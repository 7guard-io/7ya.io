export type NavigationItem = {
  label: string;
  href: string;
  group: 'primary' | 'secondary';
  status?: 'active' | 'pending';
};

export const navigationItems: NavigationItem[] = [
  { label: 'Command', href: '/', group: 'primary', status: 'active' },
  { label: 'Evidence', href: '/evidence/', group: 'primary', status: 'active' },
  { label: 'Influence', href: '/influence/', group: 'primary', status: 'pending' },
  { label: 'StartOn', href: '/starton/', group: 'primary', status: 'active' },
  { label: 'Business', href: '/business/', group: 'secondary', status: 'pending' },
  { label: 'Journey', href: '/journey/', group: 'secondary', status: 'pending' },
  { label: 'About', href: '/about/', group: 'secondary', status: 'pending' },
  { label: 'Contact', href: '/contact/', group: 'secondary', status: 'active' },
];

export const layoutStatus = {
  label: 'System nominal',
  detail: 'Static shell · no backend required',
};
