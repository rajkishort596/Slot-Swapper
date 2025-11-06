import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Inbox, Loader } from "lucide-react";
import {
  fetchIncomingSlots,
  fetchOutgoingSlots,
  handleSwapRequest,
} from "../api/swap.Api.js";
import { toast } from "react-toastify";

const SwapRequests = () => {
  const [activeTab, setActiveTab] = useState("incoming");
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      if (activeTab === "incoming") {
        const data = await fetchIncomingSlots();
        setIncoming(data);
      } else {
        const data = await fetchOutgoingSlots();
        setOutgoing(data);
      }
    } catch (error) {
      toast.error("Failed to load swap requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [activeTab]);

  const handleResponse = async (accepted, requestId) => {
    setLoading(true);
    try {
      await handleSwapRequest(accepted, requestId);
      toast.success(accepted ? "Request accepted!" : "Request rejected!");
      fetchSlots();
    } catch (error) {
      toast.error("Action failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })}, ${startDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${endDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const renderRequestCard = (req, type) => {
    console.log(req, type);
    const offeredSlot = req.offeringSlot;
    const requestedSlot = req.requestingSlot;

    return (
      <div
        key={req._id}
        className="bg-background-dark border border-white/10 rounded-xl p-4 flex justify-between items-start"
      >
        <div className="flex gap-3 items-start">
          <div className="p-2 rounded-lg bg-background text-primary">
            {type === "incoming" ? (
              <ArrowDown className="w-5 h-5" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold">
              Offered: {offeredSlot?.title}
            </h3>
            <p className="text-gray-400 text-sm mb-1">
              {formatTime(offeredSlot?.startTime, offeredSlot?.endTime)}
            </p>
            <p className="text-gray-400 text-sm">
              Requested:{" "}
              <span className="text-white font-medium">
                {requestedSlot?.title}
              </span>
            </p>

            <div className="mt-2 text-sm text-gray-400">
              <p>
                <span className="font-medium text-white">
                  {type === "incoming" ? "Offered By: " : "Offered To: "}
                </span>
                {type === "incoming"
                  ? req.offeringUser.name
                  : req.receivingUser.name}
              </p>
            </div>
          </div>
        </div>

        {type === "incoming" ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleResponse(false, req._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
            >
              Reject
            </button>
            <button
              onClick={() => handleResponse(true, req._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium"
            >
              Accept
            </button>
          </div>
        ) : (
          <div>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                req.status === "PENDING"
                  ? "bg-yellow-600/30 text-yellow-400"
                  : req.status === "ACCEPTED"
                  ? "bg-green-600/30 text-green-400"
                  : "bg-red-600/30 text-red-400"
              }`}
            >
              Status: {req.status}
            </span>
          </div>
        )}
      </div>
    );
  };

  const activeData = activeTab === "incoming" ? incoming : outgoing;

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Swap Requests</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-background-dark border border-white/10 rounded-xl overflow-hidden">
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === "incoming"
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("incoming")}
        >
          Incoming Requests{" "}
          {incoming.length > 0 && (
            <span className="ml-1 text-xs bg-white/20 px-2 py-px rounded-full">
              {incoming.length}
            </span>
          )}
        </button>
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${
            activeTab === "outgoing"
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("outgoing")}
        >
          Outgoing Requests{" "}
          {outgoing.length > 0 && (
            <span className="ml-1 text-xs bg-white/20 px-2 py-px rounded-full">
              {outgoing.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : activeData.length > 0 ? (
          activeData.map((req) =>
            renderRequestCard(
              req,
              activeTab === "incoming" ? "incoming" : "outgoing"
            )
          )
        ) : (
          <div className="border border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-gray-400">
            <Inbox className="w-10 h-10 mb-3 text-gray-500" />
            <p className="font-semibold">
              No More {activeTab === "incoming" ? "Incoming" : "Outgoing"}{" "}
              Requests
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === "incoming"
                ? "When someone proposes a swap with you, it will appear here."
                : "When you propose a new swap, it will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapRequests;
