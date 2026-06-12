import Navbar from "../components/Navbar";
import { fines } from "../data/mockFines";
import { FaFileInvoiceDollar } from "react-icons/fa";

function PaymentHistory() {

  const paidFines = fines.filter(
    (fine) => fine.status === "Paid"
  );

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
                {paidFines.map((fine, index) => (
                  <tr key={fine.id} className={index % 2 === 0 ? "bg-[#071d31]" : "bg-[#062033]"}>
                    <td className="p-4 font-semibold text-[#eaf6ff]">{fine.referenceNumber}</td>
                    <td className="p-4">{fine.category}</td>
                    <td className="p-4">Rs. {fine.amount}</td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full bg-[#1fc97a] px-3 py-1 text-xs font-semibold text-[#021022]">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PaymentHistory;