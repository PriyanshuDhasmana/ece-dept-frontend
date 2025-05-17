import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          // setMessage(data.message);
          setUser(data.user);
        } else {
          console.warn("User fetch error:", data.message || res.statusText);
        }
      } catch (err) {
        console.error(err);
        setMessage("Error fetching dashboard.");
      }
    };

    fetchDashboard();
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    }
  };

  const wordCount = content.trim().split(/\s+/).length;

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (wordCount > 200) {
      alert("Content must be under 200 words.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/dashboard/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (res.ok) {
        setTitle("");
        setContent("");
        setAnnouncements([data.announcement, ...announcements]);
      } else {
        alert(data.message || "Error posting announcement");
      }
    } catch (err) {
      console.error("Error posting announcement:", err);
      alert("Error posting announcement");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="dashboard-container">
      <h2>📢 Announcements Dashboard</h2>
      <p>{message}</p>

      {/* Check if user is an admin */}
      {user?.role === "admin" && (
        <form className="announcement-form" onSubmit={handlePostAnnouncement}>
          <input
            type="text"
            placeholder="Announcement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your announcement here... (max 200 words)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <small>{200 - wordCount} words remaining</small>
          <button type="submit">Post Announcement</button>
        </form>
      )}

      <div className="announcement-list">
        <h3>Recent Announcements</h3>
        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          announcements.map((a) => {
            const isExpanded = expandedId === a._id;
            return (
              <div
                key={a._id}
                className={`announcement-card ${isExpanded ? "expanded" : ""}`}
                onClick={() => toggleExpand(a._id)}
              >
                <h4>{a.title}</h4>
                <p>
                  {isExpanded
                    ? a.content
                    : `${a.content.split(" ").slice(0, 20).join(" ")}...`}
                </p>

                {!isExpanded && (
                  <div className="expand-hint">
                    Click to expand
                    <span className="down-arrow">▼</span>
                  </div>
                )}

                <div className="poster-info">
                  <div className="email">
                    <div className="avatar">
                      {a.postedBy?.email?.[0]?.toUpperCase() || "?"}
                    </div>
                    <span>{a.postedBy?.email || "Anonymous"}</span>
                  </div>
                  <span className="timestamp">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
