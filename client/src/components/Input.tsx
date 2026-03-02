interface InputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'tel' | 'email';
  defaultValue?: string;
  value?: string;
  className?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  name,
  placeholder = '',
  type = 'text',
  defaultValue = '',
  value,
  className = '',
  required = false,
  onChange,
}: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-base-bold text-neutral-950">
        {label}
        {required && <span className="text-negative-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className={`w-full bg-primary-50 border-transparent focus:border-primary-500 focus:ring-0 text-neutral-950 text-sm p-4 ${className}`}
      />
    </div>
  );
}
