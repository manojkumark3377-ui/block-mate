import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../assets/css/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("blogData");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || parsed);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  }, [location]);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    window.localStorage.removeItem("blogData");
    setUser(null);
    navigate("/login");
  };

  const hideOn = ["/", "/login", "/signup", "/forgot-password"];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/home" className="nav-logo-link">
          <img src={logo} alt="Logo" className="nav-logo-img" />
          <span className="nav-brand-text">BløckMate</span>
        </Link>
      </div>

      <div className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
        <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
        <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
      </div>

      <div className={`nav-right ${menuOpen ? 'active' : ''}`}>
        {!user ? (
          <>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/setting" className="nav-link">Settings</Link>

            <Link to="/profile" className="nav-link user-profile-link">
              <span style={{ fontSize: '0.9rem' }}>👤</span>
              {user.name || user.username || user.email}
            </Link>

            <button className="logout-button-nav" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
