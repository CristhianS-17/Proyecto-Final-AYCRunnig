import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

export const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [now, setNow] = useState(new Date());
    const [isEditing, setIsEditing] = useState(false);
    const [editField, setEditField] = useState("");
    const [editValue, setEditValue] = useState("");

    const getEvents = async () => {
        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/events"
        );

        const data = await response.json();

        const userId = localStorage.getItem("user_id");

        const myEvents = data.filter((event) => {
            return event.organizer_id === Number(userId);
        });

        setEvents(myEvents);
    };

    const getCountdown = (eventDate) => {
        const eventTime = new Date(eventDate).getTime();
        const currentTime = now.getTime();
        const difference = eventTime - currentTime;

        if (difference <= 0) {
            return "Evento finalizado";
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (difference % (1000 * 60)) / 1000
        );

        return `Quedan ${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    };

    const deleteEvent = async (eventId) => {
        const confirmDelete = window.confirm(
            "¿Seguro que quieres eliminar este evento?"
        );

        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/event/" + eventId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            }
        );

        if (response.ok) {
            setSelectedEvent(null);
            getEvents();
        }
    };

    useEffect(() => {
        getEvents();

        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">Panel del Organizador</h1>

            <p className="dashboard-description">
                Consulta el estado de tus eventos y las inscripciones.
            </p>

            <div className="admin-cards">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="admin-card"
                        onClick={() => setSelectedEvent(event)}
                    >
                        <h3>{event.title}</h3>

                        <p>
                            <strong>Ciudad:</strong> {event.location_name}
                        </p>

                        <p>
                            <strong>Inscritos:</strong> {event.total_participants}
                        </p>

                        <p>
                            <strong>Cierre:</strong>{" "}
                            {event.registration_deadline || "No indicado"}
                        </p>

                        <p className="event-countdown">
                            ⏳ {getCountdown(event.date)}
                        </p>

                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div
                        className="admin-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-event-header">
                            <h2>{selectedEvent.title}</h2>

                            <div className="admin-event-actions">

                                <button
                                    className="admin-edit-event-button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Editar evento
                                </button>

                                <button
                                    className="admin-delete-event-button"
                                    onClick={() => deleteEvent(selectedEvent.id)}
                                >
                                    Eliminar evento
                                </button>
                            </div>
                        </div>

                        <div className="event-details-grid">
                            <div className="event-detail-card">
                                <span>📍 Ciudad</span>
                                <strong>{selectedEvent.location_name}</strong>
                            </div>

                            <div className="event-detail-card">
                                <span>📅 Fecha</span>
                                <strong>{selectedEvent.date}</strong>
                            </div>

                            <div className="event-detail-card">
                                <span>⏰ Hora inicio</span>
                                <strong>
                                    {selectedEvent.start_time || "No indicada"}
                                </strong>
                            </div>

                            <div className="event-detail-card">
                                <span>👥 Inscritos</span>
                                <strong>{selectedEvent.total_participants}</strong>
                            </div>
                        </div>

                        <p className="event-countdown">
                            ⏳ {getCountdown(selectedEvent.date)}
                        </p>

                        {isEditing && (
                            <div className="edit-event-box">
                                <h3>Editar dato del evento</h3>

                                <select
                                    className="edit-event-input"
                                    value={editField}
                                    onChange={(e) => {
                                        setEditField(e.target.value);
                                        setEditValue("");
                                    }}
                                >
                                    <option value="">Selecciona qué quieres modificar</option>
                                    <option value="title">Título</option>
                                    <option value="description">Notas del evento</option>
                                    <option value="date">Fecha</option>
                                    <option value="location_name">Ciudad</option>
                                    <option value="start_time">Hora inicio</option>
                                    <option value="end_time">Hora fin</option>
                                    <option value="registration_deadline">Cierre de inscripción</option>
                                </select>

                                {editField && editField !== "description" && (
                                    <input
                                        className="edit-event-input"
                                        type={
                                            editField === "date" || editField === "registration_deadline"
                                                ? "date"
                                                : editField === "start_time" || editField === "end_time"
                                                    ? "time"
                                                    : "text"
                                        }
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder="Nuevo valor"
                                    />
                                )}

                                {editField === "description" && (
                                    <textarea
                                        className="edit-event-input"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder="Nuevas notas del evento"
                                        rows="4"
                                    />
                                )}

                                <div className="edit-event-buttons">
                                    <button
                                        className="save-edit-button"
                                        onClick={async () => {
                                            if (!editField || !editValue) {
                                                alert("Selecciona un campo y escribe un nuevo valor");
                                                return;
                                            }

                                            const confirmUpdate = window.confirm(
                                                "¿Seguro que quieres guardar este cambio?"
                                            );

                                            if (!confirmUpdate) return;

                                            const token = localStorage.getItem("token");

                                            const response = await fetch(
                                                import.meta.env.VITE_BACKEND_URL +
                                                "/event/" +
                                                selectedEvent.id,
                                                {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "Authorization": "Bearer " + token
                                                    },
                                                    body: JSON.stringify({
                                                        [editField]: editValue
                                                    })
                                                }
                                            );

                                            const data = await response.json();
                                            console.log("RESPUESTA UPDATE:", data);
                                            console.log("STATUS UPDATE:", response.status);

                                            if (response.ok) {
                                                const updatedEvent = {
                                                    ...selectedEvent,
                                                    [editField]: editValue
                                                };

                                                setSelectedEvent(updatedEvent);

                                                await getEvents();

                                                setIsEditing(false);
                                                setEditField("");
                                                setEditValue("");

                                                alert("Cambio guardado correctamente");
                                            } else {
                                                alert(data.msg || "Error al guardar el cambio");
                                            }
                                        }}
                                    >
                                        Guardar cambio
                                    </button>

                                    <button
                                        className="cancel-edit-button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditField("");
                                            setEditValue("");
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>

                            </div>
                        )}

                        <h3>Atletas inscritos</h3>

                        {selectedEvent.participantes?.length === 0 && (
                            <p>No hay atletas inscritos todavía.</p>
                        )}

                        <ol className="participants-list">
                            {selectedEvent.participantes?.map((participant) => (
                                <li
                                    key={participant.id}
                                    className="participant-item"
                                >
                                    <span>
                                        {participant.first_name && participant.last_name
                                            ? `${participant.first_name} ${participant.last_name}`
                                            : participant.email}
                                    </span>

                                    <button
                                        className="remove-participant-button"
                                        onClick={async () => {
                                            const confirmRemove = window.confirm(
                                                "¿Seguro que quieres quitar este atleta del evento?"
                                            );

                                            if (!confirmRemove) return;

                                            const token = localStorage.getItem("token");

                                            const response = await fetch(
                                                import.meta.env.VITE_BACKEND_URL +
                                                "/event/" +
                                                selectedEvent.id +
                                                "/participant/" +
                                                participant.id,
                                                {
                                                    method: "DELETE",
                                                    headers: {
                                                        "Authorization": "Bearer " + token,
                                                    },
                                                }
                                            );

                                            if (response.ok) {
                                                setSelectedEvent(null);
                                                getEvents();
                                            }
                                        }}
                                    >
                                        Quitar atleta
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
};