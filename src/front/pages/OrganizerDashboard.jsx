import React, { useState } from "react";

export default function OrganizerDashboard() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("No hay token. Inicia sesión.");
            return;
        }

        try {
            const response = await fetch("https://tu-url-de-api/api/event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    title: title,
                    date: date,
                    location: location,
                    description: description
                })
            });

            if (!response.ok) {
                setMessage("Error al crear el evento.");
                return;
            }

            setMessage("Evento creado con éxito.");
            setTitle("");
            setDate("");
            setLocation("");
            setDescription("");

        } catch (error) {
            setMessage("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Panel del Organizador</h2>
            <p>Crea nuevos eventos para los runners.</p>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit} className="mt-3">

                <div className="mb-3">
                    <label className="form-label">Título del evento</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Ubicación</label>
                    <input
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Crear evento
                </button>
            </form>
        </div>
    );
}

