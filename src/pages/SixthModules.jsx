import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";

const SixthModules = () => {
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('blogData') || '{}');
  const isAdmin = authData?.role === 'admin';

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const semesterName = "Sixth Semester";

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/subjects?semester=${encodeURIComponent(semesterName)}`);
      setSubjects(res.data);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    const title = prompt("Enter Subject Title:");
    if (!title) return;

    try {
      await api.post("/subjects", {
        title,
        semester: semesterName,
        order: subjects.length + 1
      });
      toast.success("Subject added successfully");
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add subject");
    }
  };

  const handleDeleteSubject = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure? This will delete the subject and ALL its modules/questions!")) return;

    try {
      await api.delete(`/subjects/${id}`);
      toast.success("Subject deleted");
      fetchSubjects();
    } catch (error) {
      toast.error("Failed to delete subject");
    }
  };

  function handleSemesterClick(title) {
    navigate(`/subject/${encodeURIComponent(title)}`);
  }

  const filteredSubjects = subjects.filter(sub =>
    sub.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="formm-title">Visvesvaraya Technological University</h2>

      <input
        className="search-input"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search subjects..."
        style={{ marginBottom: "40px" }}
      />

      <div className="page-header">
        <h3 className="table-title" style={{ margin: 0 }}>{search ? "Matching Subjects" : semesterName}</h3>
        <button
          className="button"
          onClick={handleAddSubject}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <FaPlus /> Add Subject
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <div className="flexbox-container">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((sub) => (
              <div key={sub._id} style={{ position: "relative" }}>
                <button className="post-card" onClick={() => handleSemesterClick(sub.title)} style={{ width: "100%", height: "100%" }}>
                  <h4 className="card-title">{sub.title}</h4>
                </button>
                {isAdmin && (

                  <button
                    onClick={(e) => handleDeleteSubject(e, sub._id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(255, 0, 0, 0.1)",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px",
                      cursor: "pointer",
                      color: "#ff4444",
                      zIndex: 10
                    }}
                    title="Delete Subject"
                  >
                    <FaTrash />
                  </button>

                )}
              </div>
            ))
          ) : (
            <p style={{ width: "100%", textAlign: "center" }}>No subjects found matching "{search}"</p>
          )}
        </div>
      )}


    </div>
  );
};
export default SixthModules;