import React from 'react';

const AdminDashboard = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            <p>Welcome, Administrator.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div className="stat-card">
                    <h3>System Health</h3>
                    <p>Good</p>
                </div>
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>--</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
