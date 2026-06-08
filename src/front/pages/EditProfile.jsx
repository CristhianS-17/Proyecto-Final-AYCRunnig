import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/img-yrp/7.jpeg";

export const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});

    // Función para manejar el cambio de foto
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("avatar", file);

        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/upload-avatar", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: data
        });

        if (resp.ok) {
            window.location.reload(); // Recargamos para ver la nueva foto
        } else {
            alert("Error al subir la foto");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(import.meta.env.VITE_BACKEND_URL + "/profile", {
            headers: { "Authorization": "Bearer " + token }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setFormData(data);
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (resp.ok) {
            alert("¡Perfil actualizado!");
            navigate("/profile");
        }
    };

    if (!user) return <div className="edit-profile-loading">Cargando...</div>;

    return (
        <div className="profile-bg" style={{ backgroundImage: `url(${bg})` }}>
            <div className="profile-wrapper">
                <div className="edit-profile-container">
                    <h2 className="edit-title">Editar Perfil</h2>
                    <div className="edit-card">

                        {/* SECCIÓN FOTO (RECUPERADA) */}
                        <div className="edit-avatar-section">
                            <img src={user.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt="avatar" className="edit-avatar" />
                            <label className="upload-photo-btn">
                                Cambiar foto
                                <input type="file" className="avatar-input" onChange={handleAvatarUpload} />
                            </label>
                        </div>

                        {/* FORMULARIO */}
                        <form className="edit-form" onSubmit={handleSave}>
                            <label>Residencia</label>
                            <input name="residencia" defaultValue={user.residencia} onChange={handleChange} />

                            <label>Sexo</label>
                            <input name="sexo" defaultValue={user.sexo} onChange={handleChange} />

                            <label>Peso (kg)</label>
                            <input name="peso" type="number" defaultValue={user.peso} onChange={handleChange} />

                            <label>Altura (cm)</label>
                            <input name="altura" type="number" defaultValue={user.altura} onChange={handleChange} />

                            <button type="submit" className="save-btn">Guardar cambios</button>
                        </form>

                        <button className="back-btn" onClick={() => navigate("/profile")}>Volver al perfil</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
