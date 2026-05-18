import { useEffect, useState } from "react";

export const EventForm = ({
    editingEvent,
    getEvents,
    setEditingEvent
}) => {

    const [eventName, setEventName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (editingEvent) {
            setEventName(editingEvent.title || "");
            setLocation(editingEvent.location_name || "");
            setDate(editingEvent.date || "");
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
                {editingEvent ? "Edit Event" : "Create Event"}
            </h2>

            {message && (
                <div className="event-message">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Event Name</label>

                    <input
                        type="text"
                        placeholder="Event name"
                        value={eventName}
                        onChange={(e) => {
                            setEventName(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>

                    <input
                        type="text"
                        placeholder="Event Location"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Date</label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Latitude</label>

                    <input
                        type="number"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => {
                            setLatitude(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Longitude</label>

                    <input
                        type="number"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => {
                            setLongitude(e.target.value);
                            setMessage("");
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Event Description</label>

                    <textarea
                        placeholder="Event Description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setMessage("");
                        }}
                    ></textarea>
                </div>

                <div className="event-form-buttons">
                    <button className="create-event-button">
                        {editingEvent ? "Update Event" : "Create Event"}
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
                                setLatitude("");
                                setLongitude("");
                                setDescription("");
                                setMessage("");
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};