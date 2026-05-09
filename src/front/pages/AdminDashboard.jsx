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
        </div>
    );
};