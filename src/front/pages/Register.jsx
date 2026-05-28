import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        birth_date: "",
        gender: "",
        residence: "",
        email: "",
        password: "",
        role: "runner"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await resp.json();

            if (!resp.ok) {
                alert(data.msg || "Error al registrarse");
                return;
            }

            alert("Registro exitoso");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return (
        <div className="container mt-5 register-page">
            <h1>Registro</h1>

            <form onSubmit={handleSubmit} className="mt-4">

                <input
                    type="text"
                    name="first_name"
                    placeholder="Nombre"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="last_name"
                    placeholder="Apellido"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <label className="form-label">Fecha de nacimiento</label>
                <input
                    type="date"
                    name="fecha_nacimiento"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <select
                    name="gender"
                    className="form-control mb-3"
                    onChange={handleChange}
                >
                    <option value="">Selecciona tu sexo</option>
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="otro">Otro</option>
                </select>

                <input
                    type="text"
                    name="residence"
                    placeholder="Lugar de residencia"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

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

                <select
                    name="role"
                    className="form-control mb-5"
                    onChange={handleChange}
                >
                    <option value="runner">Atleta</option>
                    <option value="organizer">Organizador</option>
                </select>

                <button className="btn btn-success w-100">Registrarse</button>
            </form>
        </div>
    );
};
