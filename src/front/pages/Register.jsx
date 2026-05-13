import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
        sexo: "",
        residencia: "",
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
            const resp = await fetch(process.env.BACKEND_URL + "/register", {
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
        <div className="container mt-5">
            <h1>Registro</h1>

            <form onSubmit={handleSubmit} className="mt-4">

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="apellido"
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
                    name="sexo"
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
                    name="residencia"
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
                    className="form-control mb-3"
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
