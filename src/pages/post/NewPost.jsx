import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NewPost = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/categories");
        setCategories(res.data);
      } catch (error) {
        toast.error("Failed to fetch questions");
      }
    };
    fetchCategories();
  }, []);
  const handleFileChange = async (e) => {
    console.log(e.target.files)
    const formInput = new FormData();
    formInput.append("file", e.target.files[0]);
    const type = e.target.files[0].type;
    

  }

  return (
    <div>
      <Link to="/posts" className="button button-block">Go Back</Link>
      <div className="form-container">
        <form className="inner-container">
          <h2 className="form-title">New Post</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="React blog post"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              type="text"
              name="desc"
              placeholder="Lorem ipsum"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Select an image</label>
            <input
              className="form-control"
              type="file"
              name="file"
              placeholder="Lorem ipsum"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label>Select a question</label>
            <select className="form-control" name="category">
              <option value="">Select Question</option>
              {categories.map((category) => (
                <option key={category._id} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input className="button" type="submit" value="Add" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
