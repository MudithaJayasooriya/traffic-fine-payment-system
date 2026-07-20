import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import API from "../api/axiosInstance";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoggedIn");

    try {
      const response = await API.post("/auth/login", formData);

      if (response.data && response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError("Invalid server configuration mapping.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Username or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#021022]">
      <div className="w-full max-w-md rounded-3xl p-8 bg-[#07223a]/90 border border-[#164e70] shadow-2xl shadow-black/50 backdrop-blur-xl">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-[#072b46] border border-[#4aa3ff]/40 text-[#4aa3ff]">
              <FaUserShield className="text-3xl" />
            </div>
          </div>
          <p className="text-xs font-semibold tracking-widest text-[#d7a46b] mb-1">WELCOME BACK</p>
          <h1 className="text-3xl font-bold text-[#fff6ea] tracking-wide mb-1">Admin Portal</h1>
          <p className="text-sm text-[#aacde9]">Traffic Fine Management System</p>
        </div>

        {error && (
          <div className="text-[#ff8a8a] text-sm text-center p-3 rounded-xl mb-5 bg-red-950/40 border border-red-800/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#9fcaff] mb-1.5">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              className="w-full px-4 py-3 rounded-xl text-[#eaf6ff] bg-[#06223b] border border-[#214f73] focus:border-[#5aa3ff] outline-none placeholder-[#aacde9]/50 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9fcaff] mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl text-[#eaf6ff] bg-[#06223b] border border-[#214f73] focus:border-[#5aa3ff] outline-none placeholder-[#aacde9]/50 transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-[#021022] bg-[#4aa3ff] hover:bg-[#5aa3ff] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#4aa3ff]/20 mt-2">
            {loading ? "Authenticating..." : "Sign In to Dashboard →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;