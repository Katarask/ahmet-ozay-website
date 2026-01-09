import Link from 'next/link';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
  locale: string;
  image?: any;
}

export default function ArticleCard({
  title,
  excerpt,
  date,
  category,
  readTime,
  slug,
  locale,
  image
}: ArticleCardProps) {
  return (
    <article className="group flex flex-col h-full">
      <div className="flex flex-col gap-3 h-full">
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className="px-3 py-1 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary text-xs font-sans rounded-sm">
            {category}
          </span>
          <div className="flex items-center gap-2 text-light-text-muted dark:text-dark-text-muted">
            <span className="font-sans font-medium">{readTime.split(' ')[0]}</span>
            <span className="font-sans">Minuten</span>
          </div>
          <span className="text-light-text-muted dark:text-dark-text-muted font-sans">
            {date}
          </span>
        </div>
        
        <Link href={`/${locale}/artikel/${slug}`} className="group">
          <h3 className="heading_h4 text-xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-3 group-hover:text-light-accent-primary dark:group-hover:text-dark-accent-primary transition-colors border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
            {title}
          </h3>
        </Link>
        
        <p className="text-light-text-secondary dark:text-dark-text-secondary font-serif leading-relaxed flex-grow">
          {excerpt}
        </p>
        
        <Link 
          href={`/${locale}/artikel/${slug}`}
          className="text-light-accent-primary dark:text-dark-accent-primary hover:underline font-sans font-medium text-sm mt-auto"
        >
          Weiterlesen
        </Link>
      </div>
    </article>
  );
}