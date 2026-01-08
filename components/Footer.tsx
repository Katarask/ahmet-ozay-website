'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="footer">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-serif">
            Ahmet Özay - {t('journalist')}
          </h3>
        </div>

        {/* Links & Social */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href={`/${locale}/about`} className="hover:opacity-70 transition-opacity">
              {nav('about')}
            </Link>
            <Link href={`/${locale}`} className="hover:opacity-70 transition-opacity">
              {nav('articles')}
            </Link>
            <Link href={`/${locale}/kontakt`} className="opacity-70 hover:opacity-100 transition-opacity">
              {t('imprint')}
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://x.com/aoezay"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="X (Twitter)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/ahmet-özay-34b97a200/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px opacity-20" style={{ backgroundColor: 'currentColor' }} />

        {/* Copyright */}
        <div className="text-center text-sm opacity-70">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}