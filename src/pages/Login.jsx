import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://saas-backend-production-acf1.up.railway.api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login success 🚀");
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">

      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-[360px] border border-white/20">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* EMAIL */}
        <input
          className="w-full p-3 mb-3 rounded-xl outline-none bg-white/60 focus:ring-2 focus:ring-purple-500 transition"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full p-3 mb-4 rounded-xl outline-none bg-white/60 focus:ring-2 focus:ring-purple-500 transition"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-105 ${
            loading
              ? "bg-gray-500"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
          } text-white`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* LINK */}
        <p className="text-center text-white mt-4 text-sm">
          Don’t have an account?
          <span
            className="text-yellow-300 cursor-pointer ml-1 hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}