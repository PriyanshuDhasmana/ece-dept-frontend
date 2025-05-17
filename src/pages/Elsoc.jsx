import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Elsoc.css";

const BACKEND = "http://localhost:5000";

const ELSOC = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    poster: null,
    description: "",
    date: "",
    time: "",
    venue: "",
    formLink: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    fetchEvents();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { role } = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(role === "admin");
      } catch {}
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      events.forEach((evt) => {
        updated[evt._id] = formatCountdown(evt.date, evt.time);
      });
      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const formatCountdown = (dateStr, timeStr) => {
    const now = new Date();
    const eventTime = new Date(`${dateStr}T${timeStr}`);
    const diff = eventTime - now;

    if (diff <= 0) return "Event Started";

    const mins = Math.floor((diff / 1000 / 60) % 60);
    const hrs = Math.floor((diff / 1000 / 60 / 60) % 24);
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);

    return `${days} Day${days !== 1 ? "s" : ""}, ${hrs} Hr${
      hrs !== 1 ? "s" : ""
    }, ${mins} Min${mins !== 1 ? "s" : ""}`;
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/elsoc`);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch ELSOC events:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "poster") {
      setFormData((f) => ({ ...f, poster: files[0] }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v != null) data.append(k, v);
      });

      await axios.post(`${BACKEND}/api/elsoc`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        title: "",
        poster: null,
        description: "",
        date: "",
        time: "",
        venue: "",
        formLink: "",
      });
      fetchEvents();
    } catch (err) {
      console.error("Failed to submit ELSOC event:", err);
      alert("Failed to submit event");
    }
  };

  return (
    <div className="elsoc-page">
      <h2 className="elsoc-title">ELSOC ‒ Electronics Society</h2>
      <p className="elsoc-subtitle">
        Explore ELSOC initiatives, activities, and projects.
      </p>

      {isAdmin && (
        <form className="elsoc-form" onSubmit={handleSubmit}>
          <h3>Add New Event</h3>

          <label>Title of the Event:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Poster of the Event:</label>
          <input
            type="file"
            name="poster"
            accept="image/*"
            onChange={handleChange}
            required
          />

          <label>Description of the Event:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <div className="inline-inputs">
            <div>
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Time:</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Venue:</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />

          <label>Google Form Link:</label>
          <input
            type="url"
            name="formLink"
            value={formData.formLink}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit Event</button>
        </form>
      )}

      <div className="elsoc-events">
        {events.map((evt) => (
          <div className="elsoc-card" key={evt._id}>
            {evt.poster && (
              <div className="event-poster-container">
                <img
                  src={`${BACKEND}${evt.poster}`}
                  alt={evt.title}
                  className="event-poster"
                />
              </div>
            )}
            <div className="event-title">{evt.title}</div>
            <div className="event-details">
              <p>{evt.description}</p>
              <p>
                <strong>Date:</strong> {evt.date}
              </p>
              <p>
                <strong>Time:</strong> {evt.time}
              </p>
              <p>
                <strong>Venue:</strong> {evt.venue}
              </p>
              <a
                href={evt.formLink}
                className="event-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register via Google Form
              </a>
              <p className="countdown">{countdowns[evt._id]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="elsoc-connect">
        <h3>Connect with Us</h3>
        <div className="social-icons">
          <a
            href="https://www.instagram.com/elsocbmsce?igsh=MWgwbjAxMjA0YXJzag=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/electronics-society-bmsce/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>

      <div className="elsoc-core">
        {[2025, 2024, 2023].map((year) => (
          <details key={year} className="core-team-section">
            <summary>ELSOC CORE TEAM {year}</summary>
            <div className="core-team-content">
              <p>
                You will soon find the ELSOC team members for {year}{" "}
                here
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default ELSOC;
