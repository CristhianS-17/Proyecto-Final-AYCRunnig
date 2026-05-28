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
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="map" element={<MapView />} />
            <Route path="event/:id" element={<EventDetail />} />
            <Route path="organizer" element={<OrganizerDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
        </Route>
    )
);