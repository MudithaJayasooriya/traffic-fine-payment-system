import { useParams } from "react-router-dom";
import { FaCheckCircle, FaDownload, FaReceipt, FaHashtag } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Receipt() {

  const { paymentId } = useParams();

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-xl px-4 py-8 md:px-6">
        <section className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1fc97a]/15 text-[#1fc97a]">
            <FaCheckCircle className="text-3xl" />
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-wide text-[#eaf6ff]">
            Payment Successful
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#bfe4ff]">
            Your payment has been recorded and the receipt is ready to download.
          </p>

          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            <div className="rounded-[22px] border border-[#1f4f78]/60 bg-[#062033]/90 p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#9fcfff]">
                <FaReceipt className="text-[10px]" /> Transaction
              </p>
              <p className="mt-2 font-semibold text-[#eaf6ff]">TXN-{paymentId}</p>
            </div>

            <div className="rounded-[22px] border border-[#1f4f78]/60 bg-[#062033]/90 p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#9fcfff]">
                <FaHashtag className="text-[10px]" /> Reference
              </p>
              <p className="mt-2 font-semibold text-[#eaf6ff]">RF00{paymentId}</p>
            </div>

            <div className="rounded-[22px] border border-[#1f4f78]/60 bg-[#062033]/90 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9fcfff]">Status</p>
              <p className="mt-2 inline-flex rounded-full bg-[#1fc97a] px-3 py-1 text-sm font-semibold text-[#021022]">
                Paid
              </p>
            </div>
          </div>

          <button
            className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-[#2b6fb0]/40 bg-[#4aa3ff] px-6 py-3 font-bold text-[#021022] shadow-[0_16px_30px_rgba(74,163,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#66b8ff]"
          >
            <FaDownload className="text-xs" />
            Download Receipt
          </button>
        </section>
      </main>
    </div>
  );
}

export default Receipt;