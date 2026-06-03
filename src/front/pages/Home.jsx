import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import atleta from "../assets/atleta.png";
import atleta2 from "../assets/atleta2.png";

export const Home = () => {
    const sectionsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15 }
        );

        sectionsRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const addRef = (el) => {
        if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el);
    };

    return (
        <div className="home-container">

            {/* Hero */}
            <section className="hero-section">
                <div className="hero-text" ref={addRef}>
                    <span className="hero-eyebrow">Tu próxima carrera te espera</span>
                    <h1 className="hero-title">
                        <span className="word-run">Run</span>
                        <span className="word-bound">Bound</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explora eventos deportivos, encuentra tu próxima carrera y sigue tu
                        progreso en el mapa interactivo.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="hero-btn">
                            Comenzar ahora
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className="hero-stats" ref={addRef}>
                    <div className="stat-card">
                        <span className="stat-number">12K+</span>
                        <span className="stat-label">Corredores</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">340</span>
                        <span className="stat-label">Eventos activos</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">48</span>
                        <span className="stat-label">Ciudades</span>
                    </div>
                </div>

                <div className="hero-scroll-hint">
                    <div className="scroll-line" />
                    <span>Scroll</span>
                </div>
            </section>

            {/* Quote 1 */}
            <section className="quote-section" ref={addRef}>
                <div className="quote-content">
                    <div className="quote-number">01</div>
                    <blockquote>
                        "La motivación te hace empezar. El hábito te hace continuar."
                    </blockquote>
                    <cite>— Jim Ryun</cite>
                    <p className="quote-desc">
                        Cada entrenamiento cuenta. RunBound te ayuda a mantener el ritmo con seguimiento en tiempo real y comunidad activa.
                    </p>
                </div>
                <div className="quote-image-wrap">
                    <img src={atleta} alt="Atleta corriendo" />
                </div>
            </section>

            {/* Quote 2 — imagen primero, texto segundo */}
            <section className="quote-section reverse" ref={addRef}>
                <div className="quote-image-wrap">
                    <img src={atleta2} alt="Atleta en carrera" />
                </div>
                <div className="quote-content">
                    <div className="quote-number">02</div>
                    <blockquote>
                        "Cada carrera es una oportunidad para descubrir tu fuerza."
                    </blockquote>
                    <cite>— Paula Radcliffe</cite>
                    <p className="quote-desc">
                        Registra tus tiempos, comparte tus rutas y compite con corredores de todo el mundo desde tu ciudad.
                    </p>
                </div>
            </section>

            {/* CTA Final */}
            <section className="cta-section" ref={addRef}>
                <div className="cta-inner">
                    <span className="cta-eyebrow">¿Listo para correr?</span>
                    <h2 className="cta-title">Únete a miles de corredores hoy</h2>
                    <Link to="/register" className="btn-primary large">
                        Crear cuenta gratis
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

        </div>
    );
};