import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(import.meta.env.BACKEND_URL + "/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    })
                }
            );

            if (!response.ok) {
                setMessage("Credenciales incorrectas");
                return;
            }

            const data = await response.json();

            // Guardar token y rol
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            // Redirección por rol
            if (data.role === "organizer") navigate("/organizer");
            if (data.role === "runner") navigate("/map");

        } catch (error) {
            setMessage("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-5">
            <h1>Login</h1>

            {message && <div className="alert alert-danger">{message}</div>}

            <form onSubmit={handleLogin} className="mt-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <button className="btn btn-primary w-100">Ingresar</button>

                <div className="text-center mt-2">
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate("/forgot-password")}
                    >
                        ¿Has olvidado tu contraseña?
                    </button>
                </div>

                <div className="text-center mt-3">
                    <p>¿No tienes cuenta?</p>
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => navigate("/register")}
                    >
                        Regístrate aquí
                    </button>
                </div>
            </form>
        </div>
    );
};
