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
  error?: string | null;
  maxLength?: number;
  showCharCount?: boolean;
  autoFocus?: boolean;
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
  showArrow = false,
  error = null,
  maxLength,
  showCharCount = false,
  autoFocus = false
}: TextAreaProps) {
  const isClickable = readOnly && onClick;
  const currentLength = value.length;
  const isOverLimit = maxLength ? currentLength > maxLength : false;

  const handleClick = () => {
    if (isClickable && !disabled) {
      onClick();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!onChange) return;
    
    const newValue = e.target.value;
    
    // maxLength가 설정되어 있고, 새로운 값이 제한을 초과하는 경우 입력을 막음
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    onChange(e);
  };

  const containerClasses = `
    relative bg-zinc-950 border rounded-lg px-4 pt-3 pb-2 transition-colors
    ${error || isOverLimit ? 'border-red-500' : 'border-zinc-900'}
    ${!readOnly && !error && !isOverLimit ? 'focus-within:border-red-500' : ''}
    ${isClickable ? 'cursor-pointer hover:bg-zinc-750 hover:border-zinc-600' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div>
      <div className={containerClasses} onClick={handleClick}>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium text-gray-400">
            {label}
          </label>
          {showCharCount && maxLength && (
            <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between">
          <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
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
      {(error || isOverLimit) && (
        <p className="mt-1 text-sm text-red-500">
          {error || (isOverLimit && `글자 수 제한을 초과했습니다. (${maxLength}자 이하)`)}
        </p>
      )}
    </div>
  );
} 