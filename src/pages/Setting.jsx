import React, { useState } from "react";
import logo from "../assets/images/logoo.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Setting = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const raw = window.localStorage.getItem("blogData");
      if (!raw) {
        toast.error("Auth session not found");
        return;
      }
      const token = JSON.parse(raw).token;

      await axios.put("/api/v1/auth/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Password updated successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to change password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-actions" style={{ padding: '20px', display: 'flex', gap: '15px' }}>
        <button className="button" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
          ← Go Back
        </button>
      </div>

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <div className="form-header">
            <img src={logo} alt="Logo" className="form-logo" />
            <div className="header-text">
              <h1 className="brand">BløckMate</h1>
            </div>
          </div>
          <h2 className="form-title">Security Settings</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '25px', fontSize: '0.9rem' }}>
            Ensure your account is using a strong password to stay secure.
          </p>

          <div className="form-group">
            <label>Current Password</label>
            <input
              className="form-control"
              type="password"
              name="oldPassword"
              placeholder="••••••••••••"
              value={passwords.oldPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              className="form-control"
              type="password"
              name="newPassword"
              placeholder="••••••••••••"
              value={passwords.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              className="form-control"
              type="password"
              name="confirmPassword"
              placeholder="••••••••••••"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              className="button"
              type="submit"
              value={loading ? "Changing..." : "Update Password"}
              disabled={loading}
              style={{ width: '100%', marginTop: '10px' }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setting;
