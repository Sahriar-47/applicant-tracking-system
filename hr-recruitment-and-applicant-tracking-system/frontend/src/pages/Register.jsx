
import React, { useState } from 'react';
import { apiRequest } from '../services/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_CANDIDATE');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await apiRequest('/auth/register', 'POST', { username, password, role });
            setMessage('Registration successful! Please login.');
            setError('');
        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input" style={{ width: '100%', marginBottom: '10px' }}>
                    <option value="ROLE_CANDIDATE">Candidate</option>
                    <option value="ROLE_RECRUITER">Recruiter</option>
                    <option value="ROLE_ADMIN">Admin</option>
                </select>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
};

export default Register;
