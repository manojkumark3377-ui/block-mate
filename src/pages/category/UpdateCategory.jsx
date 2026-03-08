import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateCategory = ({ categoryId, onBack }) => {
  const [formData, setFormData] = useState({ title: "", desc: "" });
  const [loading, setLoading] = useState(false);
  const { id: routeId } = useParams();
  const id = categoryId || routeId;
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/categories/${id}`);
        setFormData({
          title: res.data.title,
          desc: res.data.desc || ""
        });
      } catch (error) {
        toast.error("Failed to fetch question details");
      }
    };
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/v1/categories/${id}`, formData);
      toast.success("Question updated successfully");
      if (onBack) {
        onBack();
      } else {
        navigate("/categories");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={onBack ? onBack : () => navigate("/categories")} className="button button-block">
        Go Back
      </button>
      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Update Question</h2>
          <div className="form-group">
            <label>Question</label>
            <input
              className="form-control"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="what is Data Structure?"
            />
          </div>

          <div className="form-group">
            <label>Answer</label>
            <textarea
              className="form-control"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Answer"
            ></textarea>
          </div>

          <div className="form-group">
            <input
              className="button"
              type="submit"
              value={loading ? "Updating..." : "Update"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
