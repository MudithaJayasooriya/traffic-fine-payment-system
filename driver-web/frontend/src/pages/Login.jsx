import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaShieldAlt } from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 text-[#f7ebda]">

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(89,166,255,0.06),transparent_32%),linear-gradient(180deg,#061226_0%,#021022_100%)]" />

      <form
        onSubmit={handleLogin}
        className="page-rise w-full max-w-md rounded-[28px] border border-[#164e70]/60 bg-[#07223a]/85 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#4aa3ff]/40 bg-[#072b46] text-[#9fcfff] shadow-[0_12px_28px_rgba(0,0,0,0.18)] float-soft">
          <FaShieldAlt className="text-xl" />
        </div>

        <p className="mb-2 text-center text-xs uppercase tracking-[0.35em] text-[#d7a46b]">
          Welcome back
        </p>

        <h2 className="text-center text-3xl font-extrabold tracking-wide text-[#fff6ea]">
          Driver Login
        </h2>

        <p className="mt-3 text-center text-sm text-[#d3bfa8]">
          Sign in to view your fines, payments, and alerts.
        </p>

        <input
          type="text"
          placeholder="Username"
          className="mt-8 mb-4 w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-2xl border border-[#214f73] bg-[#06223b] px-4 py-3 text-[#eaf6ff] outline-none transition placeholder:text-[#aacde9] focus:border-[#5aa3ff] focus:ring-2 focus:ring-[#5aa3ff]/25"
        />

        <button
          className="group w-full rounded-2xl border border-[#2b6fb0]/50 bg-[#4aa3ff] px-4 py-3 font-bold text-[#021022] shadow-[0_16px_30px_rgba(74,163,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#66b8ff]"
        >
          <span className="inline-flex items-center justify-center gap-2">
            Login
            <FaArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </button>

        <p className="mt-5 text-center text-sm text-[#b89f8b]">
          Use the same portal account you received from the traffic office.
        </p>

      </form>
    </div>
  );
}

export default Login;