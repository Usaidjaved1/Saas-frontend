import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        email,
        password,
      });

      alert("Signup success! 🎉");

      // ✅ correct flow
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-96 shadow-xl">
        
        <h2 className="text-2xl font-bold mb-5 text-center">
          Create Account 🚀
        </h2>

        <input
          className="w-full p-2 mb-3 rounded bg-black/40 text-white"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 rounded bg-black/40 text-white"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 rounded bg-black/40 text-white"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signup}
          className="w-full bg-white text-black py-2 rounded-xl font-semibold hover:scale-105 transition"
        >
          Signup
        </button>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-2 border border-white py-2 rounded-xl"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 text-sm text-gray-400"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}