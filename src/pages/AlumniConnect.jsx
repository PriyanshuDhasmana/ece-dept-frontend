import React, { useEffect, useState, useRef } from "react";
import "./AlumniConnect.css";

const AlumniConnect = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    linkedin: "",
    position: "",
    organization: "",
    batch: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const countRef = useRef(null);

  useEffect(() => {
    // Fetch alumni list
    fetch("http://localhost:5000/api/alumni")
      .then((r) => r.json())
      .then(setList)
      .catch(() => setError("Failed to load alumni"))
      .finally(() => setLoading(false));

    // Check if admin
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.role === "admin") setIsAdmin(true);
      } catch {}
    }

    // Simple count-up animation on load
    let current = 0;
    const target = 6000;
    const interval = setInterval(() => {
      current += 60;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      if (countRef.current) {
        countRef.current.textContent = `${current}+`;
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onFile = (e) => setImageFile(e.target.files[0]);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    if (imageFile) fd.append("image", imageFile);

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/alumni", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();
    if (res.ok) {
      setList([data.alumni, ...list]);
      setForm({
        name: "",
        email: "",
        linkedin: "",
        position: "",
        organization: "",
        batch: "",
      });
      setImageFile(null);
    } else {
      alert(data.message || "Error");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="alumni-container">
      <h2>Alumni Connect</h2>
      <p>Reunite & network with our graduates.</p>

      {isAdmin && (
        <form
          className="alumni-form"
          onSubmit={submit}
          encType="multipart/form-data"
        >
          <h3>Add Alumni</h3>
          <div className="row">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={onChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="row">
            <input
              name="linkedin"
              placeholder="LinkedIn URL"
              value={form.linkedin}
              onChange={onChange}
              required
            />
          </div>
          <div className="row">
            <input
              name="position"
              placeholder="Position"
              value={form.position}
              onChange={onChange}
              required
            />
            <input
              name="organization"
              placeholder="Organization"
              value={form.organization}
              onChange={onChange}
              required
            />
          </div>
          <div className="row">
            <input
              name="batch"
              placeholder="Batch (e.g. 2021)"
              value={form.batch}
              onChange={onChange}
              required
            />
            <input name="image" type="file" onChange={onFile} />
          </div>
          <button type="submit">Save Alumni</button>
        </form>
      )}

      <div className="alumni-highlight">
        <div className="highlight-section left">
          <span ref={countRef} className="alumni-count">
            0+
          </span>
          <p>proud alumni since 1971</p>
        </div>
        <div className="highlight-line" />
        <div className="highlight-section right">
          <p>Are you one of them?</p>
          <a href="#connect" className="connect-link">
            Connect Now
          </a>
        </div>
      </div>

      <div className="alumni-grid">
        {list.map((a) => (
          <div key={a._id} className="alumni-card">
            {a.image && (
              <img src={`http://localhost:5000${a.image}`} alt={a.name} />
            )}
            <div className="info">
              <h3>{a.name}</h3>
              <p>
                <strong>{a.position}</strong> @ {a.organization}
              </p>
              <p>Batch of {a.batch}</p>
              <p>
                <a href={`mailto:${a.email}`}>{a.email}</a>
              </p>
              <a
                href={a.linkedin}
                target="_blank"
                rel="noopener"
                className="linkedin-btn"
              >
                View LinkedIn
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniConnect;
