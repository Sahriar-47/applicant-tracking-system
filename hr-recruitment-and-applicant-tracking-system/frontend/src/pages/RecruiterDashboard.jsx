import React from 'react';

const RecruiterDashboard = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Recruiter Dashboard</h2>
            <p>Welcome, Recruiter.</p>
            <div style={{ marginTop: '20px' }}>
                <button className="button" onClick={() => window.location.href = '/jobs'}>Manage Jobs</button>
                <button className="button" style={{ marginLeft: '10px' }} onClick={() => window.location.href = '/pipeline'}>View Pipeline</button>
            </div>
        </div>
    );
};

export default RecruiterDashboard;
