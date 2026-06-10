import Navbar from "../components/Navbar";
import { fines } from "../data/mockFines";
import { FaCheckCircle, FaClock, FaFileAlt, FaSearchLocation } from "react-icons/fa";

function Dashboard() {

  const pending = fines.filter(
    fine => fine.status === "Pending"
  );

  const paid = fines.filter(
    fine => fine.status === "Paid"
  );

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">

        <section className="page-rise mb-8 rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#164e70]/40 bg-[#07233f] px-3 py-1 text-xs uppercase tracking-[0.35em] text-[#9fcfff]">
            <FaSearchLocation className="text-[10px]" />
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-wide text-[#eaf6ff] md:text-4xl">
            Welcome Driver
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d2c0af] md:text-base">
            Track your pending fines, review payment status, and search your
            records through the portal.
          </p>
        </section>

        <div className="mb-8 grid gap-6 md:grid-cols-2">

          <div className="group rounded-[24px] border border-[#1f4f78]/60 bg-[#07223a]/85 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:border-[#7bd5ff] hover:shadow-[0_24px_60px_rgba(0,0,0,0.38)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[#fff4e5]">
                Pending Fines
              </h2>

              <div className="rounded-2xl bg-[#04283f] p-3 text-[#59a6ff]">
                <FaClock />
              </div>
            </div>
            <p className="mt-3 text-5xl font-extrabold text-[#59a6ff] transition-transform duration-200 group-hover:scale-105">
              {pending.length}
            </p>

            <p className="mt-3 text-sm text-[#bfe4ff]">
              Fines that still need your attention.
            </p>
          </div>

          <div className="group rounded-[24px] border border-[#1f4f78]/60 bg-[#07223a]/85 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:border-[#7bd5ff] hover:shadow-[0_24px_60px_rgba(0,0,0,0.38)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[#fff4e5]">
                Paid Fines
              </h2>

              <div className="rounded-2xl bg-[#04283f] p-3 text-[#7bd5ff]">
                <FaCheckCircle />
              </div>
            </div>
            <p className="mt-3 text-5xl font-extrabold text-[#7bd5ff] transition-transform duration-200 group-hover:scale-105">
              {paid.length}
            </p>

            <p className="mt-3 text-sm text-[#bfe4ff]">
              Fines already cleared and recorded.
            </p>
          </div>

        </div>

        <h2 className="mb-4 text-2xl font-semibold text-[#fff4e5]">
          Recent Fines
        </h2>

        <div className="space-y-4">

          {fines.map((fine) => (
            <div
              key={fine.id}
              className="flex flex-col gap-4 rounded-[22px] border border-[#113a5a]/60 bg-[#062033]/90 p-5 shadow-[0_14px_38px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-1 hover:border-[#59a6ff] hover:bg-[#072a3d] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="flex items-center gap-2 font-bold text-[#eaf6ff]">
                  <FaFileAlt className="text-[#59a6ff]" />
                  {fine.referenceNumber}
                </p>

                <p className="text-sm text-[#d0b7a2]">
                  {fine.category}
                </p>
              </div>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    fine.status === "Paid"
                      ? "bg-[#1fc97a] text-[#021022]"
                      : "bg-[#ff8a4d] text-[#021022]"
                  }`}
                >
                  {fine.status}
                </span>
              </div>
            </div>
          ))}

        </div>

      </main>
    </div>
  );
}

export default Dashboard;