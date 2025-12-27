import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const role = localStorage.getItem('role');
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const isActive = (path) => location.pathname === path;

    const linkStyle = (path) => ({
        textDecoration: 'none',
        color: isActive(path) ? '#bb86fc' : 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        borderRadius: '4px',
        marginBottom: '5px',
        background: isActive(path) ? 'rgba(187, 134, 252, 0.1)' : 'transparent',
        transition: 'background 0.3s, color 0.3s',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    });

    return (
        <div style={{
            width: isOpen ? '250px' : '60px',
            background: '#121212', // Darker background for contrast
            height: '100vh',
            padding: '20px 10px',
            transition: 'width 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #333',
            position: 'sticky',
            top: 0,
            flexShrink: 0 // Prevent shrinking
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', marginBottom: '40px' }}>
                {isOpen && <h2 style={{ color: '#bb86fc', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>ATS</h2>}
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        padding: '5px'
                    }}
                >
                    {isOpen ? '❮' : '☰'}
                </button>
            </div>

            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {role === 'ROLE_ADMIN' && <li><Link to="/admin/dashboard" style={linkStyle('/admin/dashboard')}>{isOpen ? 'Dashboard' : '📊'}</Link></li>}
                    {role === 'ROLE_RECRUITER' && <li><Link to="/recruiter/dashboard" style={linkStyle('/recruiter/dashboard')}>{isOpen ? 'Dashboard' : '📊'}</Link></li>}
                    {role === 'ROLE_CANDIDATE' && <li><Link to="/candidate/dashboard" style={linkStyle('/candidate/dashboard')}>{isOpen ? 'Dashboard' : '📊'}</Link></li>}

                    <li><Link to="/jobs" style={linkStyle('/jobs')}>{isOpen ? 'Jobs' : '💼'}</Link></li>

                    {(role === 'ROLE_RECRUITER' || role === 'ROLE_ADMIN') && (
                        <>
                            <li><Link to="/candidates" style={linkStyle('/candidates')}>{isOpen ? 'Candidates' : '👥'}</Link></li>
                            <li><Link to="/pipeline" style={linkStyle('/pipeline')}>{isOpen ? 'Pipeline' : '📈'}</Link></li>
                        </>
                    )}

                    {role === 'ROLE_CANDIDATE' && (
                        <>
                            <li><Link to="/my-applications" style={linkStyle('/my-applications')}>{isOpen ? 'My Applications' : '📝'}</Link></li>
                            <li><Link to="/career-advisor" style={linkStyle('/career-advisor')}>{isOpen ? 'AI Career Advisor' : '🤖'}</Link></li>
                        </>
                    )}
                </ul>
            </nav>

            <div>
                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: 'auto',
                        background: isOpen ? 'rgba(207, 102, 121, 0.1)' : 'transparent',
                        border: isOpen ? '1px solid #cf6679' : 'none',
                        color: '#cf6679',
                        padding: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: isOpen ? 'center' : 'center',
                        transition: 'all 0.3s'
                    }}
                >
                    {isOpen ? 'Logout' : '🚪'}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
