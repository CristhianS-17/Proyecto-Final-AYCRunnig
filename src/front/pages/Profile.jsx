import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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

    useEffect(() => {
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
        getProfileData();
    }, [navigate]);

    if (!user) return <div className="edit-profile-loading">Cargando datos del atleta...</div>;

    return (
        <div className="profile-dashboard">
            {/* TARJETA IZQUIERDA */}
            <div className="profile-card">
                <div className="profile-avatar-container">
                    <img
                        src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                        alt="avatar"
                        className="profile-avatar"
                    />
                    <button className="btn-edit-profile" onClick={() => navigate("/edit-profile")}>
                        Editar perfil
                    </button>
                </div>

                <h2 className="profile-name">{user.email}</h2>
                <p className="profile-email">ID: {user.id}</p>

                <div className="profile-info">
                    <p><strong>Rol:</strong> <span className="role-badge">{user.role}</span></p>
                    <p><strong>Peso:</strong> {user.peso || "—"} kg</p>
                    <p><strong>Altura:</strong> {user.altura || "—"} cm</p>
                    <p><strong>Estado:</strong> {user.is_active ? "🟢 Activa" : "🔴 Inactiva"}</p>
                </div>

                {/* LISTA DE INSCRIPCIONES */}
                {user.my_inscriptions?.map((inscription) => (
                    <div key={inscription.id} className="event-card">
                        <p><strong>Carrera:</strong> {inscription.event_name}</p>
                    </div>
                ))}
            </div>

            {/* TARJETA DERECHA */}
            <div className="profile-stats">
                <h3>Estadísticas del Atleta</h3>
                <div className="stats-grid">
                    <div className="stat-box">
                        <h4>Carreras guardadas</h4>
                        <p>{user.my_inscriptions?.length || 0}</p>
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
