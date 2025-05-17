import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import eceLogo from "../media/ECE-Photoroom-Photoroom.png";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);
  const isHome = location.pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Fetch user info
  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch(console.error);
    }
  }, [token]);

  // Scroll listener
  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className={`navbar ${isHome ? "transparent-navbar" : ""} ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={eceLogo} alt="ECE Logo" className="logo-image" />
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`bar ${menuOpen ? "open" : ""}`} />
          <div className={`bar ${menuOpen ? "open" : ""}`} />
          <div className={`bar ${menuOpen ? "open" : ""}`} />
        </div>

        <div className={`navbar-links ${menuOpen ? "show" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/staff" onClick={() => setMenuOpen(false)}>
            Staff
          </Link>
          <Link to="/alumni-connect" onClick={() => setMenuOpen(false)}>
            Alumni Connect
          </Link>
          <Link to="/elsoc" onClick={() => setMenuOpen(false)}>
            ELSOC
          </Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
          {isLoggedIn && (
            <>
              
              <Link to="/achievements" onClick={() => setMenuOpen(false)}>
                Achievements
              </Link>
            </>
          )}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="login-btn"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
