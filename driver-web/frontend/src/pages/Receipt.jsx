import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaDownload, FaReceipt, FaHashtag, FaPrint, FaShieldAlt, FaArrowLeft, FaFilePdf } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Receipt() {
  const { paymentId } = useParams(); // paymentId contains referenceNumber
  const [fine, setFine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFine = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/api/fines/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFine(response.data);
      } catch (err) {
        console.error("Error fetching fine details for receipt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFine();
  }, [paymentId]);

  // Triggers native Save as PDF / Print dialog with print stylesheet
  const handleDownloadPdf = () => {
    window.print();
  };

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="mx-auto max-w-2xl px-4 py-8 md:px-6">
        {/* ACTION BUTTONS (Hidden during print/PDF save) */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#8db8d8] hover:text-[#4aa3ff] transition-colors"
          >
            <FaArrowLeft className="text-[10px]" /> Return to Dashboard
          </Link>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#2b6fb0]/40 bg-[#4aa3ff] px-5 py-2.5 text-xs font-bold text-[#021022] shadow-[0_12px_24px_rgba(74,163,255,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#66b8ff]"
            >
              <FaFilePdf className="text-sm" />
              Save as PDF / Print
            </button>
          </div>
        </div>

        {/* OFFICIAL PRINTABLE PDF RECEIPT CARD */}
        <div
          id="printable-receipt"
          className="rounded-[28px] border border-[#113a5a]/80 bg-[#07223a] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.4)] print:border-black print:bg-white print:text-black print:shadow-none print:p-6 print:rounded-none"
        >
          {/* Header */}
          <div className="border-b border-[#164e70]/60 pb-6 print:border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#d7a46b] font-bold print:text-gray-700">
                  Democratic Socialist Republic of Sri Lanka
                </span>
                <h1 className="mt-1 text-xl font-extrabold text-[#eaf6ff] print:text-black">
                  SRI LANKA POLICE DEPARTMENT
                </h1>
                <p className="text-xs text-[#aacde9] print:text-gray-600">
                  Official Electronic Traffic Citation Payment Receipt
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1fc97a]/20 px-3 py-1 text-xs font-bold text-[#1fc97a] border border-[#1fc97a]/40 print:border-green-600 print:text-green-800 print:bg-green-100">
                  <FaCheckCircle className="text-xs" /> PAID
                </span>
                <p className="mt-1 font-mono text-[11px] text-[#8db8d8] print:text-gray-500">
                  REC-2026-{(fine?.id || 100).toString().padStart(5, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* Receipt Details Table */}
          <div className="mt-6 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#062033]/90 p-4 border border-[#1f4f78]/60 print:bg-gray-50 print:border-gray-200">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#9fcfff] font-bold print:text-gray-500">Fine Reference Number</p>
                <p className="mt-1 font-mono text-sm font-bold text-[#4aa3ff] print:text-black">{fine?.referenceNumber || paymentId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#9fcfff] font-bold print:text-gray-500">Payment Date & Time</p>
                <p className="mt-1 font-semibold text-[#eaf6ff] print:text-black">{formattedDate}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#062033]/90 p-4 border border-[#1f4f78]/60 print:bg-gray-50 print:border-gray-200 space-y-3">
              <div className="flex justify-between border-b border-[#164e70]/40 pb-2 print:border-gray-200">
                <span className="text-[#aacde9] print:text-gray-600">Violation Category:</span>
                <span className="font-bold text-[#eaf6ff] print:text-black">{fine?.categoryName || fine?.categoryCode || "Traffic Fine"}</span>
              </div>

              <div className="flex justify-between border-b border-[#164e70]/40 pb-2 print:border-gray-200">
                <span className="text-[#aacde9] print:text-gray-600">Offending Driver ID:</span>
                <span className="font-bold text-[#eaf6ff] print:text-black">#{fine?.driverId || "N/A"}</span>
              </div>

              <div className="flex justify-between border-b border-[#164e70]/40 pb-2 print:border-gray-200">
                <span className="text-[#aacde9] print:text-gray-600">Issuing Officer ID:</span>
                <span className="font-bold text-[#eaf6ff] print:text-black">#{fine?.officerId || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-[#aacde9] print:text-gray-600 font-bold">Total Amount Paid:</span>
                <span className="text-xl font-extrabold text-[#1fc97a] print:text-green-700">LKR {(fine?.amount || 2500).toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* Footer / Verification Stamp */}
          <div className="mt-6 border-t border-[#164e70]/60 pt-4 flex items-center justify-between text-[10px] text-[#8db8d8] print:border-gray-300 print:text-gray-500">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-sm text-[#4aa3ff] print:text-blue-600" />
              <span>Verified Digital Security Gateway Seal</span>
            </div>
            <span>Electronic Copy — No Signature Required</span>
          </div>
        </div>
      </main>

      {/* Embedded CSS for Print Mode */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Receipt;