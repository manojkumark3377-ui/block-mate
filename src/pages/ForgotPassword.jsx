import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import logo from "../assets/images/logoo.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      toast.success(response.data.message);
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error("Please enter OTP and new password");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="inner-container" onSubmit={handleSubmit}>
        <div className="form-header">
          <img src={logo} alt="BløckMate Logo" className="form-logo" width="120" height="120" />
          <div className="header-text">
            <h1 className="brand">BløckMate</h1>
          </div>
        </div>
        <h2 className="form-title">Recover Password</h2>

        <div className="form-group">
          <label>Email</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="BløckMate@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="button"
              className="button"
              style={{ width: 'auto', padding: '0 15px', fontSize: '0.8rem' }}
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading && !otpSent ? "..." : "Send OTP"}
            </button>
          </div>
        </div>

        {otpSent && (
          <>
            <div className="form-group">
              <label>OTP</label>
              <input
                className="form-control"
                type="text"
                name="code"
                placeholder="200806"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="***********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="button"
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <div className="form-group" style={{ textAlign: 'center', marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '0.9rem', color: '#aaa', display: 'block', marginBottom: '10px' }}>
            Didn't receive the OTP?
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <a href="https://wa.me/919704341511" target="_blank" rel="noopener noreferrer" style={{
              color: '#d4e0d9ff',
              fontSize: '1rem',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(37, 211, 102, 0.1)',
              borderRadius: '20px',
              transition: 'all 0.3s ease'
            }}>
              <span>WhatsApp Chat</span> <span style={{ fontSize: '1.1rem' }}>→</span>
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#aaa', fontSize: '1.5rem' }}>or</span>
              <a href="https://www.instagram.com/venzenith_official?igsh=MWtxZ2doeXFtbmg1Zg==" target="_blank" rel="noopener noreferrer" style={{
                color: '#303131ff',
                fontSize: '0.95rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                @venzenith_official
              </a>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => navigate("/login")}>
            Back to Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
