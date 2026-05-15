import { useState } from "react";

export const EventForm = () => {
    const [eventName, setEventName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [message, setMessage] = useState("")
    const handleSubmit =  async (e) => {
        e.preventDefault();
    const newEvent = {
        title: eventName,
        date: date,
        location_name: location,
        latitude: latitude,
        longitude: longitude,
        description: description,
    }
        const token = localStorage.getItem("token");
        console.log(token);
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/event",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + token,
            },
            body: JSON.stringify(newEvent),
        });
        console.log(response);
        if (response.ok) {
            setMessage("Event created successfully");
            setEventName("")
            setLocation("")
            setDate("")
            setLatitude("")
            setLongitude("")
            setDescription("")
        } else {
            setMessage("You must login as organizer")
        }
        console.log(response);      
    };

    return (
        <div className="event-form">
            <h2 className="event-form-title">Create Event</h2>
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
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        placeholder="Event Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Latitude</label>

                    <input
                        type="number"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Longitude</label>

                    <input
                        type="number"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Event Description</label>
                    <textarea
                        placeholder="Event Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <button className="create-event-button">Create Event</button>
            </form>
        </div>
    );
};
