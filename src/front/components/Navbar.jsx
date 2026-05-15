import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/runbound-logo.png";

export const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-logo" to="/">
                    <img src={logo} alt="RunBound Logo" />
                </Link>

                <div className="ml-auto">
                    {!isLoggedIn && (
                        <Link to="/login" className="btn-beige">
                            Login
                        </Link>
                    )}

                    {isLoggedIn && (
                        <>
                            <Link to="/map">Mapa</Link>
                            <Link to="/organizer">Organizer</Link>
                            <Link to="/admin">Admin</Link>

                            <button className="btn btn-danger btn-sm"onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
