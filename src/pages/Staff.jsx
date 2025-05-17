import React, { useEffect, useState } from "react";
import "./Staff.css";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    qualifications: "",
    email: "",
    expertise1: "",
    expertise2: "",
    expertise3: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/staff");
        const data = await res.json();
        setStaffList(data);
      } catch {
        setError("Failed to fetch staff data.");
      } finally {
        setLoading(false);
      }
    })();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (decoded.role === "admin") setIsAdmin(true);
      } catch {}
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.position.trim()) {
      alert("Name and Position are required.");
      return;
    }

    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      fd.append(key, val);
    });
    if (imageFile) fd.append("image", imageFile);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/staff", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (res.ok) {
        setStaffList((s) => [...s, data.staff]);
        setFormData({
          name: "",
          position: "",
          qualifications: "",
          email: "",
          expertise1: "",
          expertise2: "",
          expertise3: "",
        });
        setImageFile(null);
      } else {
        alert(data.message || "Failed to add staff.");
        console.error(data.error);
      }
    } catch (err) {
      alert("Error submitting staff data.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading staff…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="staff-container">
      <h2 className="staff-title">Our Esteemed Staff</h2>

      {isAdmin && (
        <form
          className="staff-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <h3>Add New Staff</h3>
          <div className="form-row">
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              name="qualifications"
              placeholder="Qualifications (e.g., PhD, M.Tech)"
              value={formData.qualifications}
              onChange={handleInputChange}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input name="image" type="file" onChange={handleFileChange} />
          </div>
          <div className="form-row">
            <input
              name="expertise1"
              placeholder="Expertise 1"
              value={formData.expertise1}
              onChange={handleInputChange}
            />
            <input
              name="expertise2"
              placeholder="Expertise 2"
              value={formData.expertise2}
              onChange={handleInputChange}
            />
            <input
              name="expertise3"
              placeholder="Expertise 3"
              value={formData.expertise3}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Add Staff</button>
        </form>
      )}

      <div className="staff-grid">
        {staffList.map((staff) => (
          <div key={staff._id} className="staff-card">
            {staff.image && (
              <img
                src={`http://localhost:5000${staff.image}`}
                alt={staff.name}
              />
            )}
            <div className="staff-info">
              <h3>{staff.name}</h3>
              <p>{staff.position}</p>
              {staff.qualifications && (
                <p> {staff.qualifications}</p>
              )}
              <p>
                
                <a href={`mailto:${staff.email}`} className="email-link">
                  {staff.email}
                </a>
              </p>
              {staff.expertise?.length > 0 && (
                <>
                  <strong>Expertise:</strong>
                  <ul>
                    {staff.expertise.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staff;
