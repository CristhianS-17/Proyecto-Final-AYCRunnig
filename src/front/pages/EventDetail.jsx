import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [message, setMessage] = useState("");

    const getEvent = async () => {
        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/event/" + id
        );

        const data = await response.json();

        setEvent(data);
    };

    useEffect(() => {
        getEvent();
    }, []);

    const handleSubscribe = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/subscribe",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({
                    event_id: event.id,
                }),
            }
        );

        const data = await response.json();

        setMessage(data.msg);
    };

    if (!event) {
        return <p>Loading event...</p>;
    }

    return (
        <div className="container mt-5">
            <h1>{event.title}</h1>

            {message && <div className="event-message">{message}</div>}

            <p>
                <strong>Location:</strong> {event.location_name}
            </p>

            <p>
                <strong>Date:</strong> {event.date}
            </p>

            <p>
                <strong>Description:</strong> {event.description}
            </p>

            <button
                className="create-event-button"
                onClick={handleSubscribe}
            >
                Inscribirme
            </button>
        </div>
    );
};