// components/ConfirmModal.js
import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Confirm Details</h2>
        <p>Are you sure your details are correct?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-goldlight text-white px-4 py-2 rounded hover:bg-primarygold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
