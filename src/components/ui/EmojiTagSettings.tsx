import React from 'react';
import { useUserSettingsStore } from '../../store/useUserSettingsStore';
import { supabase } from '../../lib/supabase'; // Import supabase

interface EmojiTagSettingsProps {}

const EmojiTagSettings: React.FC<EmojiTagSettingsProps> = () => {
  const { availableTags, setAvailableTags } = useUserSettingsStore();

  const handleTagClick = async (tagName: string) => {
    const newTags = availableTags.some(tag => tag.name === tagName)
      ? availableTags.filter(tag => tag.name !== tagName)
      : [...availableTags, { name: tagName }];

    setAvailableTags(newTags);

    // Update Supabase
    const userId = supabase.auth.currentUser?.id;
    if (userId) {
      try {
        const { error } = await supabase
          .from('user_settings')
          .update({ available_tags: newTags.map(tag => tag.name) })
          .eq('user_id', userId);

        if (error) {
          console.error("EmojiTagSettings: Error updating available tags:", error);
          // Revert the state on error
          // setAvailableTags(availableTags); //Reverting the state can cause issues
        }
      } catch (error) {
        console.error("EmojiTagSettings: Error updating available tags:", error);
        // Revert the state on error
        // setAvailableTags(availableTags); //Reverting the state can cause issues
      }
    }
  };

  const allTags = ['Working', 'Studying', 'Reading', 'Meeting', 'Research', 'Meditation', 'Writing', 'Coding', 'Designing', 'Editing'];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tag Settings</h3>
      </div>
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Available Tags:</h4>
        <div className="flex flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`inline-flex items-center m-1 px-2 py-1 rounded-full text-sm ${availableTags.some(availableTag => availableTag.name === tag) ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700'} `}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiTagSettings;
