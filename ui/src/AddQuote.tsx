import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import * as util from './util';


function AddQuote() {
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [success, setSuccess] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        console.log("Add Quote check :- ", token)
        if (token == "EMPTY") { navigate('/login') };
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await util.axiosInstance.post('/quotes', { content, author });
            setSuccess('Quote added!');
            setContent('');
            setAuthor('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Add Quote</h2>
            <form onSubmit={handleSubmit}>
                <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Quote Content" required />
                <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required />
                <button type="submit">Add</button>
            </form>
            {success && <p>{success}</p>}
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default AddQuote;