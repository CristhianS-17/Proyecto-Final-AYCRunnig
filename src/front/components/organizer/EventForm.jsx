export const EventForm = () => {
    return (
        <div className="event-form">
            <h2 className="event-form-title">Create Event</h2>

            <form>
                <div className="form-group">
                    <label>Event Name</label>
                    <input type="text" placeholder="Event name" />
                </div>

                 <div className="form-group">
                    <label>Location</label>
                    <input type="text" placeholder="Event Location" />
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input  type="date"/>
                </div>

                <div className="form-group">
                    <label>Event Description</label>
                    <textarea placeholder="Event Description"></textarea>
                </div>

                <button className="create-event-button">Create Event</button>
            </form>
        </div>
    );
};
