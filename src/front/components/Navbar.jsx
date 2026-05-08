import { Link } from "react-router-dom";
import logo from "../assets/runbound-logo.png";

export const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="RunBound Logo" />
                <span className="run">Run</span><span className="bound">Bound</span>

            </div>

            <div className="nav-right">
                <Link to="/map">Mapa</Link>
                <button>Logout</button>
            </div>
        </nav>
    );
};

