import { AuthorityPage } from '@/components/AuthorityPage';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('he', 'igor-vepretski');

export default function Page() {
  return <AuthorityPage locale="he" slug="igor-vepretski" />;
}
