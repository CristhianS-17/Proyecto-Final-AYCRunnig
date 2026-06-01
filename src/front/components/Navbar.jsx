import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/runbound-logo.png";

export const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <nav className={`navbar-custom ${scrolled ? "scrolled" : ""}`}>
            <div className="navbar-inner">

                <Link className="navbar-logo" to="/">
                    <img src={logo} alt="RunBound Logo" />
                </Link>

                <div className="navbar-links">
                    <Link to="/">Home</Link>

                    {!isLoggedIn && (
                        <>
                            <Link to="/register">Register</Link>
                            <Link to="/login" className="btn-nav-primary">Login</Link>
                        </>
                    )}

                    {isLoggedIn && (
                        <>
                            <Link to="/map">Mapa</Link>
<<<<<<< HEAD
                            <Link to="/organizer">Crear Evento</Link>
                            {role === "admin" && <Link to="/admin">Admin</Link>}
                            <Link to="/profile">Perfil</Link>
                            <button className="btn-nav-logout" onClick={handleLogout}>
=======
                            <Link to="/profile">Perfil</Link>

                            {role === "organizer" && (
                                <>
                                    <Link to="/organizer">Crear Evento</Link>
                                    <Link to="/admin">Admin</Link>
                                </>
                            )}


                            <button
                                className="btn btn-danger btn-sm"
                                onClick={handleLogout}
                            >
>>>>>>> main
                                Logout
                            </button>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
};