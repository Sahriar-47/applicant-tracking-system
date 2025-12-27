import React, { useState } from 'react';
import { API_BASE_URL, getAuthHeader } from '../services/api';

const CareerAdvisor = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
                method: 'POST',
                headers: {
                    ...getAuthHeader(),
                },
                body: formData,
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON response:", text);
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}... (Status: ${response.status})`);
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze resume');
            }

            setAnalysis(data.analysis);
            setResumeText(data.text);
            setChatHistory([{ role: 'ai', content: data.analysis }]);
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChat = async () => {
        if (!chatMessage.trim() || !resumeText) return;

        const userMsg = chatMessage;
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatMessage('');
        setChatLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                body: JSON.stringify({
                    message: userMsg,
                    context: resumeText
                }),
            });

            if (!response.ok) throw new Error('Failed to get chat response');

            const data = await response.json();
            setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { role: 'error', content: 'Failed to get info from AI.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', background: '#121212', minHeight: '100vh', color: '#e0e0e0', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ color: '#bb86fc', marginBottom: '20px', fontSize: '2.5rem' }}>AI Career Advisor</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

                {/* Left Panel: Upload & Analysis */}
                <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                    <h2 style={{ color: '#03dac6', marginTop: 0 }}>Resume Analysis</h2>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>Upload your resume (PDF/DOCX) to get personalized engineering role suggestions.</p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            style={{
                                padding: '10px',
                                background: '#2c2c2c',
                                border: '1px solid #333',
                                borderRadius: '5px',
                                color: 'white',
                                flex: 1
                            }}
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !file}
                            style={{
                                background: loading ? '#555' : '#bb86fc',
                                color: loading ? '#ccc' : '#000',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? 'Analyzing...' : 'Analyze My Resume'}
                        </button>
                    </div>

                    {analysis && (
                        <div style={{
                            background: '#2c2c2c',
                            padding: '20px',
                            borderRadius: '10px',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6',
                            borderLeft: '4px solid #03dac6'
                        }}>
                            {analysis}
                        </div>
                    )}
                    {!analysis && !loading && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#555', border: '2px dashed #333', borderRadius: '10px' }}>
                            Waiting for upload...
                        </div>
                    )}
                </div>

                {/* Right Panel: Chat */}
                <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ color: '#03dac6', marginTop: 0 }}>Career Chat</h2>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>Ask questions about the suggestions or your skills.</p>

                    <div style={{
                        flex: 1,
                        background: '#121212',
                        borderRadius: '10px',
                        padding: '20px',
                        marginBottom: '20px',
                        overflowY: 'auto',
                        maxHeight: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {chatHistory.length === 0 && (
                            <div style={{ color: '#555', textAlign: 'center', marginTop: '50px' }}>
                                Chat history needs a resume context first.
                            </div>
                        )}
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                background: msg.role === 'user' ? '#bb86fc' : '#2c2c2c',
                                color: msg.role === 'user' ? '#000' : '#e0e0e0',
                                padding: '12px 18px',
                                borderRadius: '15px',
                                borderBottomRightRadius: msg.role === 'user' ? '2px' : '15px',
                                borderBottomLeftRadius: msg.role === 'user' ? '15px' : '2px'
                            }}>
                                <strong>{msg.role === 'user' ? 'You' : 'AI Advisor'}:</strong>
                                <div style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{msg.content}</div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div style={{ alignSelf: 'flex-start', color: '#777', fontStyle: 'italic' }}>AI is typing...</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                            disabled={!resumeText || chatLoading}
                            style={{
                                flex: 1,
                                padding: '15px',
                                borderRadius: '25px',
                                border: '1px solid #333',
                                background: '#2c2c2c',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleChat}
                            disabled={!resumeText || chatLoading}
                            style={{
                                background: '#03dac6',
                                color: '#000',
                                border: 'none',
                                padding: '0 25px',
                                borderRadius: '25px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                opacity: (!resumeText || chatLoading) ? 0.5 : 1
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CareerAdvisor;
