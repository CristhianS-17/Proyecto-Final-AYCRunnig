import { useState } from "react";

export const EventForm = () => {
    const [eventName, setEventName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(eventName);
        console.log(location);
        console.log(date);
        console.log(description);

        setEventName("")
        setLocation("")
        setDate("")
        setDescription("")
    };

    return (
        <div className="event-form">
            <h2 className="event-form-title">Create Event</h2>

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
