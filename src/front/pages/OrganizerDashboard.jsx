import { useEffect, useState } from "react";
import { EventForm } from "../components/organizer/EventForm";

export const OrganizerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    const getEvents = async () => {
        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/events"
        );

        const data = await response.json();

        setEvents(data);
    };

    const deleteEvent = async (id) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/event/" + id,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            }
        );

        if (response.ok) {
            getEvents();
        }
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <div className="organizer-dashboard">
            <h1 className="dashboard-title">
                Bienvenido
            </h1>

            <p className="dashboard-description">
                Crea y gestiona tus eventos deportivos.
            </p>

            <EventForm
                editingEvent={editingEvent}
                getEvents={getEvents}
                setEditingEvent={setEditingEvent}
            />

            <section className="my-events-section">
                <h2>Mis eventos</h2>

                {events.length === 0 && (
                    <div className="empty-events">
                        <h3>Aún no has creado ningún evento</h3>

                        <p>
                            Cuando publiques tu primer evento, aparecerá aquí para que puedas consultarlo, editarlo o eliminarlo.
                        </p>
                    </div>
                )}

                {events.map((event) => (
                    <div key={event.id} className="event-card">
                        <h3>{event.title}</h3>

                        <p>
                            <strong>Ciudad:</strong> {event.location_name}
                        </p>

                        <p>
                            <strong>Fecha:</strong> {event.date}
                        </p>

                        <div className="event-card-buttons">
                            <button
                                onClick={() => {
                                    setEditingEvent(event);
                                }}
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => {
                                    const confirmDelete = window.confirm(
                                        "¿Seguro que quieres eliminar este evento?"
                                    );

                                    if (confirmDelete) {
                                        deleteEvent(event.id);
                                    }
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};