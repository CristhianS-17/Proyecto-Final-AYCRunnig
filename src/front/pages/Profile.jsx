import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getProfileData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await resp.json();

                if (!resp.ok) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                setUser(data);

            } catch (error) {
                console.error("Error cargando el perfil:", error);
            }
        };

        getProfileData();
    }, [navigate]);

    if (!user) return <div className="container mt-5">Cargando datos del atleta...</div>;

    return (
        <div className="profile-dashboard">

            {/* TARJETA IZQUIERDA: FOTO + INFO */}
            <div className="profile-card">

                <div className="profile-avatar-container">
                    <img
                        src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                        alt="avatar"
                        className="profile-avatar"
                    />
                    <button className="btn-edit-profile">Editar perfil</button>
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
                    {user.my_inscriptions?.length || 0}
                </p>

                {/* LISTA DE INSCRIPCIONES */}
                {user.my_inscriptions?.map((inscription) => (
                    <div key={inscription.id} className="event-card">
                        <h3>{inscription.event?.title}</h3>
                        <p>{inscription.event?.location_name}</p>
                        <p>Hora inicio: {inscription.event?.start_time}</p>

                        <button
                            className="unsubscribe-button"
                            onClick={async () => {
                                const token = localStorage.getItem("token");

                                const response = await fetch(
                                    import.meta.env.VITE_BACKEND_URL +
                                    "/unsubscribe/" +
                                    inscription.event_id,
                                    {
                                        method: "DELETE",
                                        headers: {
                                            "Authorization": "Bearer " + token,
                                        },
                                    }
                                );

                                if (response.ok) {
                                    window.location.reload();
                                }
                            }}
                        >
                            Cancelar inscripción
                        </button>
                    </div>
                ))}
            </div>

            {/* TARJETA DERECHA: ESTADÍSTICAS + GRÁFICOS */}
            <div className="profile-stats">

                <h3>Estadísticas del Atleta</h3>

                <div className="stats-grid">
                    <div className="stat-box">
                        <h4>Total carreras</h4>
                        <p>{user.my_inscriptions?.length || 0}</p>
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

                <h3 className="chart-title">Progreso semanal</h3>

                <div className="chart-placeholder">
                    <p>📈 Gráfico próximamente</p>
                </div>

            </div>

        </div>
    );
};
