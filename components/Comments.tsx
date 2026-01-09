'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Comment {
  _id: string;
  author: string;
  content: string;
  publishedAt: string;
}

interface CommentsProps {
  articleSlug: string;
  locale: string;
}

export default function Comments({ articleSlug, locale }: CommentsProps) {
  const t = useTranslations('comments');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Kommentare laden
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?slug=${articleSlug}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Kommentare:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleSlug,
          locale,
          ...formData,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ author: '', email: '', content: '' });
        // Kommentare neu laden
        const commentsResponse = await fetch(`/api/comments?slug=${articleSlug}`);
        if (commentsResponse.ok) {
          const data = await commentsResponse.json();
          setComments(data);
        }
      } else {
        const data = await response.json();
        setError(data.error || t('submitError'));
      }
    } catch (err) {
      setError(t('submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-light-border-primary dark:border-dark-border-primary">
        <p className="text-light-text-muted dark:text-dark-text-muted font-sans text-sm">
          {t('loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-light-border-primary dark:border-dark-border-primary">
      <h2 className="text-2xl font-sans font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
        {t('title')} ({comments.length})
      </h2>

      {/* Kommentar-Formular */}
      <div className="mb-8 p-6 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-sm border border-light-border-primary dark:border-dark-border-primary">
        {submitted ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm">
            <p className="text-sm text-green-800 dark:text-green-200 font-sans">
              {t('submitSuccess')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author" className="block text-sm font-sans font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  {t('author')} *
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full px-4 py-2 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-primary dark:border-dark-border-primary rounded-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary font-sans text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-sans font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-primary dark:border-dark-border-primary rounded-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary font-sans text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-sans font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                {t('comment')} *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                className="w-full px-4 py-2 bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-primary dark:border-dark-border-primary rounded-sm text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary font-sans text-sm resize-none"
              />
              <p className="mt-1 text-xs text-light-text-muted dark:text-dark-text-muted font-sans">
                {formData.content.length}/2000 {t('characters')}
              </p>
            </div>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm">
                <p className="text-sm text-red-800 dark:text-red-200 font-sans">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-light-accent-primary dark:bg-dark-accent-primary text-white rounded-sm hover:opacity-90 transition-opacity font-sans font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
            <p className="text-xs text-light-text-muted dark:text-dark-text-muted font-sans">
              {t('moderationNote')}
            </p>
          </form>
        )}
      </div>

      {/* Kommentar-Liste */}
      {comments.length === 0 ? (
        <p className="text-light-text-muted dark:text-dark-text-muted font-serif italic text-center py-8">
          {t('noComments')}
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-sm border border-light-border-primary dark:border-dark-border-primary"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-sans font-semibold text-sm text-light-text-primary dark:text-dark-text-primary">
                    {comment.author}
                  </h3>
                  <p className="text-xs text-light-text-muted dark:text-dark-text-muted font-sans">
                    {formatDate(comment.publishedAt)}
                  </p>
                </div>
              </div>
              <p className="font-serif text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
