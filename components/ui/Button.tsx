import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-light-accent-primary text-white hover:bg-light-accent-hover dark:bg-dark-accent-primary dark:hover:bg-dark-accent-hover focus:ring-light-accent-primary',
      secondary: 'bg-light-bg-tertiary text-light-text-primary hover:bg-light-border-primary dark:bg-dark-bg-tertiary dark:text-dark-text-primary dark:hover:bg-dark-border-primary',
      outline: 'border-2 border-light-border-accent text-light-text-primary hover:bg-light-bg-tertiary dark:border-dark-border-accent dark:text-dark-text-primary dark:hover:bg-dark-bg-tertiary',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
