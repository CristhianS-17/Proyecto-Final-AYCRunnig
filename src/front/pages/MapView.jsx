import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

// Datos falsos de eventos
const fakeEvents = [
  { id: 1, name: "Maratón de Barcelona", lat: 41.3874, lng: 2.1686, date: "2024-03-10" },
  { id: 2, name: "Maratón de Madrid", lat: 40.4168, lng: -3.7038, date: "2024-04-28" },
  { id: 3, name: "Maratón de Valencia", lat: 39.4699, lng: -0.3763, date: "2024-12-01" },
];

export function MapView() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div style={{ height: "100vh", width: "100%", marginTop: "30px" }}>
      <MapContainer
        center={[40.4168, -3.7038]}
        zoom={6}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {fakeEvents.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            eventHandlers={{
              click: () => setSelectedEvent(event),
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup>
              <strong>{event.name}</strong>
              <br />
              {event.date}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Modal mejorado */}
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
            <h2>{selectedEvent.name}</h2>
            <p>Fecha: {selectedEvent.date}</p>

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
  );
}
