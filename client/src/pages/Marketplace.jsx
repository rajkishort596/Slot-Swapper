import { useEffect, useState } from "react";
import { fetchAllSwappableSlots, createSwapRequest } from "../api/swap.Api.js";
import { Search, Clock, User, ArrowRight } from "lucide-react";
import Spinner from "../components/Spinner";
import OfferSlotModal from "../components/Modal/OfferSlotModal.jsx";
import { toast } from "react-toastify";

const Marketplace = () => {
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch all swappable slots
  useEffect(() => {
    const getSlots = async () => {
      setLoading(true);
      try {
        const data = await fetchAllSwappableSlots();
        setSlots(data);
        setFilteredSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    };
    getSlots();
  }, []);

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = slots.filter(
      (slot) =>
        slot.title.toLowerCase().includes(term) ||
        new Date(slot.startTime).toLocaleString().toLowerCase().includes(term)
    );
    setFilteredSlots(filtered);
  }, [searchTerm, slots]);

  const handleOpenModal = (slot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  // Confirm swap
  const handleConfirmSwap = async (mySlotId) => {
    try {
      await createSwapRequest(mySlotId, selectedSlot._id);
      toast.success("Swap request sent successfully!");
      setModalOpen(false);
      const data = await fetchAllSwappableSlots();
      setSlots(data);
      setFilteredSlots(data);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to send swap request::";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="py-8 px-4 lg:px-6 xl:px-10">
      <h1 className="text-3xl font-bold text-white mb-2">Available Slots</h1>
      <p className="text-gray-400 mb-6">
        Find a time slot to swap with one of your own.
      </p>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Filter by event title, date, or time"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Slot Cards */}
      <div className="space-y-5">
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot) => {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);
            const formattedDate = start.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            });
            const formattedTime = `${start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`;

            return (
              <div
                key={slot._id}
                className="bg-background-dark border border-white/10 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between p-5 transition hover:border-primary/40 hover:shadow-md"
              >
                {/* Slot Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white mb-1 leading-tight">
                    {slot.title}
                  </h2>
                  <div className="flex items-center text-gray-300 text-sm gap-2 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formattedDate} @ {formattedTime}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm gap-2">
                    <User className="w-4 h-4" />
                    <span>Offered by {slot.user?.name || "Unknown"}</span>
                  </div>
                </div>

                {/* Request Button */}
                <button
                  onClick={() => handleOpenModal(slot)}
                  className="mt-4 sm:mt-0 sm:ml-4 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  Request Swap <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center py-10">
            No available slots found.
          </p>
        )}
      </div>

      {/* Offer Slot Modal */}
      <OfferSlotModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmSwap}
        targetSlot={selectedSlot}
      />
    </div>
  );
};

export default Marketplace;
