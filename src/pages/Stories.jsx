import React, { useEffect, useState } from "react";
import "./Stories.css";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [modalStory, setModalStory] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [files, setFiles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  useEffect(() => {
    // Check login status based on token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.role === "admin") setIsAdmin(true);
        setIsLoggedIn(true); // User is logged in
      } catch {}
    }

    // Fetch stories
    fetch("http://localhost:5000/api/stories")
      .then((res) => res.json())
      .then(setStories)
      .catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    const chosen = Array.from(e.target.files);
    if (chosen.length > 3) {
      alert("Maximum 3 images allowed");
    } else {
      setFiles(chosen);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Word count check
    if (form.content.trim().split(/\s+/).length > 400) {
      alert("Content must be under 400 words");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    files.forEach((f) => fd.append("images", f));

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/stories", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();
    if (res.ok) {
      setStories([data.story, ...stories]);
      setForm({ title: "", content: "" });
      setFiles([]);
    } else {
      alert(data.message || "Failed to post story");
    }
  };

  return (
    <div className="stories-container">
      <h1>Stories</h1>
      <p>Experiences and journeys shared by our community</p>

      {/* Show the form only if the user is logged in */}
      {isLoggedIn && (
        <form className="story-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title (max 150 chars)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={150}
            required
          />
          <textarea
            placeholder="Write story (max 400 words)..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          <button type="submit">Post Story</button>
        </form>
      )}

      <div className="story-grid">
        {stories.map((s) => (
          <div key={s._id} className="story-card" onClick={() => setModalStory(s)}>
            <div className="card-img-wrapper">
              <img
                src={`http://localhost:5000${s.images[0]}`}
                alt="thumb"
                className="card-img"
              />
            </div>
            <div className="card-info">
              <h3 className="story-title">{s.title}</h3>
              <p>{s.content.split(" ").slice(0, 20).join(" ")}...</p>
              <div className="card-meta">
                <span>By: {s.uploader}</span>
                <span>{new Date(s.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalStory && (
        <div className="modal" onClick={() => setModalStory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setModalStory(null)}>×</button>
            <div className="modal-images">
              {modalStory.images.map((img, i) => (
                <img key={i} src={`http://localhost:5000${img}`} alt={`img-${i}`} />
              ))}
            </div>
            <h2 className="modal-title">{modalStory.title}</h2>
            <p className="modal-text">{modalStory.content}</p>
            <div className="modal-meta">
              <span>By: {modalStory.uploader}</span>
              <span>{new Date(modalStory.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
