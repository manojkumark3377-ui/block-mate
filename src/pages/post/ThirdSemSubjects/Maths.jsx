import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryList from "../../category/CategoryList";
import NewCategory from "../../category/NewCategory";
import UpdateCategory from "../../category/UpdateCategory";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import FileSection from "../../components/FileSection";

const Maths = () => {
    const navigate = useNavigate();
    const authData = JSON.parse(localStorage.getItem('blogData') || '{}');
    const isAdmin = authData?.role === 'admin';

    const [view, setView] = useState("modules");
    const [subjectData, setSubjectData] = useState(null);
    const [modules, setModules] = useState([]);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [selectedModuleTitle, setSelectedModuleTitle] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [search, setSearch] = useState("");
    const subjectTitle = "Mathematics - III For CSE";

    const fetchModules = async (subjId) => {
        try {
            const modRes = await axios.get(`http://localhost:8000/api/v1/modules?subjectId=${subjId}`);
            setModules(modRes.data);
        } catch (error) {
            toast.error("Failed to fetch modules");
        }
    };

    useEffect(() => {
        const fetchSubjectAndModules = async () => {
            try {
                const subRes = await axios.get(`http://localhost:8000/api/v1/subjects?title=${encodeURIComponent(subjectTitle)}`);
                if (subRes.data.length > 0) {
                    const sub = subRes.data[0];
                    setSubjectData(sub);
                    fetchModules(sub._id);
                }
            } catch (error) {
                console.error("Failed to fetch subject data", error);
            }
        };
        fetchSubjectAndModules();
    }, []);

    const handleAddModule = async () => {
        const title = prompt("Enter module title (e.g., Module 6):");
        if (!title || !subjectData) return;

        try {
            await axios.post("http://localhost:8000/api/v1/modules", {
                title,
                subject: subjectData._id,
                order: modules.length + 1
            });
            toast.success("Module added successfully");
            fetchModules(subjectData._id);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add module");
        }
    };

    const handleDeleteModule = async (e, moduleId) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm("Are you sure? This will delete all questions inside this module!")) return;

        try {
            await axios.delete(`http://localhost:8000/api/v1/modules/${moduleId}`);
            toast.success("Module deleted");
            fetchModules(subjectData._id);
        } catch (error) {
            toast.error("Failed to delete module");
        }
    };

    function handleModuleClick(moduleId, moduleTitle) {
        setSelectedModuleId(moduleId);
        setSelectedModuleTitle(moduleTitle);
        setView("categories");
    }

    const filteredModules = modules.filter(mod =>
        mod.title.toLowerCase().includes(search.toLowerCase())
    );

    if (view === "categories") {
        return (
            <CategoryList
                subjectId={subjectData?._id}
                moduleId={selectedModuleId}
                subjectTitle={`${subjectTitle} - ${selectedModuleTitle}`}
                onClose={() => setView("modules")}
                onAdd={() => setView("new-category")}
                onUpdate={(id) => {
                    setSelectedCategoryId(id);
                    setView("update-category");
                }}
            />
        );
    }

    if (view === "new-category") {
        return <NewCategory
            subjectId={subjectData?._id}
            moduleId={selectedModuleId}
            subjectTitle={`${subjectTitle} - ${selectedModuleTitle}`}
            onBack={() => setView("categories")}
        />;
    }

    if (view === "update-category") {
        return <UpdateCategory categoryId={selectedCategoryId} onBack={() => setView("categories")} />;
    }

    return (
        <div>
            <h2 className="formm-title">Visvesvaraya Technological University</h2>

            <input
                className="search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules..."
                style={{ marginBottom: "40px" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h3 className="table-title" style={{ margin: 0 }}>{search ? "Matching Modules" : `${subjectTitle} Modules`}</h3>
                <button
                    className="button"
                    onClick={handleAddModule}
                    style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                    <FaPlus /> Add Module
                </button>
            </div>

            <div className="flexbox-container">
                {filteredModules.length > 0 ? (
                    filteredModules.map((module) => (
                        <div key={module._id} style={{ position: "relative" }}>
                            <button
                                className="post-card"
                                onClick={() => handleModuleClick(module._id, module.title)}
                                style={{ width: "100%", height: "100%" }}
                            >
                                <h4 className="card-title">{module.title}</h4>
                            </button>
                            {isAdmin && (


                            <button
                                onClick={(e) => handleDeleteModule(e, module._id)}
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
                                title="Delete Module"
                            >
                                <FaTrash />
                            </button>


                            )}

                        </div>
                    ))
                ) : (
                    <p style={{ width: "100%", textAlign: "center" }}>No modules found matching "{search}"</p>
                )}
            </div>

            {subjectData && (
                <div style={{ marginTop: "50px" }}>
                    <h3 className="table-title">Subject Materials</h3>
                    <FileSection
                        type="subject"
                        id={subjectData._id}
                        files={subjectData.files}
                        onFileChange={() => {
                            const fetchSubjectAgain = async () => {
                                const subRes = await axios.get(`http://localhost:8000/api/v1/subjects?title=${encodeURIComponent(subjectTitle)}`);
                                if (subRes.data.length > 0) {
                                    setSubjectData(subRes.data[0]);
                                }
                            };
                            fetchSubjectAgain();
                        }}
                        isAdmin={isAdmin}
                    />
                </div>
            )}


        </div>
    );
};
export default Maths;
