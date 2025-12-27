import { useState, useEffect } from 'react';

const CommentItem = ({ comment, currentUser, role, onDelete, onReply, token }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const canDelete = (comment) => {
        return role === 'ROLE_ADMIN' || (currentUser && comment.user && comment.user.username === currentUser);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        await onReply(comment.id, replyText);
        setReplyText('');
        setIsReplying(false);
    };

    return (
        <div style={{ padding: '10px', borderLeft: '2px solid #555', marginLeft: comment.parent ? '20px' : '0', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#03dac6' }}>{comment.user ? comment.user.username : 'Unknown'}</strong>
                <span style={{ fontSize: '12px', color: '#888' }}>
                    {new Date(comment.createdAt).toLocaleString()}
                </span>
            </div>
            <p style={{ color: '#eee', margin: '5px 0' }}>{comment.text}</p>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setIsReplying(!isReplying)}
                    style={{ background: 'transparent', border: 'none', color: '#bb86fc', cursor: 'pointer', fontSize: '12px' }}
                >
                    Reply
                </button>
                {canDelete(comment) && (
                    <button
                        onClick={() => onDelete(comment.id)}
                        style={{ background: 'transparent', border: 'none', color: '#cf6679', cursor: 'pointer', fontSize: '12px' }}
                    >
                        Delete
                    </button>
                )}
            </div>

            {isReplying && (
                <form onSubmit={handleReplySubmit} style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: 'white' }}
                    />
                    <button type="submit" style={{ padding: '5px 10px', background: '#bb86fc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reply</button>
                </form>
            )}

            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUser={currentUser}
                            role={role}
                            onDelete={onDelete}
                            onReply={onReply}
                            token={token}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection = ({ jobId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchComments();
    }, [jobId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/comments/job/${jobId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (err) {
            console.error("Error fetching comments", err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/api/comments/job/${jobId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: newComment })
            });

            if (response.ok) {
                setNewComment('');
                fetchComments();
            } else {
                const errText = await response.text();
                setError(`Failed: ${response.status} - ${errText}`);
            }
        } catch (err) {
            setError('Error posting comment');
        }
    };

    const handleReply = async (commentId, text) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                fetchComments();
            } else {
                alert("Failed to post reply");
            }
        } catch (err) {
            console.error("Error replying", err);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchComments();
            } else {
                alert("Failed to delete comment");
            }
        } catch (err) {
            console.error("Error deleting comment", err);
        }
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px', background: '#2d2d2d', borderRadius: '8px' }}>
            <h4 style={{ color: '#bb86fc' }}>Comments</h4>

            <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: '20px' }}>
                {comments.length === 0 ? <p style={{ color: '#888' }}>No comments yet.</p> : (
                    comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            role={role}
                            onDelete={handleDelete}
                            onReply={handleReply}
                            token={token}
                        />
                    ))
                )}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: 'white' }}
                />
                <button type="submit" style={{ padding: '10px 20px', background: '#bb86fc', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Post</button>
            </form>
            {error && <p style={{ color: '#cf6679', fontSize: '12px' }}>{error}</p>}
        </div>
    );
};

export default CommentSection;
