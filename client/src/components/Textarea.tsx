interface TextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  rows?: number;
  className?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({
  label,
  name,
  placeholder = '',
  defaultValue = '',
  value,
  rows = 3,
  className = '',
  required = false,
  onChange,
}: TextareaProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-base-bold text-neutral-950">
        {label}
        {required && <span className="text-negative-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        rows={rows}
        required={required}
        onChange={onChange}
        className={`w-full bg-primary-50 border-transparent focus:border-primary-500 focus:ring-0 text-neutral-950 text-sm p-4 resize-none ${className}`}
      />
    </div>
  );
}
