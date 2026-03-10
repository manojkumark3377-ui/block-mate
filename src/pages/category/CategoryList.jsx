import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import FileSection from "../../components/FileSection";

const QuestionAccordionItem = ({ category, onUpdate, onDelete, isAdmin, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      marginBottom: "16px",
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: isOpen ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      transition: "all 0.3s ease"
    }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          cursor: "pointer",
          backgroundColor: isOpen ? "#f8fafc" : "#ffffff",
          transition: "background-color 0.2s ease"
        }}
      >
        <div style={{ display: "flex", gap: "15px", alignItems: "flex-start", flex: 1 }}>
          <div style={{
            backgroundColor: isOpen ? "#3b82f6" : "#e2e8f0",
            color: isOpen ? "#ffffff" : "#64748b",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "16px",
            flexShrink: 0,
            transition: "all 0.3s ease"
          }}>
            Q
          </div>
          <h4 style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: isOpen ? "700" : "600",
            color: isOpen ? "#1e293b" : "#334155",
            lineHeight: "1.5"
          }}>
            {category.title}
          </h4>
        </div>
        <div style={{
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
          color: "#94a3b8",
          marginTop: "4px"
        }}>
          ▼
        </div>
      </div>

      <div style={{
        maxHeight: isOpen ? "2000px" : "0",
        opacity: isOpen ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.4s ease-in-out"
      }}>
        <div style={{
          padding: "0 20px 20px 65px",
          backgroundColor: "#f8fafc",
        }}>
          <div style={{
            color: "#475569",
            lineHeight: "1.7",
            fontSize: "15px",
            whiteSpace: "pre-wrap",
            paddingTop: "10px",
            borderTop: "1px dashed #cbd5e1"
          }}>
            <span style={{ fontWeight: "600", color: "#3b82f6", marginRight: "8px" }}>Ans:</span>
            {category.desc || "No answer provided yet for this question."}
          </div>

          <div style={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            paddingTop: "15px"
          }}>
            <button
              className="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpdate ? onUpdate(category._id) : navigate(`/categories/update/${category._id}`);
              }}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                margin: 0,
                backgroundColor: "#fff",
                color: "#3b82f6",
                border: "1px solid #3b82f6",
                fontWeight: "600"
              }}
            >
              Edit
            </button>
            {isAdmin && (
              <button
                className="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(category._id);
                }}
                style={{
                  backgroundColor: "#ef4444",
                  padding: "8px 16px",
                  fontSize: "14px",
                  color: "white",
                  margin: 0,
                  border: "none",
                  fontWeight: "600"
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryList = ({ subjectId, moduleId, subjectTitle, onClose, onAdd, onUpdate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('blogData') || '{}');
  const isAdmin = authData?.role === 'admin';
  const [moduleData, setModuleData] = useState(null);


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories();
      if (moduleId) fetchModuleData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, subjectId, moduleId]);

  const fetchModuleData = async () => {
    try {
      const res = await api.get(`/modules/${moduleId}`);
      setModuleData(res.data);
    } catch (error) {
      console.error("Failed to fetch module details", error);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (subjectId) params.subjectId = subjectId;
      if (moduleId) params.moduleId = moduleId;

      const res = await api.get("/categories", { params });
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success("Question deleted");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete question");
      }
    }
  };

  const filteredCategories = categories;

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {onAdd ? (
          <button onClick={onAdd} className="button button-block" style={{ flex: 1, margin: 0 }}>
            Add Questions
          </button>
        ) : (
          <Link to="/categories/new" className="button button-block" style={{ flex: 1, margin: 0 }}>
            Add Questions
          </Link>
        )}
        {onClose && (
          <button onClick={onClose} className="button button-block" style={{ flex: 1, margin: 0, backgroundColor: "#666" }}>
            Close
          </button>
        )}
      </div>

      <h2 className="table-title">{subjectTitle ? `${subjectTitle} Questions` : "Very Important Questions"}</h2>
      <input
        className="search-input"
        type="text"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for questions..."
        style={{
          width: "100%",
          padding: "12px 15px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          marginBottom: "25px",
          fontSize: "16px",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        }}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          Loading questions...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {moduleData && (
            <div className="module-materials-container">
              <FileSection
                type="module"
                id={moduleId}
                files={moduleData.files}
                onFileChange={fetchModuleData}
                isAdmin={isAdmin}
              />
            </div>
          )}

          <div className="questions-list-container">
            <h3 className="section-subtitle" style={{
              marginBottom: "20px",
              color: "#a2a5a9ff",
              fontSize: "1.25rem",
              fontWeight: "600"
            }}>
              Very Important Questions
            </h3>

            <div className="accordion-wrapper">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <QuestionAccordionItem
                    key={category._id}
                    category={category}
                    onUpdate={onUpdate}
                    onDelete={handleDelete}
                    isAdmin={isAdmin}
                    navigate={navigate}
                  />
                ))
              ) : (
                <div style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                  color: "#64748b"
                }}>
                  <div style={{ fontSize: "40px", marginBottom: "15px" }}>📝</div>
                  <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>No questions added yet</h4>
                  <p style={{ margin: 0 }}>Click "Add Questions" to create your first Q&A.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
