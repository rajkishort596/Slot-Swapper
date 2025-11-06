import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { fetchMySwappableSlots } from "../../api/swap.Api.js";
import Spinner from "../../components/Spinner";

const OfferSlotModal = ({ isOpen, onClose, onConfirm, targetSlot }) => {
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const getSlots = async () => {
        setLoading(true);
        try {
          const data = await fetchMySwappableSlots();
          setMySlots(data);
        } catch (error) {
          console.error("Failed to fetch user's swappable slots:", error);
        } finally {
          setLoading(false);
        }
      };
      getSlots();
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setConfirming(true);
    try {
      await onConfirm(selectedSlot);
      onClose();
    } catch (error) {
      console.error("Error confirming swap:", error);
    } finally {
      setConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg m-4 bg-background-dark border border-white/10 rounded-xl shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-white" id="modal-title">
                Offer Your Slot for a Swap
              </h2>
              <p className="text-sm text-gray-400">
                Select one of your slots to offer for{" "}
                <span className="font-semibold text-white">
                  {targetSlot?.title || "this slot"}
                </span>
                .
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-6">
            <label
              htmlFor="slot-select"
              className="block text-sm font-medium text-white mb-2"
            >
              Your available slots
            </label>

            {loading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : mySlots.length > 0 ? (
              <select
                id="slot-select"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="block w-full rounded-lg border border-white/10 bg-background-dark text-white py-2 px-3 focus:border-primary focus:ring-primary focus:ring-opacity-50 transition-colors"
              >
                <option value="">Choose your slot...</option>
                {mySlots.map((slot) => {
                  const start = new Date(slot.startTime);
                  const end = new Date(slot.endTime);
                  const formatted = `${slot.title} — ${start.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  )} @ ${start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`;
                  return (
                    <option key={slot._id} value={slot._id}>
                      {formatted}
                    </option>
                  );
                })}
              </select>
            ) : (
              <p className="text-gray-400 text-sm">
                You don’t have any available slots to offer.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedSlot || confirming}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors disabled:bg-primary/40 disabled:cursor-not-allowed"
            >
              {confirming ? "Confirming..." : "Confirm Offer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSlotModal;
