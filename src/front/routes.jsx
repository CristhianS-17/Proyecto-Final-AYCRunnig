import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile.jsx";
import { Register } from "./pages/Register";
import { MapView } from "./pages/MapView";
import { EventDetail } from "./pages/EventDetail";
import { OrganizerDashboard } from "./pages/OrganizerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

            {/* HOME PÁGINA PRINCIPAL */}
            <Route index element={<Home />} />

            {/* LOGIN */}
            <Route path="login" element={<Login />} />

            {/* REGISTER */}
            <Route path="register" element={<Register />} />

            {/* PROFILE */}
            <Route path="/profile" element={<Profile />} />

            {/* EDIT PROFILE */}
            <Route path="/edit-profile" element={<EditProfile />} />

            {/* MAPA Y EVENTOS */}
            <Route path="map" element={<MapView />} />
            <Route path="event/:id" element={<EventDetail />} />

            {/* PANELES */}
            <Route path="organizer" element={<OrganizerDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />

        </Route>
    )
);
