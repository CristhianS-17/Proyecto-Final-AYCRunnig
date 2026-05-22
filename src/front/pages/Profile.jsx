import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getProfileData = async () => {
            // 1. Buscamos el token que guardamos en el localStorage durante el login
            const token = localStorage.getItem("token");

            // Si no hay token, lo mandamos a loguearse de una
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const token = localStorage.getItem("token"); // Recupera el token guardado al hacer login
                // 2. Hacemos la petición GET a tu endpoint de siempre
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // 🔑 ¡AQUÍ ESTÁ LA MAGIA! Le enviamos el pasaporte a Python
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await resp.json();

                if (!resp.ok) {
                    // Si el token caducó o es falso, limpiamos y redirigimos
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                // 3. Guardamos los datos del usuario en el estado
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

                {user.my_inscriptions?.map((inscription) => (
                    <div
                        key={inscription.id}
                        className="event-card"
                    >
                        <h3>{inscription.event?.title}</h3>
                        <p>{inscription.event?.location_name}</p>
                        <p>{inscription.event?.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};