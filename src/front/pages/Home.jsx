import { Link } from "react-router-dom";
import logo from "../assets/runbound-logo.png";
import atleta from "../assets/atleta.png";
import atleta2 from "../assets/atleta2.png";

export const Home = () => {
    return (
        <div className="home-container">

            <h1 className="home-title">
                Bienvenido a <span className="run">Run</span><span className="bound">Bound</span>
            </h1>

            <p className="home-subtitle">
                Explora eventos deportivos, encuentra tu próxima carrera y sigue tu progreso en el mapa interactivo.
            </p>

            {/* PRIMERA FRASE */}
            <div className="home-quote-section">
                <div className="home-quote">
                    <p>
                        "La motivación te hace empezar. El hábito te hace continuar."
                        <br />— Jim Ryun
                    </p>
                </div>

                <div className="home-image">
                    <img src={atleta} alt="running" />
                </div>
            </div>

            {/* SEGUNDA FRASE — LA SACAMOS DE home-buttons */}
            <div className="home-quote-section reverse">
                <div className="home-image">
                    <img src={atleta2} alt="running" />
                </div>

                <div className="home-quote">
                    <p>
                        "El éxito en el atletismo no se mide por la velocidad, sino por la constancia y la pasión."
                        <br />— RunBound
                    </p>
                </div>
            </div>

            <div className="home-buttons">
                <Link to="/register" className="btn-register">Registrarse</Link>
            </div>

        </div>
    );
};
