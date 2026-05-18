import { useEffect, useState } from "react";
import { EventForm } from "../components/organizer/EventForm";

export const OrganizerDashboard = () => {
    const [events, setEvents] = useState([]);

    const getEvents = async () => {

        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/events"
        );

        const data = await response.json();

        setEvents(data);

    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <div className="organizer-dashboard">
            <h1 className="dashboard-title">Organizer Dashboard</h1>

            <p className="dashboard-description">
                Welcome to the organizer panel.
            </p>

            <EventForm />

            <section className="my-events-section">
                <h2>My Events</h2>

                <p>Here you will manage your created events.</p>

                {events.length === 0 && (
                    <p>No events created yet.</p>
                )}

                {events.map((event) => (
                    <div key={event.id}>
                        <h3>{event.title}</h3>
                    </div>
                ))}
            </section>
        </div>
    );
};