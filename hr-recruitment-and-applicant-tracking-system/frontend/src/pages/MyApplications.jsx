import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);

    // In a real app, we need the candidate ID. 
    // For this simple version, we assume the backend endpoint gets it from context or we pass a hardcoded ID for now 
    // IF the backend is smart enough. But our backend currently expects `GET /api/applications/candidate/{id}`.
    // We need to extract ID from token or store it in localStorage on login.
    // Let's assume we stored 'userId' in localStorage for now, or fetch it.

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) fetchApplications();
    }, [userId]);

    const fetchApplications = async () => {
        try {
            const data = await apiRequest(`/applications/candidate/${userId}`);
            setApplications(data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!userId) return <div style={{ padding: 20 }}>Please log in again to load your profile.</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Applications</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
                {applications.length === 0 && <p>You haven't applied to any jobs yet.</p>}
                {applications.map(app => (
                    <div key={app.id} style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px' }}>
                        <h4>Job: {app.job?.title}</h4>
                        <p>Status: <span style={{ color: '#bb86fc' }}>{app.status}</span></p>
                        <p>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyApplications;
