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

  // GET LINKS
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

  // ADD LINK (OPTIMISTIC UI)
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

      // replace temp id with real id
      setLinks((prev) =>
        prev.map((l) =>
          l._id === tempLink._id ? res.data : l
        )
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  // TOGGLE (FAST UI)
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

  // DELETE (FAST UI)
  const deleteLink = async (id) => {
    setLinks((prev) => prev.filter((l) => l._id !== id));

    try {
      await axios.delete(`${API}/api/links/${id}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  // EDIT
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">⚡ Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/u/${username}`)}
            className="px-4 py-2 bg-purple-600 rounded-xl"
          >
            Public Page
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ADD LINK */}
      <div className="bg-white/10 p-5 rounded-2xl mb-8">
        <div className="flex gap-3">
          <input
            className="p-3 rounded-xl bg-black/40"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="p-3 rounded-xl bg-black/40"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addLink}
            className="px-5 py-3 bg-green-600 rounded-xl"
          >
            Add
          </button>
        </div>
      </div>

      {/* LINKS */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-5">
          {links.map((link, i) => (
            <motion.div
              key={link._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 p-5 rounded-2xl"
            >
              <div className="flex justify-between">
                <h3 className="font-bold">{link.title}</h3>

                <span className={link.isActive ? "text-green-400" : "text-red-400"}>
                  {link.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <p className="text-gray-300 mt-2">{link.url}</p>

              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => window.open(link.url)}
                  className="px-3 py-1 bg-blue-600 rounded"
                >
                  Open
                </button>

                <button
                  onClick={() => editLink(link._id, link.title, link.url)}
                  className="px-3 py-1 bg-yellow-600 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => toggleLink(link._id)}
                  className="px-3 py-1 bg-purple-600 rounded"
                >
                  Toggle
                </button>

                <button
                  onClick={() => deleteLink(link._id)}
                  className="px-3 py-1 bg-red-600 rounded"
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