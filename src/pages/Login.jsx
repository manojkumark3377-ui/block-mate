import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import loginValidator from "../validators/loginvalidator";
import logo from "../assets/images/logoo.jpeg";
import api from "../utils/api";

const initialFormData = {
  email: "",
  password: "",
};

const initialFormError = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = loginValidator({
      email: formData.email,
      password: formData.password,
    });
    if (
      errors.email ||
      errors.password
    ) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
        //api request
        const requestBody = {
          email: formData.email,
          password: formData.password,
        };
        const response = await api.post("/auth/login", requestBody);
        const data = response.data;

        // persist returned auth data (token + user fields)
        try {
          window.localStorage.setItem("blogData", JSON.stringify(data));
        } catch (e) {
          console.warn('Failed to write blogData to localStorage', e);
        }
        navigate("/home");
        toast.success(data.message || "Details Saved", {
          position: "top-right",
          autoClose: 3000
        });

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
          <img src={logo} alt="Venzenth Logo" className="form-logo" />
          <div className="header-text">
            <h1 className="brand">BløckMate</h1>
          </div>
        </div>
        <h2 className="form-title">Login</h2>

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

        <Link className="forgot-password" to="/forgot-password">
          Forgot Password
        </Link>

        <div className="form-group">
          <input className="button" type="submit" value={loading ? "Logging In..." : "Login"} />
        </div>

        <div className="form-group">
          <span>
            Don't have an account? <Link to="/signup">Signup</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
