import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      formData.username === "admin123" &&
      formData.password === "12345"
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse at center, #0f2744 0%, #0a1628 100%)" }}>

      <div className="w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>

        {/* Icon */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-5">
            <div className="p-4 rounded-2xl"
              style={{ backgroundColor: "#1a3a5c" }}>
              <FaUserShield className="text-blue-400 text-3xl" />
            </div>
          </div>

          <p className="text-xs font-semibold tracking-widest mb-1"
            style={{ color: "#f0a500" }}>
            WELCOME BACK
          </p>

          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Portal
          </h1>

          <p className="text-sm" style={{ color: "#8baabf" }}>
            Traffic Fine Payment System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-400 text-sm text-center p-3 rounded-lg mb-4"
            style={{ backgroundColor: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl text-white outline-none placeholder-gray-400"
              style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl text-white outline-none placeholder-gray-400"
              style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#3b82f6" }}>
            Login →
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs" style={{ color: "#8baabf" }}>
          Use the same portal account you received from the traffic office.
          <br /><br />
          Demo: <strong className="text-white">admin123</strong> / <strong className="text-white">12345</strong>
        </div>

      </div>
    </div>
  );
}

export default Login;