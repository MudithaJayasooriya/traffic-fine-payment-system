import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  fetchNotificationData,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../utils/notificationHelper";
import { FaBell, FaCheckDouble, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL, UNREAD, SETTLED
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchNotificationData();
    setNotifications(data.notifications);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(notifications);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "SETTLED") return n.type === "PAID";
    return true;
  });

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        {/* Header Banner */}
        <section className="page-rise mb-6 rounded-2xl border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#07233f] p-3 text-[#9fcfff] border border-[#4aa3ff]/30">
              <FaBell className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#9fcfff]">Alerts & Log</p>
              <h1 className="text-xl font-bold tracking-wide text-[#eaf6ff]">Notification History</h1>
            </div>
          </div>

          {notifications.some((n) => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-2 rounded-xl bg-[#072b46] border border-[#4aa3ff]/40 px-3.5 py-2 text-xs font-bold text-[#4aa3ff] hover:bg-[#073659] transition cursor-pointer"
            >
              <FaCheckDouble /> Mark All as Read
            </button>
          )}
        </section>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {[
            { id: "ALL", label: `All Activity (${notifications.length})` },
            { id: "UNREAD", label: `Unread / Action Required (${notifications.filter((n) => !n.read).length})` },
            { id: "SETTLED", label: `Settled Payments (${notifications.filter((n) => n.type === "PAID").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === tab.id
                  ? "bg-[#0b3a5a] text-[#eaf6ff] border border-[#0f4f78]"
                  : "bg-[#062033]/70 text-[#aacde9] border border-transparent hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-xs text-[#aacde9] animate-pulse">Loading notification history...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border border-[#113a5a]/60 bg-[#062033]/90">
                <p className="text-xs text-[#aacde9]">No notifications matching this filter.</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkAsRead(n.id)}
                  className={`rounded-2xl border p-4 shadow-md transition duration-200 cursor-pointer ${
                    !n.read
                      ? "border-[#4aa3ff]/50 bg-[#07223a]/95 shadow-[#4aa3ff]/10"
                      : "border-[#113a5a]/60 bg-[#062033]/80 opacity-90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {n.type === "PAID" ? (
                        <div className="p-2 rounded-xl bg-[#1fc97a]/20 text-[#1fc97a] border border-[#1fc97a]/40">
                          <FaCheckCircle className="text-sm" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-[#ff8a4d]/20 text-[#ff8a4d] border border-[#ff8a4d]/40">
                          <FaExclamationTriangle className="text-sm" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-sm font-bold text-[#eaf6ff]">{n.title}</h2>
                        <p className="text-[11px] text-[#aacde9] mt-0.5">Ticket Ref: <span className="font-mono font-bold text-[#4aa3ff]">{n.referenceNumber}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {n.type === "PAID" ? (
                        <span className="rounded-full bg-[#1fc97a] px-2.5 py-0.5 text-[10px] font-extrabold text-[#021022]">
                          SETTLED
                        </span>
                      ) : !n.read ? (
                        <span className="rounded-full bg-[#ff8a4d] px-2.5 py-0.5 text-[10px] font-extrabold text-[#021022]">
                          NEW UNPAID
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#164e70] px-2.5 py-0.5 text-[10px] font-bold text-[#aacde9]">
                          READ
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-[#cfeeff]">
                    {n.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#8db8d8] pt-2 border-t border-[#113a5a]/40">
                    <span>Fine Date: {n.date}</span>
                    {!n.read && (
                      <span className="text-[#4aa3ff] font-semibold hover:underline">
                        Click to mark as read
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;