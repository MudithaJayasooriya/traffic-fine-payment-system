import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { parseJwt } from "../utils/jwtHelper";

function PaymentHistory() {
  const [paidFines, setPaidFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaymentHistory = async () => {
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

        const paid = response.data
          .filter(fine => fine.status === "PAID")
          .map(fine => ({
            id: fine.id,
            referenceNumber: fine.referenceNumber,
            category: fine.categoryName || fine.categoryCode,
            amount: fine.amount
          }));

        setPaidFines(paid);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Failed to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <section className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#07233f] p-3 text-[#9fcfff]">
              <FaFileInvoiceDollar />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#9fcfff]">History</p>
              <h1 className="text-3xl font-extrabold tracking-wide text-[#eaf6ff]">Payment History</h1>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg text-[#aacde9] animate-pulse">Loading history...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-3xl border border-[#1f4f78]/60 bg-[#062033]/90 shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
              <table className="w-full border-collapse text-left text-sm text-[#cfeeff]">
                <thead className="bg-[#07233f] text-[#eaf6ff]">
                  <tr>
                    <th className="p-4 font-semibold">Reference</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paidFines.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-[#aacde9]">
                        No payment records found.
                      </td>
                    </tr>
                  ) : (
                    paidFines.map((fine, index) => (
                      <tr key={fine.id} className={index % 2 === 0 ? "bg-[#071d31]" : "bg-[#062033]"}>
                        <td className="p-4 font-semibold text-[#eaf6ff]">{fine.referenceNumber}</td>
                        <td className="p-4">{fine.category}</td>
                        <td className="p-4">Rs. {fine.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="inline-flex rounded-full bg-[#1fc97a] px-3 py-1 text-xs font-semibold text-[#021022]">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PaymentHistory;