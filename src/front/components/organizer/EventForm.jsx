import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export const EventForm = ({
    editingEvent,
    getEvents,
    setEditingEvent
}) => {
    const [eventName, setEventName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [registrationDeadline, setRegistrationDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [message, setMessage] = useState("");
    const [showMap, setShowMap] = useState(false);

    const LocationSelector = () => {
        useMapEvents({
            click(e) {
                setLatitude(e.latlng.lat);
                setLongitude(e.latlng.lng);
            },
        });

        return latitude !== "" && longitude !== "" ? (
            <Marker position={[latitude, longitude]} />
        ) : null;
    };

    useEffect(() => {
        if (editingEvent) {
            setEventName(editingEvent.title || "");
            setLocation(editingEvent.location_name || "");
            setDate(editingEvent.date || "");
            setStartTime(editingEvent.start_time || "");
            setEndTime(editingEvent.end_time || "");
            setRegistrationDeadline(editingEvent.registration_deadline || "");
            setLatitude(editingEvent.latitude || "");
            setLongitude(editingEvent.longitude || "");
            setDescription(editingEvent.description || "");
            setMessage("");
        }
    }, [editingEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !eventName ||
            !location ||
            !date ||
            !startTime ||
            !endTime ||
            !registrationDeadline ||
            !latitude ||
            !longitude ||
            !description
        ) {
            setMessage("Please complete all fields");
            return;
        }

        if (
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            setMessage("Invalid coordinates");
            return;
        }

        const newEvent = {
            title: eventName,
            date: date,
            location_name: location,
            latitude: latitude,
            longitude: longitude,
            start_time: startTime,
            end_time: endTime,
            registration_deadline: registrationDeadline,
            description: description,
        };

        const token = localStorage.getItem("token");

        const response = await fetch(
            import.meta.env.VITE_BACKEND_URL + (editingEvent ? "/event/" + editingEvent.id : "/event"),
            {
                method: editingEvent ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(newEvent),
            }
        );

        if (response.ok) {
            getEvents();

            setMessage(
                editingEvent
                    ? "Event updated successfully"
                    : "Event created successfully"
            );

            setEventName("");
            setLocation("");
            setDate("");
            setStartTime("");
            setEndTime("");
            setRegistrationDeadline("");
            setLatitude("");
            setLongitude("");
            setDescription("");

            if (editingEvent) {
                setEditingEvent(null);
            }
        } else {
            setMessage("You must login as organizer");
        }
    };

    return (
        <div className="event-form">
            <h2 className="event-form-title">
                {editingEvent ? "Editar Evento" : "Crear Evento"}
            </h2>

            {message && (
                <div className="event-message">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre del evento</label>

                    <input
                        type="text"
                        placeholder="Nombre del evento"
                        value={eventName}
                        onChange={(e) => {
                            setEventName(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Ciudad</label>

                    <input
                        type="text"
                        placeholder="Ciudad"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Fecha del evento</label>

                    <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Hora de inicio</label>

                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => {
                            setStartTime(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Hora estimada de finalización</label>

                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => {
                            setEndTime(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Cierre de inscripciones</label>

                    <input
                        type="datetime-local"
                        value={registrationDeadline}
                        onChange={(e) => {
                            setRegistrationDeadline(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    
                    <button
                        type="button"
                        className="select-location-button"
                        onClick={() => setShowMap(!showMap)}
                    >
                        Seleccionar ubicación en el mapa
                    </button>

                    <div className="location-status">
                        {latitude !== "" && longitude !== ""
                            ? (
                                <>
                                    <span>Ubicación seleccionada</span>
                                    <small>
                                        Lat: {Number(latitude).toFixed(5)} | Lng: {Number(longitude).toFixed(5)}
                                    </small>
                                </>
                            )
                            : (
                                <span>No hay ubicación seleccionada</span>
                            )}
                    </div>

                    {showMap && (
                        <div className="map-placeholder">
                            <MapContainer
                                center={[40.4168, -3.7038]}
                                zoom={6}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <LocationSelector />
                            </MapContainer>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Descripción del evento</label>

                    <textarea
                        placeholder="Descripción del evento"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setMessage("");
                        }}
                    ></textarea>
                </div>

                <div className="event-form-buttons">
                    <button className="create-event-button">
                        {editingEvent ? "Actualizar Evento" : "Crear Evento"}
                    </button>

                    {editingEvent && (
                        <button
                            type="button"
                            className="cancel-edit-button"
                            onClick={() => {
                                setEditingEvent(null);

                                setEventName("");
                                setLocation("");
                                setDate("");
                                setStartTime("");
                                setEndTime("");
                                setRegistrationDeadline("");
                                setLatitude("");
                                setLongitude("");
                                setDescription("");
                                setMessage("");
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};