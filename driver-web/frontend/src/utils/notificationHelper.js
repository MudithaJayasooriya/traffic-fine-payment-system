import axios from "axios";
import { parseJwt } from "./jwtHelper";

export const fetchNotificationData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { notifications: [], unreadCount: 0 };

    const claims = parseJwt(token);
    const driverId = claims?.id;
    if (!driverId) return { notifications: [], unreadCount: 0 };

    const response = await axios.get(`http://localhost:8080/api/fines/driver/${driverId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const readIds = JSON.parse(localStorage.getItem(`read_notifications_${driverId}`) || "[]");

    const notifications = (response.data || []).map((fine) => {
      const isPaid = fine.status === "PAID";
      const isRead = readIds.includes(fine.id) || isPaid;

      return {
        id: fine.id,
        referenceNumber: fine.referenceNumber,
        type: isPaid ? "PAID" : "UNPAID",
        title: isPaid ? "Fine Payment Settled" : "New Traffic Fine Issued",
        message: isPaid
          ? `Your payment of LKR ${fine.amount?.toLocaleString()} for ticket ${fine.referenceNumber} (${fine.categoryName || fine.categoryCode || "Violation"}) has been successfully processed.`
          : `A traffic fine of LKR ${fine.amount?.toLocaleString()} was issued for ticket ${fine.referenceNumber} (${fine.categoryName || fine.categoryCode || "Violation"}).`,
        date: fine.fineDate || "Recent",
        amount: fine.amount,
        read: isRead,
      };
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return { notifications, unreadCount };
  } catch (error) {
    console.error("Error loading notification history:", error);
    return { notifications: [], unreadCount: 0 };
  }
};

export const markNotificationAsRead = (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const claims = parseJwt(token);
    const driverId = claims?.id;
    if (!driverId) return;

    const readIds = JSON.parse(localStorage.getItem(`read_notifications_${driverId}`) || "[]");
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem(`read_notifications_${driverId}`, JSON.stringify(readIds));
    }
  } catch (err) {
    console.error("Error marking notification read:", err);
  }
};

export const markAllNotificationsAsRead = (notifications = []) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const claims = parseJwt(token);
    const driverId = claims?.id;
    if (!driverId) return;

    const allIds = notifications.map((n) => n.id);
    localStorage.setItem(`read_notifications_${driverId}`, JSON.stringify(allIds));
  } catch (err) {
    console.error("Error marking all read:", err);
  }
};
