import { useState } from "react";
import Navbar from "../components/Navbar";
import { fines } from "../data/mockFines";
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";

function SearchFine() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const found = fines.find(
      (fine) =>
        fine.referenceNumber.toLowerCase() === reference.toLowerCase()
    );

    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <section className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <p className="text-xs uppercase tracking-[0.35em] text-[#9fcfff]">
            Fine lookup
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-[#eaf6ff] md:text-4xl">
            Search Fine
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bfe4ff] md:text-base">
            Enter a reference number to quickly inspect the fine details and
            payment status.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              placeholder="Reference Number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="flex-1 rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
            />

            <button
              onClick={handleSearch}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2b6fb0]/40 bg-[#4aa3ff] px-6 py-3 font-bold text-[#021022] shadow-[0_16px_30px_rgba(74,163,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#66b8ff]"
            >
              <FaSearch className="text-sm transition-transform duration-200 group-hover:scale-110" />
              Search
            </button>
          </div>

          {result && (
            <div className="mt-8 rounded-3xl border border-[#113a5a]/60 bg-[#062033]/90 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.28)]">
              <h2 className="mb-4 text-xl font-bold text-[#eaf6ff]">
                Fine Details
              </h2>

              <div className="grid gap-4 text-sm text-[#cfeeff] sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <strong className="flex items-center gap-2">
                    <FaSearch className="text-[#59a6ff]" />
                    Reference:
                  </strong>
                  {result.referenceNumber}
                </p>

                <p className="flex items-center gap-2">
                  <strong className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#59a6ff]" />
                    Category:
                  </strong>
                  {result.category}
                </p>

                <p className="flex items-center gap-2">
                  <strong className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-[#59a6ff]" />
                    Amount:
                  </strong>
                  Rs. {result.amount}
                </p>

                <p>
                  <strong>Location:</strong> {result.location}
                </p>

                <p>
                  <strong>Status:</strong>

                  <span
                    className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      result.status === "Paid"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {result.status}
                  </span>
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  to={`/fine/${result.id}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500 px-5 py-3 font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-green-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}

          {searched && !result && (
            <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center">
              <h3 className="text-lg font-semibold text-red-300">
                Fine Not Found
              </h3>

              <p className="mt-2 text-sm text-red-200">
                No traffic fine was found for the entered reference number.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


export default SearchFine;