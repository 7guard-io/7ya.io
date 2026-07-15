import { AuthorityPage } from '@/components/AuthorityPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('he', 'starton');

export default function Page() {
  return <AuthorityPage locale="he" slug="starton" />;
}
