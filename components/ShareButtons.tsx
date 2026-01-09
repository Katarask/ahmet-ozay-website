'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
  locale?: string;
}

export default function ShareButtons({ title, url, excerpt, locale = 'de' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  // Full URL für Sharing
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}` 
    : url;
  
  const shareText = excerpt ? `${title} - ${excerpt}` : title;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareButtons = [
    { 
      name: 'Twitter', 
      url: shareLinks.twitter, 
      label: 'Auf Twitter teilen'
    },
    { 
      name: 'LinkedIn', 
      url: shareLinks.linkedin, 
      label: 'Auf LinkedIn teilen'
    },
    { 
      name: 'WhatsApp', 
      url: shareLinks.whatsapp, 
      label: 'Auf WhatsApp teilen'
    },
    { 
      name: 'Telegram', 
      url: shareLinks.telegram, 
      label: 'Auf Telegram teilen'
    },
    { 
      name: 'Email', 
      url: shareLinks.email, 
      label: 'Per E-Mail teilen'
    },
    { 
      name: 'Facebook', 
      url: shareLinks.facebook, 
      label: 'Auf Facebook teilen'
    },
    { 
      name: 'Reddit', 
      url: shareLinks.reddit, 
      label: 'Auf Reddit teilen'
    },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-light-border-primary dark:border-dark-border-primary">
      <h3 className="text-lg font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
        Artikel teilen
      </h3>
      
      <div className="flex flex-wrap gap-3 items-center">
        {shareButtons.map((button) => (
          <a
            key={button.name}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-accent-primary dark:hover:bg-dark-accent-primary hover:text-white dark:hover:text-white text-light-text-primary dark:text-dark-text-primary rounded-sm transition-colors font-sans text-sm border border-light-border-primary dark:border-dark-border-primary hover:border-light-accent-primary dark:hover:border-dark-accent-primary whitespace-nowrap"
            aria-label={button.label}
          >
            {button.name}
          </a>
        ))}
        
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="px-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-accent-primary dark:hover:bg-dark-accent-primary hover:text-white dark:hover:text-white text-light-text-primary dark:text-dark-text-primary rounded-sm transition-colors font-sans text-sm border border-light-border-primary dark:border-dark-border-primary hover:border-light-accent-primary dark:hover:border-dark-accent-primary whitespace-nowrap"
          aria-label="Link kopieren"
        >
          {copied ? 'Link kopiert!' : 'Link kopieren'}
        </button>
      </div>
    </div>
  );
}
