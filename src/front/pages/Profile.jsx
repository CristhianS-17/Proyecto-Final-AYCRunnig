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
        <div className="container mt-5">
            <div className="card p-4 shadow-sm">
                <h1>Perfil de Usuario</h1>
                <hr />
                <p><strong>Identificador Único (ID):</strong> {user.id}</p>
                <p><strong>Email registrado:</strong> {user.email}</p>
                <p><strong>Rol en la app:</strong> <span className="badge bg-primary">{user.role}</span></p>
                <p><strong>Estado de cuenta:</strong> {user.is_active ? "🟢 Activa" : "🔴 Inactiva"}</p>
                
                {/* Si vuestro serialize devuelve las inscripciones, podéis ver cuántas lleva */}
                <p><strong>Carreras guardadas:</strong> {user.my_inscriptions?.length || 0}</p>
            </div>

        </div>
    );
};
