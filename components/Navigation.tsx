'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { type Locale } from '@/i18n/config';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

interface NavigationProps {
  locale: Locale;
}

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t('articles') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/kontakt`, label: t('contact') },
  ];

  return (
    <>
      <nav className="nav">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="https://cdn.prod.website-files.com/68ff9cf3c843a43aca58193f/691e5abf77147cbe199f263e_android-chrome-192x192.png"
              width={32}
              height={32}
              alt="Ahmet Özay"
              className="rounded-full"
            />
            <span 
              className="text-lg font-serif border-l-2 pl-2"
              style={{ 
                borderColor: 'var(--color-border-accent)',
                color: 'var(--color-text-primary)' 
              }}
            >
              Ahmet Özay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden theme-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <>
                    <line x1="4" y1="4" x2="20" y2="20"/>
                    <line x1="20" y1="4" x2="4" y2="20"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          style={{ backgroundColor: 'var(--color-footer-bg)' }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link 
              href={`/${locale}`} 
              className="flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <img
                src="https://cdn.prod.website-files.com/68ff9cf3c843a43aca58193f/691e5abf77147cbe199f263e_android-chrome-192x192.png"
                width={32}
                height={32}
                alt="Ahmet Özay"
                className="rounded-full"
                style={{ filter: 'brightness(1.2)' }}
              />
              <span className="text-lg font-serif border-l-2 border-white/50 pl-2 text-white">
                Ahmet Özay
              </span>
            </Link>
            <button
              className="p-2 text-white"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="4" x2="20" y2="20"/>
                <line x1="20" y1="4" x2="4" y2="20"/>
              </svg>
            </button>
          </div>
          
          <nav className="px-4 pt-12">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-3xl font-serif text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}