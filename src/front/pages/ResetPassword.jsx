import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        
        if (!password || !confirmPassword) {
            setMessage("Todos los campos son obligatorios.");
            setIsError(true);
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Las contraseñas no coinciden.");
            setIsError(true);
            return;
        }

        if (!token) {
            setMessage("Falta el token de seguridad o ha expirado. Solicita un nuevo enlace.");
            setIsError(true);
            return;
        }

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/reset-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ password: password })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.msg || "Hubo un error al cambiar la contraseña.");
                setIsError(true);
                return;
            }

            setMessage("¡Contraseña restablecida con éxito! Redirigiendo al login...");
            setIsError(false);
            
           
            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (error) {
            setMessage("Error de conexión con el servidor.");
            setIsError(true);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <h1 className="text-center mb-4">Nueva Contraseña</h1>
            <p className="text-muted text-center">
                Escribe tu nueva contraseña de acceso para AYCRunning de forma segura.
            </p>

            {message && (
                <div className={`alert ${isError ? "alert-danger" : "alert-success"} text-center`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group mb-3">
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group mb-3">
                    <input
                        type="password"
                        placeholder="Confirma la nueva contraseña"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                    Cambiar Contraseña
                </button>
            </form>
        </div>
    );
};