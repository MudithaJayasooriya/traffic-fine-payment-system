import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { parseJwt } from "../utils/jwtHelper";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const claims = parseJwt(token);
        const driverId = claims?.id;

        if (!driverId) {
          setError("Driver ID not found in security token.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/fines/driver/${driverId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const pendingFines = response.data.filter(fine => fine.status === "NOT_PAID");
        const list = pendingFines.map(fine => ({
          id: fine.id,
          title: "New Fine Issued",
          message: `A traffic fine of LKR ${fine.amount.toLocaleString()} has been issued under reference number ${fine.referenceNumber} for ${fine.categoryName || fine.categoryCode}.`,
          date: fine.fineDate,
          read: false
        }));

        setNotifications(list);
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">
          Notifications
        </h1>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg text-[#aacde9] animate-pulse">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 rounded-2xl border border-[#113a5a]/60 bg-[#062033]/90">
                <p className="text-[#aacde9]">You have no new notifications.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-3xl border p-5 shadow-lg ${
                    notification.read
                      ? "border-[#113a5a] bg-[#08243c]"
                      : "border-blue-500/40 bg-blue-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {notification.title}
                    </h2>

                    {!notification.read && (
                      <span className="rounded-full bg-green-500 px-3 py-1 text-xs">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-[#cfeeff]">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-[#8db8d8]">
                    Issued Date: {notification.date}
                  </p>
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