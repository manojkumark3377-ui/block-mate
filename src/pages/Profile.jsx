import React, { useEffect, useState } from "react";
import logo from "../assets/images/logoo.jpeg";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const raw = window.localStorage.getItem("blogData");
        if (!raw) {
          setFetching(false);
          return;
        }
        const parsed = JSON.parse(raw);
        const token = parsed.token;

        if (token) {
          const response = await api.get("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Safer date formatting
          let formattedDate = "";
          if (response.data.dob) {
            const dateObj = new Date(response.data.dob);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0];
            }
          }

          setFormData((prev) => ({
            ...prev,
            name: response.data.name || "",
            email: response.data.email || "",
            dob: formattedDate,
          }));
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
        // Fallback to local storage if API fails
        const raw = window.localStorage.getItem("blogData");
        if (raw) {
          const parsed = JSON.parse(raw);
          const user = parsed.user || parsed;
          let formattedDate = "";
          if (user.dob) {
            const dateObj = new Date(user.dob);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0];
            }
          }
          setFormData((prev) => ({
            ...prev,
            name: user.name || "",
            email: user.email || ""
          }));
        }
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const raw = window.localStorage.getItem("blogData");
      if (!raw) {
        toast.error("Auth session not found. Please log in again.");
        return;
      }
      const parsed = JSON.parse(raw);
      const token = parsed.token;

      // Filter out empty password so we don't accidentally reset it to empty string
      const updatePayload = { ...formData };
      if (!updatePayload.password || updatePayload.password.trim() === "") {
        delete updatePayload.password;
      }

      const response = await api.put("/auth/profile", updatePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage with flat-merged response data
      // This ensures token and user fields are both at top level and nested if needed
      const updatedData = { ...parsed, ...response.data, user: response.data };
      window.localStorage.setItem("blogData", JSON.stringify(updatedData));

      toast.success("Profile updated successfully");

      // Clear password field after successful update
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Profile update error:", error.response || error);
      const message = error.response?.data?.message || error.message;
      toast.error(`Update failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-container"><div className="loader"></div></div>;

  return (
    <div>
      <button className="button button-block" onClick={() => navigate(-1)}>
        Go Back
      </button>

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <div className="form-header">
            <img src={logo} alt="Logo" className="form-logo" />
            <div className="header-text">
              <h1 className="brand">BløckMate</h1>
            </div>
          </div>
          <h2 className="form-title">Update Profile</h2>

          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>



          <div className="form-group">
            <input
              className="button"
              type="submit"
              style={{ width: '100%' }}
              value={loading ? "Updating..." : "Update Profile"}
              disabled={loading}
            />
          </div>
        </form>
      </div>

      <style jsx>{`
        .loading-container {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #0084ffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
