import { Link } from "react-router-dom";
import logo from "../assets/runbound-logo.png";
import atleta from "../assets/atleta.png";


export const Home = () => {
    return (
        <div className="home-container">

            <h1 className="home-title">
                Bienvenido a <span className="run">Run</span><span className="bound">Bound</span>
            </h1>

            <p className="home-subtitle">
                Explora eventos deportivos, encuentra tu próxima carrera y sigue tu progreso en el mapa interactivo.
            </p>


            <div className="home-quote-section">

                <div className="home-quote">
                    <p>
                        "En atletismo las piernas no son lo más importante, lo importante es el corazón y la mente."
                        <br />— Eliud Kipchoge
                    </p>
                </div>

                <div className="home-image">
                    <img src={atleta} alt="running" />
                </div>

            </div>

            <div className="home-buttons">
                <Link to="/register" className="btn-register">Registrarse</Link>
            </div>
        </div>
    );
};
