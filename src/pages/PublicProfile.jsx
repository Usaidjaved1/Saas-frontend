import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "../public.css";

function PublicProfile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);

  const fetchData = async () => {
    try {
      const profileRes = await axios.get(
        `http://localhost:5000/api/profile/${username}`
      );

      setProfile(profileRes.data);

      const linksRes = await axios.get(
        `http://localhost:5000/api/links/public/${profileRes.data._id}`
      );

      setLinks(linksRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  const handleClick = async (id, url) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/links/${id}/click`
      );

      window.open(url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
      >

        {/* PROFILE IMAGE */}
        <motion.img
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          src={
            profile.profileImage ||
            "https://www.gravatar.com/avatar/?d=mp"
          }
          className="w-24 h-24 rounded-full mx-auto border-4 border-purple-500 shadow-lg"
          alt="profile"
        />

        {/* NAME */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-2xl font-bold mt-4"
        >
          {profile.fullName}
        </motion.h1>

        {/* BIO */}
        <p className="text-center text-gray-300 text-sm mt-2">
          {profile.bio || "No bio added yet"}
        </p>

        {/* LINKS */}
        <div className="mt-6 space-y-3">
          {links
            .filter((l) => l.isActive)
            .map((link, i) => (
              <motion.button
                key={link._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(139, 92, 246, 0.8)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(link._id, link.url)}
                className="w-full p-3 rounded-2xl bg-white/10 border border-white/20 text-white font-medium shadow-md hover:shadow-purple-500/30 transition"
              >
                🔗 {link.title}
              </motion.button>
            ))}
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Powered by Link Bio 🚀
        </p>
      </motion.div>

    </div>
  );
}

export default PublicProfile;