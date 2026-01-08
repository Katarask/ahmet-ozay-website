import Link from 'next/link';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
  locale: string;
  image?: string;
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
    <article className="group border-b border-light-border-primary dark:border-dark-border-primary pb-8 mb-8">
      <Link href={`/${locale}/artikel/${slug}`} className="block">
        {image && (
          <div className="mb-4 overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-3">
          <span className="eyebrow text-xs uppercase tracking-[0.2em] text-light-text-tertiary dark:text-dark-text-tertiary">
            {category}
          </span>
          <span className="text-light-text-muted dark:text-dark-text-muted text-sm">
            {date}
          </span>
          <span className="text-light-text-muted dark:text-dark-text-muted text-sm">
            {readTime}
          </span>
        </div>
        
        <h3 className="heading_h4 text-xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-2 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4 group-hover:text-light-accent-primary dark:group-hover:text-dark-accent-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-light-text-secondary dark:text-dark-text-secondary font-serif leading-relaxed">
          {excerpt}
        </p>
      </Link>
    </article>
  );
}