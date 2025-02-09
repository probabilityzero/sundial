import React, { useState } from 'react';

interface CircleColorSettingsProps {}

const CircleColorSettings: React.FC<CircleColorSettingsProps> = () => {
  const [circleColor, setCircleColor] = useState('#007bff');

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCircleColor(event.target.value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Circle Color Settings</h3>
      <div className="flex items-center">
        <label htmlFor="circleColor" className="mr-2">
          Circle Color:
        </label>
        <input
          type="color"
          id="circleColor"
          value={circleColor}
          onChange={handleColorChange}
        />
      </div>
    </div>
  );
};

export default CircleColorSettings;
