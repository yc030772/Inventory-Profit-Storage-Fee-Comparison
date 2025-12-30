import React from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (val: number) => void;
  step?: string;
  prefix?: string;
}

export const NumberInput: React.FC<Props> = ({ label, value, onChange, step = "1", prefix }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`block w-full rounded-md border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border ${prefix ? 'pl-7' : ''}`}
        />
      </div>
    </div>
  );
};