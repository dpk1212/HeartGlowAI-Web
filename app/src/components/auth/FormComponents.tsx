import { HeartIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`input-field ${error ? 'border-red-500' : ''}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

interface SubmitButtonProps {
  text: string;
  loading?: boolean;
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  loading = false,
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      type="submit"
      disabled={loading || disabled}
      className="btn-secondary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
      ) : (
        <HeartIcon className="h-5 w-5" />
      )}
      <span>{text}</span>
    </button>
  );
}; 