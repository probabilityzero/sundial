import React, { useState } from 'react';
import TagSettingsDropdown from './TagSettingsDropdown';

interface EmojiTagSettingsProps {}

const EmojiTagSettings: React.FC<EmojiTagSettingsProps> = () => {
  const [availableTags, setAvailableTags] = useState([
    { name: 'Working', selected: true },
    { name: 'Studying', selected: true },
    { name: 'Reading', selected: true },
    { name: 'Meeting', selected: true },
    { name: 'Research', selected: true },
    { name: 'Meditation', selected: true },
    { name: 'Writing', selected: true },
    { name: 'Coding', selected: true },
    { name: 'Designing', selected: true },
    { name: 'Editing', selected: true },
  ]);

  const handleTagSelect = (index: number) => {
    const newTags = [...availableTags];
    newTags[index].selected = !newTags[index].selected;
    setAvailableTags(newTags);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Tag Settings</h3>
      <TagSettingsDropdown
        availableTags={availableTags}
        onTagSelect={handleTagSelect}
      />
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Available Tags:</h4>
        <div className="flex flex-wrap">
          {availableTags.map((tag) => (
            <span
              key={tag.name}
              className={`inline-flex items-center m-1 px-2 py-1 rounded-full text-sm ${
                tag.selected ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiTagSettings;
