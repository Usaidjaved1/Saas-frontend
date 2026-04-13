import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white flex flex-col">
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4">
        <h1 className="text-3xl font-bold tracking-wide">LinkBio 🚀</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-xl hover:bg-white hover:text-black transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-black px-5 py-2 rounded-xl hover:bg-white hover:text-black transition"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-1 flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Your Links, One Place 🔥
        </h1>

        <p className="mt-4 text-lg max-w-xl text-gray-100">
          Create your own beautiful link page and share everything with just one URL.
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-black px-6 py-3 rounded-2xl font-semibold shadow-xl hover:scale-105 transition"
          >
            Start Now
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-white px-6 py-3 rounded-2xl hover:bg-white hover:text-black transition"
          >
            Login
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6 px-8 pb-12">
        <div className="bg-white text-black p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-bold">⚡ Fast Setup</h3>
          <p className="mt-2">Create your page in seconds with no hassle.</p>
        </div>

        <div className="bg-white text-black p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-bold">📊 Analytics</h3>
          <p className="mt-2">Track clicks and see your growth.</p>
        </div>

        <div className="bg-white text-black p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-bold">🎨 Custom Design</h3>
          <p className="mt-2">Make your profile look unique and attractive.</p>
        </div>
      </div>
    </div>
  );
}

