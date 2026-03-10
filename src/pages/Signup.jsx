import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import signupValidator from "../validators/signupvalidator";
import logo from "../assets/images/logoo.jpeg";
import api from "../utils/api";
const initialFormData = {
  name: "",
  dob: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const initialFormError = {
  name: "",
  dob: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = signupValidator({
      name: formData.name,
      dob: formData.dob,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    if (
      errors.name ||
      errors.dob ||
      errors.email ||
      errors.password ||
      errors.confirmPassword
    ) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
        //api request
        const requestBody = {
          name: formData.name,
          dob: formData.dob,
          email: formData.email,
          password: formData.password,
        }
        const response = await api.post("/auth/signup", requestBody);
        const data = response.data;
        // persist returned auth data (token + user fields) so app can use it
        try {
          window.localStorage.setItem("blogData", JSON.stringify(data));
        } catch (e) {
          console.warn('Failed to write blogData to localStorage', e);
        }

        toast.success(data.message || "Details Saved", {
          position: "top-right",
          autoClose: 3000
        });
        // after signup, redirect to login (or home if you prefer)
        navigate('/login');
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const data = error.response?.data || { message: error.message };
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000
        });
        console.log(error.message);

      }
    }
    console.log(formData);
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
        <h2 className="form-title">SignUp</h2>

        <div className="form-group">
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="BløckMate"
            value={formData.name}
            onChange={handleChange}
          />
          {formError.name && <span className="error">{formError.name}</span>}
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            className="form-control"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {formError.dob && <span className="error">{formError.dob}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            name="email"
            placeholder="BløckMate@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
          {formError.email && <span className="error">{formError.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="***********"
            value={formData.password}
            onChange={handleChange}
          />
          {formError.password && (
            <span className="error">{formError.password}</span>
          )}
        </div>

        <div className="form-group">
          <label>Confirm password</label>
          <input
            className="form-control"
            type="password"
            name="confirmPassword"
            placeholder="***********"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {formError.confirmPassword && (
            <span className="error">{formError.confirmPassword}</span>
          )}
        </div>

        <div className="form-group">
          <input className="button" type="submit" value={loading ? "Saving..." : "Signup"} />
        </div>

        <div className="form-group">
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </form>
    </div>
  );
};


export default Signup;
