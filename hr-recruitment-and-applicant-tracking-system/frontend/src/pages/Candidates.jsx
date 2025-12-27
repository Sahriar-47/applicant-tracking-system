import React, { useEffect, useState } from 'react';
import { apiRequest, API_BASE_URL, getAuthHeader } from '../services/api';

const Candidates = () => {
    const [applications, setApplications] = useState([]);
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            let data = [];
            if (role === 'ROLE_ADMIN') {
                data = await apiRequest('/applications');
            } else if (role === 'ROLE_RECRUITER') {
                data = await apiRequest('/applications/my-jobs');
            }
            setApplications(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Candidates (Applications)</h2>

            <div style={{ display: 'grid', gap: '10px' }}>
                {applications.length === 0 && <p>No applications found.</p>}
                {applications.map(app => (
                    <div key={app.id} style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px' }}>
                        <h4>{app.applicant?.username || 'Unknown Candidate'}</h4>
                        <p>Applied for: <span style={{ fontWeight: 'bold', color: '#bb86fc' }}>{app.job?.title}</span></p>
                        <p>Phone: {app.phone || 'N/A'}</p>
                        <p>Cover Letter: {app.coverLetter}</p>
                        <p>Resume: {app.resumeUrl ? <a href={`http://localhost:8080${app.resumeUrl}`} target="_blank" rel="noreferrer" style={{ color: '#03dac6' }}>View Resume</a> : 'None'}</p>
                        <p style={{ fontSize: '0.8em', color: '#777' }}>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                        <button
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to remove this candidate?')) {
                                    try {
                                        await apiRequest(`/applications/${app.id}`, 'DELETE');
                                        fetchData();
                                    } catch (err) {
                                        alert(err.message);
                                    }
                                }
                            }}
                            style={{ marginTop: '10px', background: '#cf6679', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Remove Candidate
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Candidates;
