import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Contact from "./pages/Contact";
import CategoryList from "./pages/category/CategoryList";
import PostList from "./pages/post/PostList";
import NewPost from "./pages/post/NewPost";
import DetailPost from "./pages/post/DetailPost";
import UpdatePost from "./pages/post/UpdatePost";
import NewCategory from "./pages/category/NewCategory";
import UpdateCategory from "./pages/category/UpdateCategory";
import CycleSubjects from "./pages/firstyear";
import SubjectDetail from "./pages/post/SubjectDetail";
import PrivateLayout from "./components/Layout/PrivateLayout";
import ThirdModules from "./pages/ThirdModules";
import FourthModules from "./pages/FourthModules";
import FifthModules from "./pages/FifthModules";
import SixthModules from "./pages/SixthModules";
import SeventhModules from "./pages/SeventhModules";
import EighthModules from "./pages/EighthModules";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<PrivateLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/subject" element={<CycleSubjects />} />
            <Route path="/ThirdModules" element={<ThirdModules />} />
            <Route path="/FourthModules" element={<FourthModules />} />
            <Route path="/FifthModules" element={<FifthModules />} />
            <Route path="/SixthModules" element={<SixthModules />} />
            <Route path="/SeventhModules" element={<SeventhModules />} />
            <Route path="/EighthModules" element={<EighthModules />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/new" element={<NewPost />} />
            <Route path="/posts/detail/:id" element={<DetailPost />} />
            <Route path="/posts/update/:id" element={<UpdatePost />} />
            <Route path="/categories/new" element={<NewCategory />} />
            <Route path="/categories/update/:id" element={<UpdateCategory />} />
            <Route path="/subject/:title" element={<SubjectDetail />} />
          </Route>
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
