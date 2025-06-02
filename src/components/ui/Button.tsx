interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  loadingText = "로딩 중...",
  variant = "primary",
  type = "button",
  className = ""
}: ButtonProps) {
  const baseClasses = "w-full py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-red-800 text-white hover:bg-red-900 disabled:bg-gray-700 disabled:text-gray-400",
    secondary: "bg-zinc-900 text-white hover:bg-zinc-900 disabled:bg-gray-700 disabled:text-gray-400"
  };

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={finalClassName}
    >
      {loading ? loadingText : children}
    </button>
  );
} 