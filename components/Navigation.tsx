'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

interface NavigationProps {
  locale: string;
}

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);

  const menuCards = [
    {
      title: t('articles'),
      links: [
        { label: 'Neueste Artikel', href: `/${locale}` },
        { label: 'Krimtataren', href: `/${locale}/artikel` },
        { label: 'Alle Artikel', href: `/${locale}/artikel` }
      ],
      bgColor: '#0A0A0B',
      accentColor: '#024D81'
    },
    {
      title: t('about'),
      links: [
        { label: 'Biografie', href: `/${locale}/about` },
        { label: 'Werdegang', href: `/${locale}/about` },
        { label: 'Expertise', href: `/${locale}/about` }
      ],
      bgColor: '#121214',
      accentColor: '#024D81'
    },
    {
      title: t('contact'),
      links: [
        { label: 'Kontaktformular', href: `/${locale}/kontakt` },
        { label: 'Social Media', href: `/${locale}/kontakt` },
        { label: 'Impressum', href: `/${locale}/kontakt` }
      ],
      bgColor: '#1A1A1D',
      accentColor: '#024D81'
    }
  ];

  return (
    <>
      <nav className={`nav-wrapper ${isOpen ? 'nav-expanded' : ''}`}>
        <div className="nav-bar">
          {/* Hamburger - nur Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hamburger md:hidden"
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
            <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
          </button>

          {/* Logo */}
          <Link href={`/${locale}`} className="nav-logo">
            <img
              src="/images/logo.png"
              width={32}
              height={32}
              alt="Ahmet Özay"
              className="nav-logo-img"
            />
            <span className="nav-logo-text">Ahmet Özay</span>
          </Link>

          {/* Desktop Navigation - nur Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}`}
              className="text-sm transition-colors hover:text-light-accent-primary dark:hover:text-dark-accent-primary"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('articles')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm transition-colors hover:text-light-accent-primary dark:hover:text-dark-accent-primary"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/kontakt`}
              className="text-sm transition-colors hover:text-light-accent-primary dark:hover:text-dark-accent-primary"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('contact')}
            </Link>
          </div>

          {/* Right Side */}
          <div className="nav-right">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
          </div>
        </div>

        {/* Expanding Cards - nur Mobile */}
        <div className="nav-cards-container md:hidden">
          {menuCards.map((card, idx) => (
            <div
              key={card.title}
              className="nav-card"
              style={{ '--delay': `${idx * 0.1}s` } as React.CSSProperties}
            >
              <div 
                className="nav-card-inner"
                style={{ 
                  backgroundColor: card.bgColor,
                  borderLeft: `3px solid ${card.accentColor}`
                }}
              >
                <h3 className="nav-card-title">{card.title}</h3>
                <div className="nav-card-links">
                  {card.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="nav-card-link"
                      onClick={() => setIsOpen(false)}
                      style={{ 
                        '--hover-color': card.accentColor 
                      } as React.CSSProperties}
                    >
                      <span style={{ color: card.accentColor }}>→</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="nav-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}