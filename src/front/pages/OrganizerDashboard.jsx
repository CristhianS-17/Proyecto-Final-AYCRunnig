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

        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/event/" + id,
            {
                method: "DELETE",
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
                Organizer Dashboard
            </h1>

            <p className="dashboard-description">
                Welcome to the organizer panel.
            </p>

            <EventForm 
                editingEvent={editingEvent} 
                getEvents={getEvents}
                setEditingEvent={setEditingEvent}
            />

            <section className="my-events-section">

                <h2>My Events</h2>

                <p>
                    Here you will manage your created events.
                </p>

                {events.length === 0 && (
                    <p>No events created yet.</p>
                )}

                {events.map((event) => (
                    <div key={event.id} className="event-card">

                        <h3>{event.title}</h3>

                        <p>
                            <strong>Location:</strong> {event.location_name}
                        </p>

                        <p>
                            <strong>Date:</strong> {event.date}
                        </p>

                        <div className="event-card-buttons">

                            <button
                                onClick={() => {
                                    setEditingEvent(event);
                                    console.log("Editing event", event.id);
                                }}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => {

                                    const confirmDelete = window.confirm(
                                        "Are you sure you want to delete this event?"
                                    );

                                    if (confirmDelete) {
                                        deleteEvent(event.id);
                                    }
                                }}
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                ))}

            </section>

        </div>
    );
};