import { Link } from "react-router-dom";
import logo from "../assets/runbound-logo.png";

export const Home = () => {
    return (
        <div className="home-container">
            
            <h1 className="home-title">
                Bienvenido a <span>RunBound</span>
            </h1>

            <p className="home-subtitle">
                Explora eventos deportivos, encuentra tu próxima carrera y sigue tu progreso en el mapa interactivo.
            </p>

            <div className="home-buttons">
                <Link to="/login" className="btn-login">Iniciar Sesión</Link>
                <Link to="/register" className="btn-register">Registrarse</Link>
            </div>
        </div>
    );
};
