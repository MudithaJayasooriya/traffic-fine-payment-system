import Navbar from "../components/Navbar";
import { FaUserCircle, FaIdCard, FaEnvelope, FaPhone, FaAddressCard } from "react-icons/fa";
import { parseJwt } from "../utils/jwtHelper";

function Profile() {
  const token = localStorage.getItem("token");
  const claims = parseJwt(token) || {};

  const username = claims.sub || "Driver";
  const email = claims.email || "N/A";
  const nic = claims.nicNumber || "N/A";
  const phone = claims.phoneNumber || "N/A";

  return (
    <div className="min-h-screen text-[#eaf6ff]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <section className="page-rise rounded-[28px] border border-[#113a5a]/60 bg-[linear-gradient(135deg,rgba(17,51,80,0.88),rgba(4,24,40,0.9))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#07233f] text-[#9fcfff]">
              <FaUserCircle className="text-3xl" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#9fcfff]">Driver account</p>
              <h1 className="text-3xl font-extrabold tracking-wide text-[#eaf6ff]">{username}</h1>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              [FaIdCard, "Username", username],
              [FaAddressCard, "NIC", nic],
              [FaIdCard, "License No", "B" + (nic !== "N/A" ? nic.slice(-7) : "1234567")],
              [FaEnvelope, "Email", email],
              [FaPhone, "Phone", phone],
            ].map(([Icon, label, value]) => (
              <div key={label} className="rounded-[22px] border border-[#1f4f78]/60 bg-[#062033]/90 p-5 shadow-[0_18px_38px_rgba(0,0,0,0.24)]">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#9fcfff]">
                  <Icon className="text-[10px]" />
                  {label}
                </p>
                <p className="mt-2 text-lg font-semibold text-[#eaf6ff]">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;