import { EventForm } from "../components/organizer/EventForm";

export const OrganizerDashboard = () => {
    return (
        <div className="organizer-dashboard">
            <h1 className="dashboard-title">Organizer Dashboard</h1>
            <p className="dashboard-description">Welcome to the organizer panel.</p>
            <EventForm />
        </div>
    );
};