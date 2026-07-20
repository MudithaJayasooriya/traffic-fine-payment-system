import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaFileInvoiceDollar, FaChevronRight } from "react-icons/fa";
import { parseJwt } from "../utils/jwtHelper";

function PaymentHistory() {
  const navigate = useNavigate();
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

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <section className="page-rise rounded-2xl border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-6 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-[#07233f] p-2.5 text-[#9fcfff]">
              <FaFileInvoiceDollar />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#9fcfff]">History</p>
              <h1 className="text-xl font-bold tracking-wide text-[#eaf6ff]">Payment History</h1>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-6">
              <p className="text-xs text-[#aacde9] animate-pulse">Loading history...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#1f4f78]/60 bg-[#062033]/90 shadow-lg">
              <table className="w-full border-collapse text-left text-xs text-[#cfeeff]">
                <thead className="bg-[#07233f] text-[#eaf6ff]">
                  <tr>
                    <th className="p-3 font-bold uppercase tracking-wider text-[11px] text-[#9fcfff]">Reference</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[11px] text-[#9fcfff]">Category</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[11px] text-[#9fcfff]">Amount</th>
                    <th className="p-3 font-bold uppercase tracking-wider text-[11px] text-[#9fcfff]">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paidFines.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-[#aacde9]">
                        No payment records found.
                      </td>
                    </tr>
                  ) : (
                    paidFines.map((fine, index) => (
                      <tr
                        key={fine.id}
                        onClick={() => navigate(`/fine/${fine.referenceNumber}`)}
                        className={`cursor-pointer transition-colors hover:bg-[#072a3d] ${
                          index % 2 === 0 ? "bg-[#071d31]" : "bg-[#062033]"
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-[#4aa3ff] hover:underline">{fine.referenceNumber}</td>
                        <td className="p-3 font-semibold text-[#eaf6ff]">{fine.category}</td>
                        <td className="p-3 font-bold text-[#1fc97a]">LKR {fine.amount.toLocaleString()}</td>
                        <td className="p-3 flex items-center justify-between">
                          <span className="inline-flex rounded-full bg-[#1fc97a] px-2.5 py-0.5 text-[11px] font-bold text-[#021022]">
                            Paid
                          </span>
                          <FaChevronRight className="text-[10px] text-[#59a6ff] opacity-60" />
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