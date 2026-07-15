import { AuthorityPage } from '@/components/AuthorityPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('he', 'press');

export default function Page() {
  return <AuthorityPage locale="he" slug="press" />;
}
