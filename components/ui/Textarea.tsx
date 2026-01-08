import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-sans font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`w-full px-4 py-3 font-serif text-light-text-primary dark:text-dark-text-primary bg-light-bg-primary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary focus:border-light-accent-primary dark:focus:border-dark-accent-primary focus:outline-none focus:ring-1 focus:ring-light-accent-primary dark:focus:ring-dark-accent-primary transition-colors resize-vertical min-h-[150px] ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
