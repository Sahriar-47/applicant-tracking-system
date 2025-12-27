import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import CommentSection from '../components/CommentSection';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [newJob, setNewJob] = useState({ title: '', description: '', location: '', department: '' });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await apiRequest('/jobs');
            setJobs(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await apiRequest('/jobs', 'POST', newJob);
            setNewJob({ title: '', description: '', location: '', department: '' });
            fetchJobs();
        } catch (err) {
            alert(err.message);
        }
    };

    const role = localStorage.getItem('role');

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicationData, setApplicationData] = useState({ phone: '', coverLetter: '', file: null });

    const openApplyModal = (job) => {
        setSelectedJob(job);
        setModalOpen(true);
    };

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert("Please log in again.");
                return;
            }

            let resumeUrl = '';
            // Upload file first
            if (applicationData.file) {
                const formData = new FormData();
                formData.append('file', applicationData.file);
                // Call upload API - we need a helper or raw fetch since apiRequest assumes JSON usually, 
                // but let's check api.js. It does Content-Type application/json by default.
                // We'll do raw fetch for upload for simplicity.
                const uploadRes = await fetch('http://localhost:8080/api/files/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    body: formData
                });
                if (!uploadRes.ok) throw new Error('File upload failed');
                const uploadJson = await uploadRes.json();
                resumeUrl = uploadJson.url;
            }

            // Submit Application
            await apiRequest('/applications', 'POST', {
                candidateId: userId,
                jobId: selectedJob.id,
                resumeUrl: resumeUrl,
                coverLetter: applicationData.coverLetter,
                phone: applicationData.phone
            });

            alert("Applied successfully!");
            setModalOpen(false);
            setApplicationData({ phone: '', coverLetter: '', file: null });
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Jobs</h2>

            {/* Modal Overlay */}
            {modalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: '#2c2c2c', padding: '20px', borderRadius: '8px', minWidth: '400px' }}>
                        <h3>Apply for {selectedJob?.title}</h3>
                        <form onSubmit={handleApplySubmit} style={{ display: 'grid', gap: '10px' }}>
                            <input
                                placeholder="Phone Number"
                                value={applicationData.phone}
                                onChange={e => setApplicationData({ ...applicationData, phone: e.target.value })}
                                className="input"
                                required
                            />
                            <textarea
                                placeholder="Cover Letter"
                                value={applicationData.coverLetter}
                                onChange={e => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                className="input"
                                style={{ minHeight: '100px' }}
                                required
                            />
                            <label>Resume (PDF/Doc):</label>
                            <input
                                type="file"
                                onChange={e => setApplicationData({ ...applicationData, file: e.target.files[0] })}
                                className="input"
                                required
                            />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" className="button">Submit Application</button>
                                <button type="button" onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: '1px solid #777', color: '#fff', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {(role === 'ROLE_RECRUITER' || role === 'ROLE_ADMIN') && (
                <div style={{ marginBottom: '20px', padding: '15px', background: '#2c2c2c', borderRadius: '8px' }}>
                    <h3>Post New Job</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gap: '10px' }}>
                        <input placeholder="Title" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} required className="input" />
                        <input placeholder="Description" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} required className="input" />
                        <input placeholder="Location" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} required className="input" />
                        <input placeholder="Department" value={newJob.department} onChange={e => setNewJob({ ...newJob, department: e.target.value })} className="input" />
                        <button type="submit" className="button">Post Job</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gap: '10px' }}>
                {jobs.map(job => (
                    <div key={job.id} style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px' }}>
                        <h4>{job.title}</h4>
                        <p>{job.location}</p>
                        <p>{job.description}</p>
                        {role === 'ROLE_CANDIDATE' && (
                            <button className="button" style={{ marginTop: '10px' }} onClick={() => openApplyModal(job)}>Apply Now</button>
                        )}
                        {(role === 'ROLE_ADMIN' || role === 'ROLE_RECRUITER') && (
                            <button
                                className="button"
                                style={{ marginTop: '10px', background: '#cf6679', marginLeft: '10px' }}
                                onClick={async () => {
                                    if (window.confirm(`Delete job "${job.title}"?`)) {
                                        try {
                                            await apiRequest(`/jobs/${job.id}`, 'DELETE');
                                            fetchJobs();
                                        } catch (e) {
                                            alert(e.message);
                                        }
                                    }
                                }}
                            >
                                Remove Job
                            </button>
                        )}
                        <CommentSection jobId={job.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Jobs;
