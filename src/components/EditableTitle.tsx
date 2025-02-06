import React, { useState } from 'react';
import { Edit, Check } from 'lucide-react';

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
}

export function EditableTitle({ title, onSave }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(newTitle);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  return (
    <div className="flex items-center">
      {isEditing ? (
        <>
          <input
            type="text"
            value={newTitle}
            onChange={handleInputChange}
            className="text-3xl font-semibold mr-2 focus:outline-none border-b-2 border-gray-300"
          />
          <button onClick={handleSaveClick} className="text-green-600 hover:text-green-800 focus:outline-none">
            <Check className="h-5 w-5" />
          </button>
        <>
      ) : (
        <>
          <h2 className="text-3xl font-semibold mr-2">{title}</h2>
          <button onClick={handleEditClick} className="text-gray-600 hover:text-gray-800 focus:outline-none">
            <Edit className="h-5 w-5" />
          </button>
        <>
      )}
    </div>
  );
}
