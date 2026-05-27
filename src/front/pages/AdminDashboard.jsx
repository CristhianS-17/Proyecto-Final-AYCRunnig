import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

export const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

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

    useEffect(() => {
        getEvents();
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
                            <strong>Cierre:</strong> {event.registration_deadline || "No indicado"}
                        </p>
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div className="admin-selected-event">
                    <h2>{selectedEvent.title}</h2>

                    <p>
                        <strong>Ciudad:</strong> {selectedEvent.location_name}
                    </p>

                    <p>
                        <strong>Fecha:</strong> {selectedEvent.date}
                    </p>

                    <p>
                        <strong>Hora inicio:</strong> {selectedEvent.start_time || "No indicada"}
                    </p>

                    <p>
                        <strong>Total inscritos:</strong> {selectedEvent.total_participants}
                    </p>

                    <h3>Atletas inscritos</h3>

                    {selectedEvent.participantes?.length === 0 && (
                        <p>No hay atletas inscritos todavía.</p>
                    )}

                    {selectedEvent.participantes?.map((participant) => (
                        <div key={participant.id} className="participant-card">

                            <p>
                                <strong>Nombre:</strong>{" "}
                                {participant.first_name || "Sin nombre"}
                            </p>

                            <p>
                                <strong>Apellidos:</strong>{" "}
                                {participant.last_name || "Sin apellidos"}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {participant.email}
                            </p>

                        </div>
                    ))}

                </div>
            )
            }
        </div >
    );
};