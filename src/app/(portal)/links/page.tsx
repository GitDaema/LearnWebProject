import LinkCard from '@/components/cards/LinkCard';
import { externalLinks } from '@/data/mockData';

export default function LinksPage() {
  return (
    <div className="max-w-5xl w-full mx-auto">
      <LinkCard data={externalLinks} />
    </div>
  );
}
