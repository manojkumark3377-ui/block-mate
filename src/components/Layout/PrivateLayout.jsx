import { Navigate, Outlet } from "react-router-dom";
// use the global Navbar rendered in App.jsx — don't render it again here

const PrivateLayout = () => {
    // Check localStorage for stored auth info
    let auth = false;
    try {
        const data = window.localStorage.getItem("blogData");
        if (data) {
            const parsed = JSON.parse(data);
            // consider authenticated if parsed exists and has a token or _id
            auth = !!(parsed && (parsed.token || parsed._id || parsed.id));
        }
    } catch (e) {
        auth = false;
    }

    if (!auth) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default PrivateLayout;