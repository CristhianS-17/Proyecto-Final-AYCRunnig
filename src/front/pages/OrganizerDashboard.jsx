import { EventForm } from "../components/organizer/EventForm";
import organizerBackground from "../assets/img-yrp/5.jpeg";

export const OrganizerDashboard = () => {
    const getEvents = () => {
        // Y.R.P - Función temporal vacía para mantener compatibilidad con EventForm.
        // La gestión real de eventos se realiza desde el panel Admin.
    };

    return (
        <div
            className="organizer-dashboard"
            style={{
                backgroundImage: `url(${organizerBackground})`,
            }}
        >
            <h1 className="dashboard-title">
                Bienvenido
            </h1>

            <p className="dashboard-description">
                Crea tus eventos deportivos. Podrás gestionarlos después desde la sección Admin.
            </p>

            <EventForm
                editingEvent={null}
                getEvents={getEvents}
                setEditingEvent={() => {}}
            />
        </div>
    );
};