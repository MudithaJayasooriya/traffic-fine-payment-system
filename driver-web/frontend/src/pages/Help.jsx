import Navbar from "../components/Navbar";
import { FaQuestionCircle, FaSearch, FaCreditCard, FaHeadset } from "react-icons/fa";

function Help() {

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <section className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#07233f] p-3 text-[#9fcfff]"><FaQuestionCircle /></div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#9fcfff]">Support</p>
              <h1 className="text-3xl font-extrabold tracking-wide text-[#eaf6ff]">Help & FAQ</h1>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {[
              [FaSearch, "How do I search for a fine?", "Enter your fine reference number in the Search Fine page."],
              [FaCreditCard, "How do I pay a fine?", "Search your fine and click Pay Now to continue to payment."],
              [FaHeadset, "What if payment fails?", "Try again or contact support if the issue continues."],
            ].map(([Icon, question, answer]) => (
              <div key={question} className="rounded-[22px] border border-[#1f4f78]/60 bg-[#062033]/90 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.24)]">
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#eaf6ff]">
                  <Icon className="text-[#59a6ff]" />
                  {question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#bfe4ff]">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Help;