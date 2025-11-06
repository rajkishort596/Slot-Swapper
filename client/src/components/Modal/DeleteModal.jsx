import Modal from "./Modal";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="space-y-6">
        <p className="text-text-secondary-dark text-center">
          Are you sure you want to delete this event? This action cannot be
          undone.
        </p>

        <div className="flex justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full px-4 h-10 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full px-4 h-10 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
