import { useNavigate, useParams } from "react-router-dom";
import { FaCreditCard, FaLock, FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Payment() {

  const navigate = useNavigate();

  const { fineId } = useParams();

  const handlePayment = (e) => {
    e.preventDefault();

    navigate(`/receipt/${fineId}`);
  };

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-8 md:px-6">
        <form
          onSubmit={handlePayment}
          className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[#164e70]/40 bg-[#07233f] px-3 py-1 text-xs uppercase tracking-[0.35em] text-[#9fcfff]">
            <FaCreditCard className="text-[10px]" />
            Secure payment
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-wide text-[#eaf6ff]">
            Payment Details
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#bfe4ff]">
            Enter your card details to complete payment for fine #{fineId}.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Card Holder Name"
              className="w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
            />

            <input
              type="text"
              placeholder="Card Number"
              className="w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
              />

              <input
                type="password"
                placeholder="CVV"
                className="w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
              />
            </div>
          </div>

          <button
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2b6fb0]/40 bg-[#4aa3ff] px-6 py-3 font-bold text-[#021022] shadow-[0_16px_30px_rgba(74,163,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#66b8ff]"
          >
            <FaLock className="text-xs" />
            Pay Fine
            <FaArrowRight className="text-xs" />
          </button>
        </form>
      </main>
    </div>
  );
}

export default Payment;