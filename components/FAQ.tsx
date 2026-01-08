'use client';

import { useState, useRef, useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title = 'Häufig gestellte Fragen' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update heights when content changes or item opens
  useEffect(() => {
    const newHeights = contentRefs.current.map((ref) => ref?.scrollHeight || 0);
    setHeights(newHeights);
  }, [openIndex, items]);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-8 border-l-2 border-light-border-accent dark:border-dark-border-accent pl-4">
        {title}
      </h2>
      
      <div className="space-y-0">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div
              key={index}
              className="border-b border-light-border-primary dark:border-dark-border-primary"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-0 py-5 flex items-center justify-between text-left transition-colors hover:text-light-accent-primary dark:hover:text-dark-accent-primary group"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-sans font-medium text-light-text-primary dark:text-dark-text-primary pr-8 text-base group-hover:text-light-accent-primary dark:group-hover:text-dark-accent-primary transition-colors">
                  {item.question}
                </span>
                <svg
                  className={`w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary flex-shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen ? 'rotate-180 text-light-accent-primary dark:text-dark-accent-primary' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-answer-${index}`}
                ref={(el) => { contentRefs.current[index] = el; }}
                className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  maxHeight: isOpen ? `${heights[index] || 0}px` : '0px',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                }}
                aria-hidden={!isOpen}
              >
                <div className="pb-5 pt-0">
                  <p className="font-serif text-light-text-secondary dark:text-dark-text-secondary leading-relaxed border-l-2 border-light-accent-primary dark:border-dark-accent-primary pl-4 text-base">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
