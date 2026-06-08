import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/img-yrp/1.jpeg";

export const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [inscriptions, setInscriptions] = useState([]);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("avatar", file);

        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/upload-avatar", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (resp.ok) {
            window.location.reload();
        }
    };

    const getProfileData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/profile", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await resp.json();
        if (resp.ok) setUser(data);
    };

    const getInscriptions = async () => {
        const token = localStorage.getItem("token");

        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/my-inscriptions", {
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await resp.json();

        // Obtener detalles del evento para cada inscripción
        const enriched = await Promise.all(
            data.map(async (ins) => {
                const eventResp = await fetch(import.meta.env.VITE_BACKEND_URL + "/event/" + ins.event_id);
                const eventData = await eventResp.json();

                return {
                    ...ins,
                    event_name: eventData.title,   // ← AQUÍ VIENE EL NOMBRE REAL
                };
            })
        );

        setInscriptions(enriched);
    };

    useEffect(() => {
        getProfileData();
        getInscriptions();
    }, [navigate]);

    if (!user) return <div className="edit-profile-loading">Cargando datos del atleta...</div>;

    return (
        <div className="profile-bg" style={{ backgroundImage: `url(${bg})` }}>

            <div className="profile-dashboard">

                {/* TARJETA IZQUIERDA */}
                <div className="profile-card">

                    <div className="profile-avatar-container">
                        <img
                            src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                            alt="avatar"
                            className="profile-avatar"
                        />
                    </div>

                    <h2 className="profile-name">{user.email}</h2>

                    <p><strong>ID:</strong> {user.id}</p>

                    <p>
                        <strong>Rol:</strong>
                        <span className="role-badge">{user.role}</span>
                    </p>

                    <p>
                        <strong>Estado:</strong>
                        {user.is_active ? "🟢 Activa" : "🔴 Inactiva"}
                    </p>

                    <p>
                        <strong>Carreras guardadas:</strong>
                        {inscriptions.length}
                    </p>

                    <p>
                        <strong>Peso:</strong> {user.peso || "—"} kg
                    </p>

                    <p>
                        <strong>Altura:</strong> {user.altura || "—"} cm
                    </p>

                    <button
                        className="btn-edit-profile"
                        onClick={() => navigate("/edit-profile")}
                    >
                        Editar perfil
                    </button>

                </div>

                {/* TARJETA DERECHA */}
                <div className="profile-stats">

                    <h3>Estadísticas del Atleta</h3>

                    <div className="stats-grid">
                        <div className="stat-box">
                            <h4>Total carreras</h4>
                            <p>{inscriptions.length}</p>
                        </div>

                        <div className="stat-box">
                            <h4>Kilómetros totales</h4>
                            <p>124 km</p>
                        </div>

                        <div className="stat-box">
                            <h4>Ritmo promedio</h4>
                            <p>5:12 /km</p>
                        </div>

                        <div className="stat-box">
                            <h4>Mejor marca</h4>
                            <p>10K — 48:22</p>
                        </div>
                    </div>

                    <h3 className="chart-title">Carreras Inscritas</h3>

                    <div className="inscriptions-list">
                        {inscriptions.length > 0 ? (
                            inscriptions.map((race) => (
                                <div key={race.id} className="race-item">

                                    <button
                                        className="btn-view-race"
                                        onClick={() => navigate(`/event/${race.event_id}`)}
                                    >
                                        {race.event_name}
                                    </button>

                                </div>
                            ))
                        ) : (
                            <p className="no-races">No tienes carreras inscritas todavía.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
