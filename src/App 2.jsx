import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import VerifyUser from "./pages/VerifyUser";
import CategoryList from "./pages/category/CategoryList";
import PostList from "./pages/post/PostList";
import NewPost from "./pages/post/NewPost";
import DetailPost from "./pages/post/DetailPost";
import UpdatePost from "./pages/post/UpdatePost";
import NewCategory from "./pages/category/NewCategory";
import UpdateCategory from "./pages/category/UpdateCategory";

import logo from "./assets/images/logoo.jpeg";

const Navbar = () => (
  <nav style={{
    display: 'flex',
    alignItems: 'center',
    height: '55px',
    gap: '28px',
    marginBottom: '30px',
    padding: '10px 20px',
    backgroundColor: '#a7f3d0',
    borderRadius: '12px',
    boxShadow: '0px 5px 10px 5px #50b485'
  }}>
    <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '10px' }}>
      <img src={logo} alt="Logo" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
      <span style={{ color: '#403301', fontWeight: 'bold', fontSize: '1.2rem' }}>BløckMate</span>
    </Link>
    <div style={{ display: 'flex', gap: '20px', marginLeft: 'auto' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#403301', fontWeight: 'bold' }}>Home</Link>
      <Link to="/login" style={{ textDecoration: 'none', color: '#403301', fontWeight: 'bold' }}>Login</Link>
      <Link to="/signup" style={{ textDecoration: 'none', color: '#403301', fontWeight: 'bold' }}>Signup</Link>
    </div>
  </nav>
);

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/verify-user" element={<VerifyUser />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/new" element={<NewPost />} />
        <Route path="/posts/detail/:id" element={<DetailPost />} />
        <Route path="/posts/update/:id" element={<UpdatePost />} />
        <Route path="/categories/new" element={<NewCategory />} />
        <Route path="/categories/update/:id" element={<UpdateCategory />} />
        <Route path="/navbar" element={<Navbar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
