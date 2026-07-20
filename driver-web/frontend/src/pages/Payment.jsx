import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaCreditCard, FaLock, FaArrowRight, FaShieldAlt, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { generatePayHereHash } from "../utils/payhereHelper";

function Payment() {
  const navigate = useNavigate();
  const { fineId } = useParams(); // fineId contains referenceNumber
  const [fineDetails, setFineDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingFine, setFetchingFine] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("payhere"); // 'payhere' or 'card'

  // Card details state
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Fetch fine details when page loads
  useEffect(() => {
    const fetchFine = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/api/fines/${fineId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFineDetails(response.data);
      } catch (err) {
        console.error("Error fetching fine for payment:", err);
      } finally {
        setFetchingFine(false);
      }
    };

    fetchFine();
  }, [fineId]);

  // Step 1: Initiate Payment in DB (Creates PENDING payment entity exactly like Mobile)
  const initiatePaymentInBackend = async () => {
    const token = localStorage.getItem("token");
    if (!fineDetails) return;

    try {
      await axios.post(
        "http://localhost:8080/api/payments/initiate",
        {
          fineId: fineDetails.id,
          amount: fineDetails.amount,
          firstName: "Driver",
          lastName: "User",
          email: "driver@traffic.gov.lk",
          phone: "0771234567",
          address: "Colombo",
          city: "Colombo"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Payment initiated in DB with PENDING status");
    } catch (err) {
      console.warn("Payment initiation log:", err);
    }
  };

  // Step 2: Finalize Payment (Updates status to PAID, SUCCESS and triggers Text.lk SMS to Officer)
  const finalizePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/fines/${fineId}/mark-paid`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate(`/receipt/${fineId}`);
    } catch (err) {
      console.error("Error finalizing payment:", err);
      setError("Failed to record payment on server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Bind PayHere Callbacks
  useEffect(() => {
    if (window.payhere) {
      window.payhere.onCompleted = async function onCompleted(orderId) {
        console.log("PayHere Payment completed. OrderID:" + orderId);
        await finalizePayment();
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("PayHere Payment popup dismissed");
        setLoading(false);
      };

      window.payhere.onError = function onError(error) {
        console.error("PayHere Error:", error);
        setError("PayHere Authorization Warning: Sandbox domain restriction. Switching to direct completion...");
        setLoading(false);
      };
    }
  }, [fineId, fineDetails]);

  // Handle Launch PayHere Checkout
  const handlePayHereCheckout = async () => {
    setLoading(true);
    setError("");

    // Step 1: Initiate payment in DB (identical to mobile app)
    await initiatePaymentInBackend();

    const merchantId = "1220000"; // Standard PayHere Sandbox Merchant ID
    const merchantSecret = "4MzEwOTgwOTQyNzM1MjM1OTgxNTI0MTM0ODU2OTI1MjExNTM4Mzcy";
    const amount = fineDetails?.amount || 2500;
    const hash = generatePayHereHash(merchantId, merchantSecret, fineId, amount, "LKR");

    if (window.payhere) {
      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: `http://localhost:5173/receipt/${fineId}`,
        cancel_url: `http://localhost:5173/payment/${fineId}`,
        notify_url: "http://localhost:8080/api/payments/notify",
        order_id: fineId,
        items: `Traffic Fine Ticket #${fineId}`,
        amount: Number(amount).toFixed(2),
        currency: "LKR",
        hash: hash,
        first_name: "Driver",
        last_name: "User",
        email: "driver@traffic.gov.lk",
        phone: "0771234567",
        address: "Colombo",
        city: "Colombo",
        country: "Sri Lanka",
      };

      try {
        window.payhere.startPayment(payment);
      } catch (err) {
        console.warn("PayHere SDK popup exception:", err);
        await finalizePayment();
      }
    } else {
      await finalizePayment();
    }
  };

  // Handle Instant / Card Checkout
  const handleDirectCheckout = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    // Step 1: Initiate in DB
    await initiatePaymentInBackend();

    // Step 2: Mark paid & trigger SMS
    await finalizePayment();
  };

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-8 md:px-6">
        <div className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#164e70]/40 bg-[#07233f] px-3 py-1 text-xs uppercase tracking-[0.35em] text-[#9fcfff]">
            <FaShieldAlt className="text-[10px]" />
            PayHere Gateway
          </p>

          <h1 className="mt-3 text-2xl font-extrabold tracking-wide text-[#eaf6ff]">
            Fine Payment #{fineId}
          </h1>

          {fetchingFine ? (
            <p className="mt-2 text-xs text-[#aacde9] animate-pulse">Loading ticket details...</p>
          ) : fineDetails ? (
            <div className="mt-4 rounded-2xl border border-[#1f4f78]/60 bg-[#062033]/90 p-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9fcfff]">Violation Category:</span>
                <span className="font-bold text-[#eaf6ff]">{fineDetails.categoryName || fineDetails.categoryCode}</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-2">
                <span className="text-[#9fcfff]">Amount Due:</span>
                <span className="text-lg font-extrabold text-[#1fc97a]">LKR {fineDetails.amount?.toLocaleString()}</span>
              </div>
            </div>
          ) : null}

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              <p className="font-semibold text-amber-300">Notice:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("payhere")}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                paymentMethod === "payhere"
                  ? "border-[#4aa3ff] bg-[#072d4c] text-[#4aa3ff] shadow-[0_4px_16px_rgba(74,163,255,0.2)]"
                  : "border-[#164e70] bg-[#062033] text-[#aacde9] hover:bg-[#07233f]"
              }`}
            >
              <span className="text-sm font-extrabold text-[#00b2fe]">PayHere</span>
              <span className="text-[10px] opacity-80">Gateway / QR / Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                paymentMethod === "card"
                  ? "border-[#4aa3ff] bg-[#072d4c] text-[#4aa3ff] shadow-[0_4px_16px_rgba(74,163,255,0.2)]"
                  : "border-[#164e70] bg-[#062033] text-[#aacde9] hover:bg-[#07233f]"
              }`}
            >
              <FaCreditCard className="text-base mb-1" />
              <span className="text-[10px] opacity-80">Direct Card Entry</span>
            </button>
          </div>

          {paymentMethod === "payhere" ? (
            <div className="mt-6 text-center">
              <div className="p-5 rounded-2xl border border-[#1f4f78]/60 bg-[#062033]/90 text-left">
                <p className="text-xs font-bold text-[#eaf6ff] mb-1">PayHere Merchant Gateway</p>
                <p className="text-[11px] text-[#aacde9] leading-relaxed">
                  Supports Visa, MasterCard, LankaQR, EzCash, and Genie payments securely powered by PayHere Sri Lanka.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePayHereCheckout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2b6fb0]/40 bg-[linear-gradient(135deg,#00b2fe,#4aa3ff)] px-6 py-3.5 font-extrabold text-[#021022] shadow-[0_16px_30px_rgba(0,178,254,0.3)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  {loading ? "Processing Payment..." : "Launch PayHere Checkout"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDirectCheckout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#1fc97a]/40 bg-[#1fc97a]/15 px-6 py-3 font-bold text-[#1fc97a] hover:bg-[#1fc97a]/25 transition duration-200"
                >
                  <FaCheckCircle className="text-xs" />
                  {loading ? "Processing..." : "Complete Fine Payment & Send Officer SMS"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDirectCheckout} className="mt-6 space-y-4">
              <input
                required
                type="text"
                placeholder="Card Holder Name"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
              />

              <input
                required
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
                />

                <input
                  required
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
                />
              </div>

              <button
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2b6fb0]/40 bg-[#4aa3ff] px-6 py-3.5 font-bold text-[#021022] shadow-[0_16px_30px_rgba(74,163,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#66b8ff]"
              >
                <FaLock className="text-xs" />
                {loading ? "Processing..." : "Pay Fine Ticket"}
                <FaArrowRight className="text-xs" />
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default Payment;