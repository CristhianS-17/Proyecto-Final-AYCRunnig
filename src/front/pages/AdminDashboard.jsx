export const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <p className="dashboard-description">
                Welcome to the Admin Dashboard
            </p>

            <h2>Manage users and events</h2>

            <ul className="admin-list">
                <li>Manage Users</li>
                <li>Manage Events</li>
                <li>Disable Accounts</li>
            </ul>

            <div className="admin-cards">
                <div className="admin-card">
                    <h3>Users Management</h3>
                    <p>Manage platform users and permissions.</p>
                </div>
                <div className="admin-card">
                    <h3>Events Management</h3>
                    <p>Manage events and organizers.</p>
                </div>
                <div className="admin-card">
                    <h3>Account Control</h3>
                    <p>Disable or activate user accounts.</p>
                </div>
            </div>
        </div>
    );
};