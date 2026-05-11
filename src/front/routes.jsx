import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { MapView } from "./pages/MapView";
import { EventDetail } from "./pages/EventDetail";
import { OrganizerDashboard } from "./pages/OrganizerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
            <Route index element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="map" element={<MapView />} />
            <Route path="event/:id" element={<EventDetail />} />

            <Route path="organizer" element={<OrganizerDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
        </Route>
    )
);