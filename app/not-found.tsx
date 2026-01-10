import Link from 'next/link';
import { defaultLocale } from '@/i18n/config';

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale}>
      <body className="bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-lg mb-8">The page you are looking for does not exist.</p>
          <Link
            href={`/${defaultLocale}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-light-accent dark:bg-dark-accent text-white rounded-sm hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
