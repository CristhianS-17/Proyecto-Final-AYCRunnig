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
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-logo" to="/">
                    <img src={logo} alt="RunBound Logo" />
                    <span className="run">Run</span><span className="bound">Bound</span>
                </Link>
                <div className="ml-auto">
                    <Link to="/map">
                        Mapa
                    </Link>
                    <Link to="/organizer">
                        Organizer
                    </Link>
                    <Link to="/admin">
                        Admin
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};
