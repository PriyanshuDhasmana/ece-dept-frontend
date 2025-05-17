import React, { useEffect, useState } from "react";
import "./Achievements.css";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAchievements();
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user));
    }
  }, []);

  const fetchAchievements = async () => {
    const res = await fetch("http://localhost:5000/api/achievements");
    const data = await res.json();
    setAchievements(data);
  };

  const handlePost = async (e) => {
    e.preventDefault();

    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 200) {
      alert("Description must be 200 words or fewer.");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/achievements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();
    if (res.ok) {
      setTitle("");
      setDescription("");
      setAchievements([data.achievement, ...achievements]);
    } else {
      alert(data.message || "Error posting achievement");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="achievements-container">
      <h2>🏆 Achievements</h2>

      {isAdmin && (
        <form className="achievement-form" onSubmit={handlePost}>
          <input
            type="text"
            placeholder="Achievement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (max 200 words)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Post Achievement</button>
        </form>
      )}

      <div className="achievement-list">
        {achievements.map((a) => {
          const isExpanded = expandedId === a._id;
          const firstLine = a.description.split("\n")[0];

          return (
            <div
              key={a._id}
              className={`achievement-card ${isExpanded ? "expanded" : ""}`}
              onClick={() =>
                setExpandedId(isExpanded ? null : a._id)
              }
            >
              <h4>{a.title}</h4>
              <p>
                {isExpanded ? a.description : firstLine}
              </p>
              <span className="timestamp">
                Posted by: {a.postedBy?.email || "Anonymous"} on{" "}
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
