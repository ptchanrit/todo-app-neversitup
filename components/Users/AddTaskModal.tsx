import React, { ChangeEvent } from 'react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  title: string;
  description: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  title,
  description,
  onInputChange,
  onDescriptionChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Add a New Todo</h2>
        <input
          value={title}
          onChange={onInputChange}
          className="block w-full px-3 py-2 font-semibold border border-gray-300 rounded-md focus:outline-none"
          placeholder="Task Name"
        />
        <textarea
          value={description}
          onChange={onDescriptionChange}
          className="block w-full px-3 py-2 font-semibold border border-gray-300 rounded-md focus:outline-none resize-none"
          placeholder="Description"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-800 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
