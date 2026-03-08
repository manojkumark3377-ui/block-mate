import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [globalResults, setGlobalResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const semesters = [
    { title: "Physics and Chemistry Cycle", id: 1 },
    { title: "Third Semester", id: 2 },
    { title: "Fourth Semester", id: 3 },
    { title: "Fifth Semester", id: 4 },
    { title: "Sixth Semester", id: 5 },
    { title: "Seventh Semester", id: 6 },
    { title: "Eighth Semester", id: 7 }
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim()) {
        fetchGlobalResults();
      } else {
        setGlobalResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchGlobalResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/categories?search=${search}`);
      setGlobalResults(res.data);
    } catch (error) {
      console.error("Failed to fetch global search results", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSemesterClick = (semesterId) => {
    if (semesterId === 1) {
      navigate(`/subject`);
    } else if (semesterId === 2) {
      navigate(`/ThirdModules`);
    }
    else if (semesterId === 3) {
      navigate(`/FourthModules`);
    }
    else if (semesterId === 4) {
      navigate(`/FifthModules`);
    }
    else if (semesterId === 5) {
      navigate(`/SixthModules`);
    }
    else if (semesterId === 6) {
      navigate(`/SeventhModules`);
    }
    else if (semesterId === 7) {
      navigate(`/EighthModules`);
    }
    else {
      navigate(`/categories`);
    }
  };

  const filteredSemesters = semesters.filter(sem =>
    sem.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="formm-title">Visvesvaraya Technological University</h2>

      <input
        className="search-input"
        type="text"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for Semesters, Subjects or Questions..."
        style={{ marginBottom: "40px" }}
      />

      {search && globalResults.length > 0 && (
        <div className="search-results-section" style={{ marginBottom: "30px" }}>
          <h3 className="table-title">Global Question Results</h3>
          <div className="flexbox-container">
            {globalResults.map((result) => (
              <div key={result._id} className="post-card" style={{ cursor: 'default', minHeight: 'auto' }}>
                <h4 className="card-title">{result.title}</h4>
                <p className="card-desc" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {result.subject?.title} - {result.module?.title}
                </p>
                <p className="card-desc">{result.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p style={{ textAlign: "center" }}>Searching...</p>}

      <h3 className="table-title">{search ? "Matching Semesters" : "Semesters"}</h3>
      <div className="flexbox-container">
        {filteredSemesters.length > 0 ? (
          filteredSemesters.map((sem) => (
            <button key={sem.id} className="post-card" onClick={() => handleSemesterClick(sem.id)}>
              <h4 className="card-title">{sem.title}</h4>
            </button>
          ))
        ) : (
          !loading && <p style={{ width: "100%", textAlign: "center" }}>No semesters found matching "{search}"</p>
        )}
      </div>


    </div>
  );
};

export default Home;
