interface TextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'primary' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export default function TextButton({
  children,
  onClick,
  href,
  disabled = false,
  className = '',
  variant = 'default',
  size = 'md'
}: TextButtonProps) {
  const baseClasses = 'transition-colors font-medium text-center inline-block cursor-pointer';
  
  const variantClasses = {
    default: 'text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed',
    link: 'text-blue-400 hover:underline hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
} 