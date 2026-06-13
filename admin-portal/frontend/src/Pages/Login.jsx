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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <FaUserShield className="text-white text-3xl" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Admin Portal
          </h1>

          <p className="text-gray-500 mt-2">
            Traffic Fine Payment System
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-medium">
              Username
            </label>

            <div className="flex items-center border rounded-lg px-3">
              <FaUserShield className="text-gray-400" />

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className="w-full p-3 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-3">
              <FaLock className="text-gray-400" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full p-3 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Demo Login
          <br />
          Username: <strong>admin123</strong>
          <br />
          Password: <strong>12345</strong>
        </div>

      </div>
    </div>
  );
}

export default Login;