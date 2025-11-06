import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal.jsx";

const EventModal = ({ isOpen, onClose, onSubmit, eventToEdit }) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (eventToEdit) {
      const start = new Date(eventToEdit.startTime);
      const end = new Date(eventToEdit.endTime);

      reset({
        title: eventToEdit.title || "",
        startDate: start.toISOString().split("T")[0],
        startTime: start.toTimeString().slice(0, 5),
        endDate: end.toISOString().split("T")[0],
        endTime: end.toTimeString().slice(0, 5),
      });
    } else {
      reset({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
      });
    }
  }, [eventToEdit, reset]);

  const handleFormSubmit = (data) => {
    const startDateTime = new Date(
      `${data.startDate}T${data.startTime}`
    ).toISOString();
    const endDateTime = new Date(
      `${data.endDate}T${data.endTime}`
    ).toISOString();

    const eventData = {
      title: data.title,
      startTime: startDateTime,
      endTime: endDateTime,
      status: eventToEdit ? eventToEdit.status : "BUSY",
    };

    onSubmit(eventData);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? "Edit Event" : "Create New Event"}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Event Title
          </label>
          <input
            {...register("title", { required: true })}
            placeholder="Enter event title"
            className="w-full px-3 py-2 rounded-lg bg-background-dark border border-white/10 focus:outline-none focus:border-primary text-white"
          />
        </div>

        {/* Start Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-full px-3 py-2 rounded-lg bg-background-dark border border-white/10 focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Start Time
            </label>
            <input
              type="time"
              {...register("startTime", { required: true })}
              className="w-full px-3 py-2 rounded-lg bg-background-dark border border-white/10 focus:outline-none focus:border-primary text-white"
            />
          </div>
        </div>

        {/* End Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              End Date
            </label>
            <input
              type="date"
              {...register("endDate", { required: true })}
              className="w-full px-3 py-2 rounded-lg bg-background-dark border border-white/10 focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              End Time
            </label>
            <input
              type="time"
              {...register("endTime", { required: true })}
              className="w-full px-3 py-2 rounded-lg bg-background-dark border border-white/10 focus:outline-none focus:border-primary text-white"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 h-10 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full px-4 h-10 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
          >
            {eventToEdit ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
