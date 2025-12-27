import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await apiRequest('/analytics/dashboard');
                setStats(data);
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="stat-card">
                    <h3>Candidates</h3>
                    <p>{stats?.totalCandidates || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Jobs</h3>
                    <p>{stats?.activeJobs || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Applications</h3>
                    <p>{stats?.totalApplications || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Interviews</h3>
                    <p>{stats?.upcomingInterviews || 0}</p>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => window.location.href = '/jobs/new'}>Post a Job</button>
                    <button onClick={() => window.location.href = '/candidates/new'}>Add Candidate</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
