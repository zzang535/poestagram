import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface InputProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  showArrow?: boolean;
  error?: string | null;
  autoFocus?: boolean;
}

export default function Input({
  label,
  value,
  onChange,
  onClick,
  placeholder = "",
  type = "text",
  disabled = false,
  readOnly = false,
  className = "",
  showArrow = false,
  error = null,
  autoFocus = false
}: InputProps) {
  const isClickable = readOnly && onClick;

  const handleClick = () => {
    if (isClickable && !disabled) {
      onClick();
    }
  };

  const containerClasses = `
    relative bg-zinc-950 border rounded-lg px-4 pt-3 pb-2 transition-colors
    ${error ? 'border-red-500' : 'border-zinc-900'}
    ${!readOnly && !error ? 'focus-within:border-red-500' : ''}
    ${isClickable ? 'cursor-pointer hover:bg-zinc-750 hover:border-zinc-600' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div>
      <div className={containerClasses} onClick={handleClick}>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          {label}
        </label>
        <div className="flex items-center justify-between">
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            tabIndex={readOnly ? -1 : 0}
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500 disabled:cursor-not-allowed"
            onClick={(e) => {
              if (isClickable) {
                e.preventDefault();
              }
            }}
          />
          {isClickable && showArrow && (
            <FontAwesomeIcon 
              icon={faChevronRight} 
              className="text-gray-400 text-xs ml-2" 
            />
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 