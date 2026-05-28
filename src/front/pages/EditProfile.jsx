import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch(import.meta.env.VITE_BACKEND_URL + "/profile", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => setUser(data));
    }, []);

    if (!user) return <div className="edit-profile-loading">Cargando...</div>;

    return (
        <div className="edit-profile-container">

            <h2 className="edit-title">Editar Perfil</h2>

            <div className="edit-card">

                {/* FOTO */}
                <div className="edit-avatar-section">
                    <img
                        src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                        alt="avatar"
                        className="edit-avatar"
                    />

                    <label className="upload-photo-btn">
                        Cambiar foto
                        <input type="file" className="avatar-input" />
                    </label>
                </div>

                {/* FORMULARIO */}
                <form className="edit-form">

                    <label>Email</label>
                    <input type="text" defaultValue={user.email} />

                    <label>Residencia</label>
                    <input type="text" defaultValue={user.residencia} />

                    <label>Sexo</label>
                    <input type="text" defaultValue={user.sexo} />

                    <label>Peso (kg)</label>
                    <input type="number" defaultValue={user.peso} placeholder="Ej: 60" />

                    <label>Altura (cm)</label>
                    <input type="number" defaultValue={user.altura} placeholder="Ej: 165" />

                    <button className="save-btn">Guardar cambios</button>
                </form>

                <button
                    className="back-btn"
                    onClick={() => navigate("/profile")}
                >
                    Volver al perfil
                </button>

            </div>
        </div>
    );
};
