import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import bg from "../assets/img-yrp/4.jpeg";


// Fix para que los iconos de Leaflet se vean bien en React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function MapView() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    <div className="map-bg" style={{ backgroundImage: `url(${bg})` }}>
      <div className="map-wrapper">
        <MapContainer
          center={[40.4168, -3.7038]}
          zoom={6}
          style={{
            height: "70vh",
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {events.map((event) => (
            <Marker
              key={event.id}
              position={[
                Number(event.latitude),
                Number(event.longitude)
              ]}
              eventHandlers={{
                click: () => setSelectedEvent(event),
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup>
                <strong>{event.title}</strong>
                <br />
                {event.location_name}
                <br />
                {event.date}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {selectedEvent && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
              animation: "fadeIn 0.2s ease"
            }}
            onClick={() => setSelectedEvent(null)}
          >
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                width: "320px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                animation: "scaleIn 0.2s ease"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{selectedEvent.title}</h2>

              <p>
                <strong>Location:</strong> {selectedEvent.location_name}
              </p>

              <p>
                <strong>Date:</strong> {selectedEvent.date}
              </p>

              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>

              <button
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginTop: "10px"
                }}
                onClick={() => {
                  window.location.href = `/event/${selectedEvent.id}`;
                }}
              >
                Ver detalles
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}