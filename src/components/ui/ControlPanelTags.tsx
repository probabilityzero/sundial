import React from 'react';
import { useUserSettingsStore } from '../../store/useUserSettingsStore';
import { supabase } from '../../lib/supabase'; // Import supabase
import { useAuthStore } from '../../store/useAuthStore';

interface ControlPanelTagsProps {}

const ControlPanelTags: React.FC<ControlPanelTagsProps> = () => {
  const { availableTags, setAvailableTags } = useUserSettingsStore();
  const { user } = useAuthStore();

  const handleTagClick = async (tagName: string) => {
    const newTags = availableTags.some(tag => tag.name === tagName)
      ? availableTags.filter(tag => tag.name !== tagName)
      : [...availableTags, { name: tagName }];

    setAvailableTags(newTags);

    // Update Supabase
    if (user) {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .update({ available_tags: newTags.map(tag => tag.name) })
          .eq('user_id', user.id)
          .select()

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
    } else {
      console.warn("EmojiTagSettings: No user ID found, cannot update tags.");
    }
  };

  const allTags = ['Working', 'Studying', 'Reading', 'Meeting', 'Research', 'Meditation', 'Writing', 'Coding', 'Designing', 'Editing'];

  return (
    <div>
      <div className="p-1">
        <h4 className="text-md font-semibold pb-1">Choose your session tags</h4>
        <div className="flex border rounded-md bg-gray-100 flex-wrap">
          <div className='p-1'>
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
    </div>
  );
};

export default ControlPanelTags;
