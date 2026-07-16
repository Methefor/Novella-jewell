import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 rounded-full cursor-pointer';

    const variants = {
      primary: 'bg-black text-white hover:bg-gold',
      secondary: 'bg-[#F4F4F6] text-black hover:bg-[#EBEBED]',
      ghost:
        'bg-transparent text-black border border-black/18 hover:border-black/55',
      outline:
        'bg-transparent text-black border border-gold hover:bg-gold hover:text-white',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
