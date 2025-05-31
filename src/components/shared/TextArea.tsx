import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface TextAreaProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: () => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  showArrow?: boolean;
}

export default function TextArea({
  label,
  value,
  onChange,
  onClick,
  placeholder = "",
  rows = 4,
  disabled = false,
  readOnly = false,
  className = "",
  showArrow = false
}: TextAreaProps) {
  const isClickable = readOnly && onClick;

  const handleClick = () => {
    if (isClickable && !disabled) {
      onClick();
    }
  };

  const containerClasses = `
    relative bg-zinc-800 border border-zinc-700 rounded-lg px-4 pt-3 pb-2 transition-colors
    ${!readOnly ? 'focus-within:border-red-500' : ''}
    ${isClickable ? 'cursor-pointer hover:bg-zinc-750 hover:border-zinc-600' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div className={containerClasses} onClick={handleClick}>
      <label className="block text-xs font-medium text-gray-400 mb-1">
        {label}
      </label>
      <div className="flex items-start justify-between">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : 0}
          className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500 resize-none disabled:cursor-not-allowed"
          onClick={(e) => {
            if (isClickable) {
              e.preventDefault();
            }
          }}
        />
        {isClickable && showArrow && (
          <FontAwesomeIcon 
            icon={faChevronRight} 
            className="text-gray-400 text-xs ml-2 mt-1" 
          />
        )}
      </div>
    </div>
  );
} 