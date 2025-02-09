import React from 'react';

interface DimensionDropdownProps {
  selectedDimension: string | null;
  onDimensionChange: (dimension: string) => void;
}

const DimensionDropdown: React.FC<DimensionDropdownProps> = ({ selectedDimension, onDimensionChange }) => {
  const dimensions = ['Working', 'Studying', 'Reading', 'Relaxing', 'Other'];

  return (
    <select
      value={selectedDimension || ''}
      onChange={(e) => onDimensionChange(e.target.value)}
      className="bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    >
      <option value="">Select Dimension</option>
      {dimensions.map((dimension) => (
        <option key={dimension} value={dimension}>
          {dimension}
        </option>
      ))}
    </select>
  );
};

export default DimensionDropdown;
