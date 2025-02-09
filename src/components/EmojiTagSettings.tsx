import React, { useState } from 'react';
import TagDropdown from './TagDropdown';

interface EmojiTagSettingsProps {}

const EmojiTagSettings: React.FC<EmojiTagSettingsProps> = () => {
  const [availableTags, setAvailableTags] = useState([
    { name: 'Working', selected: true },
    { name: 'Studying', selected: false },
    { name: 'Reading', selected: false },
    { name: 'Meeting', selected: false },
    { name: 'Research', selected: false },
    { name: 'Meditation', selected: false },
    { name: 'Writing', selected: false },
    { name: 'Coding', selected: false },
    { name: 'Designing', selected: false },
    { name: 'Editing', selected: false },
  ]);
  const [defaultTag, setDefaultTag] = useState('Working');

  const handleTagSelect = (index: number) => {
    const newTags = [...availableTags];
    newTags[index].selected = !newTags[index].selected;
    setAvailableTags(newTags);
  };

  const handleDefaultTagChange = (tag: string) => {
    setDefaultTag(tag);
  };

  const selectedTags = availableTags.filter(tag => tag.selected).map(tag => tag.name);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tag Settings</h3>
        <TagDropdown
          availableTags={availableTags}
          defaultTag={defaultTag}
          onTagSelect={handleTagSelect}
          onDefaultTagChange={handleDefaultTagChange}
        />
      </div>
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Selected Tags:</h4>
        <div className="flex flex-wrap">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center m-1 px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiTagSettings;
</boltArtifact>
```

**Explanation:**

*   **`EmojiTagSettings.tsx`**:
    *   We add a `div` with the class `flex justify-between items-center mb-4` to wrap the "Tag Settings" title and the `TagDropdown` component. This will position the title and the dropdown on opposite sides of the container.

With these changes, the "Select Tags" dropdown should now be positioned on the right side of the "Tag Settings" title in the `EmojiTagSettings` component.
