import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        if (!email) {
            setMessage("Por favor, introduce tu correo electrónico.");
            setIsError(true);
            return;
        }

        try {
            // Hacemos la petición al endpoint del backend que crearemos luego
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.msg || "Hubo un error al procesar tu solicitud.");
                setIsError(true);
                return;
            }

            // Si todo va bien, mostramos mensaje de éxito
            setMessage("Si el correo existe, recibirás un enlace para restablecer tu contraseña.");
            setIsError(false);
            setEmail(""); // Limpiamos el input

        } catch (error) {
            setMessage("Error de conexión con el servidor.");
            setIsError(true);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <h1 className="text-center mb-4">Recuperar Contraseña</h1>
            <p className="text-muted text-center">
                Introduce tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
            </p>

            {message && (
                <div className={`alert ${isError ? "alert-danger" : "alert-success"} text-center`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group mb-3">
                    <input
                        type="email"
                        placeholder="Introduce tu Email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                    Enviar enlace de recuperación
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        className="btn btn-link btn-link-back"
                        onClick={() => navigate("/login")}
                        style={{ color: "#1f1f1f", textDecoration: "none", fontWeight: "600" }}
                    >
                        ← Volver al Login
                    </button>
                </div>
            </form>
        </div>
    );
};