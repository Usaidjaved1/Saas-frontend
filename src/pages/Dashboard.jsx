import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));
const profileId = user?._id;
const username = user?.username;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);

  const fetchLinks = async () => {
    const res = await axios.get(`http://localhost:5000/api/links/${profileId}`);
    setLinks(res.data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const addLink = async () => {
    await axios.post("http://localhost:5000/api/links", {
      profileId,
      title,
      url,
    });

    setTitle("");
    setUrl("");
    fetchLinks();
  };

  const toggleLink = async (id) => {
    await axios.patch(`http://localhost:5000/api/links/${id}/toggle`);
    setLinks((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, isActive: !l.isActive } : l
      )
    );
  };

  const deleteLink = async (id) => {
    await axios.delete(`http://localhost:5000/api/links/${id}`);
    fetchLinks();
  };

  // ✅ EDIT (RESTORED PROPERLY)
  const editLink = async (id, oldTitle, oldUrl) => {
    const newTitle = prompt("Edit Title", oldTitle);
    const newUrl = prompt("Edit URL", oldUrl);

    if (!newTitle || !newUrl) return;

    await axios.put(`http://localhost:5000/api/links/${id}`, {
      title: newTitle,
      url: newUrl,
    });

    fetchLinks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">⚡ Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/u/${username}`)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500"
          >
            Public Page
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ADD LINK */}
      <div className="bg-white/10 p-5 rounded-2xl mb-8">
        <h2 className="mb-3 text-lg">➕ Add Link</h2>

        <div className="flex gap-3 flex-wrap">
          <input
            className="p-3 rounded-xl bg-black/40 border border-gray-600"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="p-3 rounded-xl bg-black/40 border border-gray-600"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addLink}
            className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-500"
          >
            Add
          </button>
        </div>
      </div>

      {/* LINKS */}
      <div className="grid gap-5">
        {links.map((link, i) => (
          <motion.div
            key={link._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/10 p-5 rounded-2xl border border-white/10"
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{link.title}</h3>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  link.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {link.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <p className="text-gray-300 text-sm mt-2">{link.url}</p>

            <p className="text-xs text-gray-400 mt-1">
              Clicks: {link.clicks}
            </p>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-4 flex-wrap">

              <button
                onClick={() => window.open(link.url, "_blank")}
                className="px-3 py-1 bg-blue-600 rounded-lg"
              >
                Open
              </button>

              {/* 🔥 EDIT BUTTON (NOW BACK) */}
              <button
                onClick={() => editLink(link._id, link.title, link.url)}
                className="px-3 py-1 bg-yellow-600 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => toggleLink(link._id)}
                className="px-3 py-1 bg-purple-600 rounded-lg"
              >
                Toggle
              </button>

              <button
                onClick={() => deleteLink(link._id)}
                className="px-3 py-1 bg-red-600 rounded-lg"
              >
                Delete
              </button>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;