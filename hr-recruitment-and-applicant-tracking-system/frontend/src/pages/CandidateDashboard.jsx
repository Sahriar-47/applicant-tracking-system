import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const CandidateDashboard = () => {
    // In a real app, verify we have a candidate ID
    // specific stats for candidate could go here
    return (
        <div style={{ padding: '20px' }}>
            <h2>Candidate Dashboard</h2>
            <p>Welcome! Find your dream job today.</p>
            <div style={{ marginTop: '20px' }}>
                <button className="button" onClick={() => window.location.href = '/jobs'}>Browse Jobs</button>
                <button className="button" style={{ marginLeft: '10px' }} onClick={() => window.location.href = '/my-applications'}>My Applications</button>
            </div>
        </div>
    );
};

export default CandidateDashboard;
