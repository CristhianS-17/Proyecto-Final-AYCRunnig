import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const EventDetail = () => {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [message, setMessage] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const getEvent = async () => {
        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/event/" + id
        );

        const data = await response.json();

        setEvent(data);
    };

    const checkSubscription = async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const response = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/my-inscriptions",
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                }
            );

            if (!response.ok) {
                console.warn("No se pudieron cargar inscripciones.");
                return;
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                const alreadySubscribed = data.some(
                    (inscription) => inscription.event_id === Number(id)
                );
                setIsSubscribed(alreadySubscribed);
            } else {
                console.error("El formato de los datos no es un array:", data)
            }

        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
        }
    };

    useEffect(() => {
        getEvent();
        checkSubscription();
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

        if (response.ok) {
            setIsSubscribed(true);
        }
    };

    const handleUnsubscribe = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/unsubscribe/" + event.id,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token,
                },
            }
        );

        const data = await response.json();

        setMessage(data.msg);

        if (response.ok) {
            setIsSubscribed(false);
        }
    };

    if (!event) {
        return <p className="event-detail-loading">Cargando evento...</p>;
    }

    return (
        <div className="event-detail-page">

            <section className="event-detail-hero">
                <span className="event-detail-badge">
                    Evento deportivo
                </span>

                <h1>{event.title}</h1>

                <p>
                    {event.location_name}
                </p>
            </section>

            {message && (
                <div className="event-message">
                    {message}
                </div>
            )}

            <section className="event-detail-card">

                <div className="event-detail-info-grid">

                    <div className="event-detail-info-item">
                        <span>Fecha</span>
                        <strong>{event.date}</strong>
                    </div>

                    <div className="event-detail-info-item">
                        <span>Inicio</span>
                        <strong>{event.start_time || "No indicado"}</strong>
                    </div>

                    <div className="event-detail-info-item">
                        <span>Finalización</span>
                        <strong>{event.end_time || "No indicado"}</strong>
                    </div>

                    <div className="event-detail-info-item">
                        <span>Cierre inscripciones</span>
                        <strong>{event.registration_deadline || "No indicado"}</strong>
                    </div>

                </div>

                <div className="event-detail-description">
                    <h2>Descripción del evento</h2>

                    <p>
                        {event.description}
                    </p>
                </div>

                {isSubscribed ? (
                    <button
                        className="unsubscribe-button"
                        onClick={handleUnsubscribe}
                    >
                        Cancelar inscripción
                    </button>
                ) : (
                    <button
                        className="event-subscribe-button"
                        onClick={handleSubscribe}
                    >
                        Inscribirme al evento
                    </button>
                )}

            </section>

        </div>
    );
};