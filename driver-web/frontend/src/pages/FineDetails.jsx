import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaFileAlt, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";

function FineDetails() {
  const { id } = useParams(); // 'id' contains the referenceNumber
  const [fine, setFine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFineDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/api/fines/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;
        setFine({
          id: data.id,
          referenceNumber: data.referenceNumber,
          category: data.categoryName || data.categoryCode,
          amount: data.amount,
          location: "Colombo",
          date: data.fineDate,
          status: data.status === "PAID" ? "Paid" : "Pending"
        });
      } catch (err) {
        console.error("Error fetching fine details:", err);
        setError("Failed to fetch fine details from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchFineDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen text-[#eaf6ff]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <section className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)] text-center py-10 animate-pulse">
            <p className="text-[#aacde9]">Loading fine details...</p>
          </section>
        </main>
      </div>
    );
  }

  if (error || !fine) {
    return (
      <div className="min-h-screen text-[#eaf6ff]">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <section className="page-rise rounded-[28px] border border-red-500/20 bg-red-500/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)] text-center">
            <h1 className="text-3xl font-extrabold text-red-300">Fine Not Found</h1>
            <p className="mt-3 text-red-200">{error || "The requested fine record could not be located."}</p>
            <div className="mt-6">
              <Link to="/search-fine" className="inline-flex items-center gap-2 rounded-2xl border border-[#2b6fb0]/40 bg-[#4aa3ff] px-6 py-3 font-bold text-[#021022]">
                Back to Search
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <section className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#164e70]/40 bg-[#07233f] px-3 py-1 text-xs uppercase tracking-[0.35em] text-[#9fcfff]">
            <FaFileAlt className="text-[10px]" />
            Fine details
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-wide text-[#eaf6ff] md:text-4xl">
            {fine.referenceNumber}
          </h1>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-[#1f4f78]/60 bg-[#062033]/90 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.24)]">
              <p className="text-sm uppercase tracking-[0.3em] text-[#9fcfff]">Violation</p>
              <p className="mt-2 text-lg font-semibold text-[#fff4e5]">{fine.category}</p>
            </div>

            <div className="rounded-3xl border border-[#1f4f78]/60 bg-[#062033]/90 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.24)]">
              <p className="text-sm uppercase tracking-[0.3em] text-[#9fcfff]">Status</p>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${fine.status === "Paid" ? "bg-[#1fc97a] text-[#021022]" : "bg-[#ff8a4d] text-[#021022]"}`}>
                <FaCheckCircle className="mr-2 text-xs" />
                {fine.status}
              </span>
            </div>

            <div className="rounded-3xl border border-[#1f4f78]/60 bg-[#062033]/90 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.24)]">
              <p className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-[#9fcfff]"><FaMapMarkerAlt className="text-[10px]" />Location</p>
              <p className="mt-2 text-lg font-semibold text-[#eaf6ff]">{fine.location}</p>
            </div>

            <div className="rounded-3xl border border-[#1f4f78]/60 bg-[#062033]/90 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.24)]">
              <p className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-[#9fcfff]"><FaCalendarAlt className="text-[10px]" />Date</p>
              <p className="mt-2 text-lg font-semibold text-[#eaf6ff]">{fine.date}</p>
            </div>

            <div className="rounded-3xl border border-[#1f4f78]/60 bg-[#062033]/90 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.24)] sm:col-span-2">
              <p className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-[#9fcfff]"><FaMoneyBillWave className="text-[10px]" />Amount</p>
              <p className="mt-2 text-3xl font-extrabold text-[#59a6ff]">Rs. {fine.amount.toLocaleString()}</p>
            </div>
          </div>

          {fine.status === "Pending" && (
            <div className="mt-8 flex justify-end">
              <Link
                to={`/payment/${fine.referenceNumber}`}
                className="inline-flex items-center gap-2 rounded-3xl border border-[#2b6fb0]/40 bg-[#4aa3ff] px-6 py-3 font-bold text-[#021022] shadow-[0_16px_30px_rgba(74,163,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#66b8ff]"
              >
                Pay Now
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default FineDetails;