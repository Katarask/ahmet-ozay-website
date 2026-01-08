'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Here you would integrate with your email service
      // For now, we simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {status === 'success' ? (
        <div 
          className="p-6 rounded-lg text-center"
          style={{ 
            backgroundColor: 'var(--color-accent-light)',
            border: '1px solid var(--color-accent-primary)'
          }}
        >
          <svg 
            className="w-12 h-12 mx-auto mb-4" 
            style={{ color: 'var(--color-accent-primary)' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <p style={{ color: 'var(--color-accent-primary)', fontWeight: 500 }}>
            {t('success')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="form-label">
                {t('name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('namePlaceholder')}
                required
                className="form-input"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('emailPlaceholder')}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="form-label">
              {t('subject')}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t('subjectPlaceholder')}
              required
              className="form-input"
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="form-label">
              {t('message')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('messagePlaceholder')}
              required
              rows={6}
              className="form-input form-textarea"
            />
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <div 
              className="p-4 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgb(239, 68, 68)',
                color: 'rgb(239, 68, 68)'
              }}
            >
              {t('error')}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary w-full md:w-auto"
            style={{ opacity: status === 'sending' ? 0.7 : 1 }}
          >
            {status === 'sending' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" cy="12" r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t('sending')}
              </span>
            ) : (
              <span>
                {t('send')}
              </span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
