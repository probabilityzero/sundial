import React, { useState } from 'react';

interface CircleColorSettingsProps {}

const CircleColorSettings: React.FC<CircleColorSettingsProps> = () => {
  const [circleColor, setCircleColor] = useState('#007bff');

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCircleColor(event.target.value);
  };

  return (
    <div>
      <div className="flex p-1 items-center">
        <div className='flex justify-between w-full'>
          <label htmlFor="circleColor" className="font-semibold">
            Circle color
          </label>
          <input
            type="color"
            id="circleColor"
            value={circleColor}
            onChange={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CircleColorSettings;
