import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const Pipeline = () => {
    const [stages, setStages] = useState([]);
    const [newStage, setNewStage] = useState({ name: '', stageOrder: 1 });

    useEffect(() => {
        fetchStages();
    }, []);

    const fetchStages = async () => {
        try {
            const data = await apiRequest('/pipeline');
            setStages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await apiRequest('/pipeline', 'POST', newStage);
            setNewStage({ name: '', stageOrder: stages.length + 1 });
            fetchStages();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Recruitment Pipeline</h2>

            <div style={{ marginBottom: '20px', padding: '15px', background: '#2c2c2c', borderRadius: '8px' }}>
                <h3>Add Stage</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px' }}>
                    <input placeholder="Stage Name" value={newStage.name} onChange={e => setNewStage({ ...newStage, name: e.target.value })} required className="input" />
                    <input type="number" placeholder="Order" value={newStage.stageOrder} onChange={e => setNewStage({ ...newStage, stageOrder: parseInt(e.target.value) })} required className="input" style={{ width: '80px' }} />
                    <button type="submit" className="button">Add Stage</button>
                </form>
            </div>

            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                {stages.map(stage => (
                    <div key={stage.id} style={{ minWidth: '250px', background: '#1e1e1e', padding: '15px', borderRadius: '8px' }}>
                        <h4>{stage.stageOrder}. {stage.name}</h4>
                        <div style={{ minHeight: '100px', background: '#2c2c2c', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                            Droppable Area
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pipeline;
