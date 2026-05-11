import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/runbound-logo.png";

export const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="RunBound Logo" />
                <span className="run">Run</span>
                <span className="bound">Bound</span>
            </div>

            <div className="nav-right">
                <Link to="/map">Mapa</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};
