import { AuthorityPage } from '@/components/AuthorityPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('he', 'evidence-wall');

export default function Page() {
  return <AuthorityPage locale="he" slug="evidence-wall" />;
}
