import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaCheckCircle, FaClock, FaFileAlt, FaSearchLocation, FaChevronRight } from "react-icons/fa";
import { parseJwt } from "../utils/jwtHelper";

function Dashboard() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFines = async () => {
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

        const mappedFines = response.data.map(fine => ({
          id: fine.id,
          referenceNumber: fine.referenceNumber,
          category: fine.categoryName || fine.categoryCode,
          amount: fine.amount,
          location: "Colombo",
          date: fine.fineDate,
          status: fine.status === "PAID" ? "Paid" : "Pending"
        }));

        setFines(mappedFines);
      } catch (err) {
        console.error("Error fetching fines:", err);
        setError("Could not retrieve fines from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, []);

  const pending = fines.filter(
    fine => fine.status === "Pending"
  );

  const paid = fines.filter(
    fine => fine.status === "Paid"
  );

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6">

        <section className="page-rise mb-6 rounded-2xl border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-6 shadow-xl">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#164e70]/40 bg-[#07233f] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.25em] text-[#9fcfff]">
            <FaSearchLocation className="text-[9px]" />
            Overview
          </p>

          <h1 className="mt-2 text-xl font-bold tracking-wide text-[#eaf6ff] md:text-2xl">
            Welcome Driver
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-[#d2c0af]">
            Track your pending fines, review payment status, and search your records through the portal.
          </p>
        </section>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#aacde9] animate-pulse">Loading fines...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-2">

              <div className="group rounded-2xl border border-[#1f4f78]/60 bg-[#07223a]/85 p-5 shadow-lg transition duration-200 hover:border-[#7bd5ff]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold text-[#fff4e5]">
                    Pending Fines
                  </h2>

                  <div className="rounded-xl bg-[#04283f] p-2.5 text-[#59a6ff]">
                    <FaClock />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-bold text-[#59a6ff]">
                  {pending.length}
                </p>

                <p className="mt-1.5 text-xs text-[#bfe4ff]">
                  Fines that still need your attention.
                </p>
              </div>

              <div className="group rounded-2xl border border-[#1f4f78]/60 bg-[#07223a]/85 p-5 shadow-lg transition duration-200 hover:border-[#7bd5ff]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold text-[#fff4e5]">
                    Paid Fines
                  </h2>

                  <div className="rounded-xl bg-[#04283f] p-2.5 text-[#7bd5ff]">
                    <FaCheckCircle />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-bold text-[#7bd5ff]">
                  {paid.length}
                </p>

                <p className="mt-1.5 text-xs text-[#bfe4ff]">
                  Fines already cleared and recorded.
                </p>
              </div>

            </div>

            <h2 className="mb-3 text-lg font-semibold text-[#fff4e5]">
              Recent Fines
            </h2>

            <div className="space-y-3">
              {fines.length === 0 ? (
                <div className="text-center py-6 rounded-xl border border-[#113a5a]/60 bg-[#062033]/90 text-xs">
                  <p className="text-[#aacde9]">No fine records found.</p>
                </div>
              ) : (
                fines.map((fine) => (
                  <Link
                    key={fine.id}
                    to={`/fine/${fine.referenceNumber}`}
                    className="flex flex-col gap-3 rounded-2xl border border-[#113a5a]/60 bg-[#062033]/90 p-4 shadow-md transition-all duration-200 hover:border-[#59a6ff] hover:bg-[#072a3d] hover:shadow-[0_8px_24px_rgba(74,163,255,0.15)] md:flex-row md:items-center md:justify-between cursor-pointer group"
                  >
                    <div>
                      <p className="flex items-center gap-2 text-sm font-bold text-[#eaf6ff] group-hover:text-[#59a6ff] transition-colors">
                        <FaFileAlt className="text-[#59a6ff]" />
                        {fine.referenceNumber}
                      </p>

                      <p className="text-xs text-[#d0b7a2]">
                        {fine.category} — {fine.location}
                      </p>
                      
                      <p className="text-[11px] text-[#8db8d8] mt-0.5">
                        Amount: LKR {fine.amount.toLocaleString()} | Date: {fine.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          fine.status === "Paid"
                            ? "bg-[#1fc97a] text-[#021022]"
                            : "bg-[#ff8a4d] text-[#021022]"
                        }`}
                      >
                        {fine.status}
                      </span>
                      <FaChevronRight className="text-xs text-[#59a6ff] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default Dashboard;