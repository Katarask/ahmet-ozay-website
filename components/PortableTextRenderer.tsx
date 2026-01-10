'use client';

import { PortableText, PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity';

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="heading_h2 text-3xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="heading_h3 text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mt-10 mb-5">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="heading_h4 text-xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mt-8 mb-4">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="paragraph text-lg font-serif text-light-text-secondary dark:text-dark-text-secondary leading-relaxed mb-6">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-light-accent-primary dark:border-dark-accent-primary pl-6 py-2 my-8 italic text-light-text-secondary dark:text-dark-text-secondary">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-light-text-primary dark:text-dark-text-primary">
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ children, value }) => {
      const rel = value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined;
      return (
        <a
          href={value?.href}
          rel={rel}
          target={value?.href?.startsWith('http') ? '_blank' : undefined}
          className="text-light-accent-primary dark:text-dark-accent-primary hover:underline"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      
      const imageUrl = urlFor(value.asset).width(1200).height(800).url();
      
      return (
        <figure className="my-10">
          <div className="relative w-full aspect-video rounded-sm overflow-hidden">
            <Image
              src={imageUrl}
              alt={value.alt || 'Artikelbild'}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-light-text-muted dark:text-dark-text-muted text-center mt-3 font-sans">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="font-serif text-lg leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="font-serif text-lg leading-relaxed">{children}</li>
    ),
  },
};

interface PortableTextRendererProps {
  content: any[];
  locale?: string;
}

export default function PortableTextRenderer({ content, locale = 'de' }: PortableTextRendererProps) {
  // Erstelle components mit locale-aware links
  const localeAwareComponents: PortableTextComponents = {
    ...components,
    marks: {
      ...components.marks,
      link: ({ children, value }) => {
        const href = value?.href || '';
        
        // Prüfe ob es ein interner Link ist (relativ oder zu /artikel/)
        const isInternal = !href.startsWith('http') && (
          href.startsWith('/') || 
          href.includes('/artikel/')
        );
        
        // Konvertiere interne Links zu Next.js Links
        if (isInternal) {
          // Stelle sicher, dass der Link die Locale enthält
          let internalHref = href;
          if (!href.startsWith(`/${locale}`)) {
            // Füge Locale hinzu falls nicht vorhanden
            if (href.startsWith('/artikel/')) {
              internalHref = `/${locale}${href}`;
            } else if (href.startsWith('/')) {
              internalHref = `/${locale}${href}`;
            }
          }
          
          return (
            <Link
              href={internalHref}
              className="text-light-accent-primary dark:text-dark-accent-primary hover:underline font-medium"
            >
              {children}
            </Link>
          );
        }
        
        // Externe Links
        return (
          <a
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            className="text-light-accent-primary dark:text-dark-accent-primary hover:underline"
          >
            {children}
          </a>
        );
      },
    },
  };
  
  return <PortableText value={content} components={localeAwareComponents} />;
}

