import React, { useState } from 'react';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

interface TextInputProps {
  id: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  label: string;
  icon?: IconDefinition;
}

const Input: React.FC<TextInputProps> = ({ id, type, value, onChange, required = false, label, icon }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={icon} className="text-gray-400" />
          </div>
        )}
        <input
          type={type === 'password' && isPasswordVisible ? 'text' : type}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            icon ? 'pl-10' : ''
          }`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-700"
          >
          <FontAwesomeIcon  className="text-gray-400" icon={isPasswordVisible ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
