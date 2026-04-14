import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API = "https://saas-backend-production-acf1.up.railway.app";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profileId = user?._id;
  const username = user?.username;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLinks = async () => {
    if (!profileId) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/links/${profileId}`);
      setLinks(res.data || []);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [profileId]);

  const addLink = async () => {
    if (!title || !url) return;

    const tempLink = {
      _id: Date.now(),
      title,
      url,
      isActive: true,
      clicks: 0,
    };

    setLinks((prev) => [tempLink, ...prev]);
    setTitle("");
    setUrl("");

    try {
      const res = await axios.post(`${API}/api/links`, {
        profileId,
        title,
        url,
      });

      setLinks((prev) =>
        prev.map((l) => (l._id === tempLink._id ? res.data : l))
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const toggleLink = async (id) => {
    setLinks((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, isActive: !l.isActive } : l
      )
    );

    try {
      await axios.patch(`${API}/api/links/${id}/toggle`);
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteLink = async (id) => {
    setLinks((prev) => prev.filter((l) => l._id !== id));

    try {
      await axios.delete(`${API}/api/links/${id}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  const editLink = async (id, oldTitle, oldUrl) => {
    const newTitle = prompt("Edit Title", oldTitle);
    const newUrl = prompt("Edit URL", oldUrl);

    if (!newTitle || !newUrl) return;

    setLinks((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, title: newTitle, url: newUrl } : l
      )
    );

    try {
      await axios.put(`${API}/api/links/${id}`, {
        title: newTitle,
        url: newUrl,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">⚡ Dashboard</h1>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate(`/u/${username}`)}
            className="px-4 py-2 bg-purple-600 rounded-xl w-full sm:w-auto"
          >
            Public Page
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 rounded-xl w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ADD LINK */}
      <div className="bg-white/10 p-4 sm:p-5 rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          
          <input
            className="w-full p-3 rounded-xl bg-black/40 border border-gray-600"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl bg-black/40 border border-gray-600"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addLink}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 rounded-xl font-semibold"
          >
            Add
          </button>

        </div>
      </div>

      {/* LINKS */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid gap-4 sm:gap-5">
          {links.map((link) => (
            <motion.div
              key={link._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 p-4 sm:p-5 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <h3 className="font-bold break-words">{link.title}</h3>

                <span
                  className={`text-sm ${
                    link.isActive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {link.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <p className="text-gray-300 mt-2 break-all text-sm sm:text-base">
                {link.url}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">

                <button
                  onClick={() => window.open(link.url)}
                  className="px-3 py-1 bg-blue-600 rounded text-sm"
                >
                  Open
                </button>

                <button
                  onClick={() => editLink(link._id, link.title, link.url)}
                  className="px-3 py-1 bg-yellow-600 rounded text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => toggleLink(link._id)}
                  className="px-3 py-1 bg-purple-600 rounded text-sm"
                >
                  Toggle
                </button>

                <button
                  onClick={() => deleteLink(link._id)}
                  className="px-3 py-1 bg-red-600 rounded text-sm"
                >
                  Delete
                </button>

              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;