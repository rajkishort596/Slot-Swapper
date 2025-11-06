import { useEffect, useState } from "react";
import {
  createEvent,
  fetchAllEvents,
  updateEvent,
  updateEventStatus,
  deleteEvent,
} from "../api/event.Api.js";
import Spinner from "../components/Spinner.jsx";
import EventModal from "../components/Modal/EventModal.jsx";
import DeleteModal from "../components/Modal/DeleteModal.jsx";
import {
  PlusCircle,
  CalendarDays,
  ArrowLeftRight,
  SquarePen,
  Trash,
} from "lucide-react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchAllEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  const handleAddOrEditEvent = async (eventData) => {
    setLoading(true);
    try {
      if (editEvent) {
        await updateEvent(eventData, editEvent._id);
        toast.success("Event Updated Successfully.");
        setEditEvent(null);
      } else {
        await createEvent(eventData);
        toast.success("Event Created Successfully.");
      }
      const updated = await fetchAllEvents();
      setEvents(updated);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        "Failed to save event. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (event) => {
    setLoading(true);
    try {
      const newStatus = event.status === "BUSY" ? "SWAPPABLE" : "BUSY";
      await updateEventStatus({ status: newStatus }, event._id);
      const updated = await fetchAllEvents();
      setEvents(updated);
      toast.success("Status Updated Successfully.");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Error updating status:";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteEvent = async () => {
    setLoading(true);
    try {
      await deleteEvent(deleteEventId);
      const updated = await fetchAllEvents();
      setEvents(updated);
      toast.success("Event Deleted Successfully.");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Error deleting event:";
      toast.error(errorMsg);
    } finally {
      setDeleteEventId(null);
      setShowDeleteModal(false);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center bg-black/50 justify-center h-screen">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  const grouped = events.reduce((acc, event) => {
    const date = new Date(event.startTime).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  return (
    <main className="flex flex-col gap-6 py-6 bg-background-dark text-text-light">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-4">
        <div className="flex flex-col gap-1">
          <p className="text-white text-4xl font-black leading-none tracking-[-0.033em]">
            My Calendar
          </p>
          <p className="text-text-secondary-dark text-base font-normal leading-normal">
            Your Upcoming Events
          </p>
        </div>
        <button
          onClick={() => {
            setEditEvent(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:opacity-90 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {Object.entries(grouped).map(([date, dayEvents]) => (
          <div key={date} className="flex flex-col gap-4">
            <h3 className="font-bold text-lg text-white">{date}</h3>

            <div className="flex flex-col gap-4">
              {dayEvents.map((event) => (
                <div
                  key={event._id}
                  className={`card relative ${
                    event.status === "SWAPPABLE" ? "card-swappable" : ""
                  }`}
                >
                  {event.status === "BUSY" && (
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        className="text-white/70 hover:text-white transition"
                        title="Edit Event"
                        onClick={() => {
                          setEditEvent(event);
                          setShowModal(true);
                        }}
                      >
                        <SquarePen strokeWidth={1} className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300 transition"
                        title="Delete Event"
                        onClick={() => {
                          setDeleteEventId(event._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash strokeWidth={1} className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <p
                      className={`badge ${
                        event.status === "BUSY"
                          ? "badge-busy"
                          : "badge-swappable"
                      }`}
                    >
                      {event.status}
                    </p>
                    <p className="text-base font-bold leading-tight text-white">
                      {event.title}
                    </p>
                    <p className="text-sm font-normal leading-normal text-text-secondary-dark">
                      {new Date(event.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(event.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStatusChange(event)}
                    className="btn btn-muted w-fit mt-2 flex items-center gap-1"
                  >
                    {event.status === "BUSY" ? (
                      <>
                        <ArrowLeftRight className="w-4 h-4" />
                        Make Swappable
                      </>
                    ) : (
                      <>
                        <CalendarDays className="w-4 h-4" />
                        Make Busy
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-card p-10 text-center col-span-2">
            <CalendarDays className="text-white/40 w-10 h-10 mb-2" />
            <p className="text-text-secondary-dark text-sm">
              No events scheduled yet.
            </p>
          </div>
        )}
      </div>

      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditEvent(null);
        }}
        onSubmit={handleAddOrEditEvent}
        eventToEdit={editEvent}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteEvent}
      />
    </main>
  );
};

export default Dashboard;
