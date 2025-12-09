import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import * as util from './util';

interface Quote {
    id: number;
    content: string;
    author: string;
}

function Dashboard() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [newContent, setNewContent] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editAuthor, setEditAuthor] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const fetchQuotes = async () => {
        try {
            const response = await util.axiosInstance.get('/quotes/all');
            const { quotes } = response.data;
            setQuotes(quotes || []);
        } catch (err) {
            setError('Failed to fetch quotes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token == "EMPTY") { navigate('/login'); return; };
        fetchQuotes()
    }, [token]);

    const handleLogout = () => {
        logout()
        navigate("/login")
    }


    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContent || !newAuthor) {
            setError('Please fill in both fields for new quote');
            return;
        }
        try {
            await util.axiosInstance.post('/quotes', { content: newContent, author: newAuthor },);
            setSuccess('Quote added!');
            setTimeout(() => {
                setSuccess("");
            }, 2 * 1_000)
            setNewContent('');
            setNewAuthor('');
            setError('');
            fetchQuotes();
        } catch (err) {
            setError('Failed to add quote');
            console.error(err);
        }
    };

    const startEdit = (quote: Quote) => {
        setEditingId(quote.id);
        setEditContent(quote.content);
        setEditAuthor(quote.author);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
        setEditAuthor('');
    };

    const handleEditSubmit = async (e: React.FormEvent, id: number) => {
        e.preventDefault();
        if (!editContent || !editAuthor) {
            setError('Please fill in both fields for edit');
            return;
        }
        try {

            await util.axiosInstance.post(`/quotes/${id}`, { content: editContent, author: editAuthor });
            setSuccess('Quote updated!');
            setTimeout(() => {
                setSuccess("");
            }, 2 * 1_000)
            setEditingId(null);
            setError('');
            fetchQuotes();
        } catch (err) {
            setError('Failed to update quote');
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this quote?')) return;
        try {
            await util.axiosInstance.delete(`/quotes/${id}`);
            setSuccess('Quote deleted!');
            setTimeout(() => {
                setSuccess("");
            }, 2 * 1_000)
            fetchQuotes();
        } catch (err) {
            setError('Failed to delete quote');
            console.error(err);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Quote Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Logout
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Quotes List */}
                    <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Quotes</h2>
                        {quotes.length === 0 ? (
                            <p className="text-gray-600 text-center">No quotes yet. Add some!</p>
                        ) : (
                            <ul className="space-y-4">
                                {quotes.map((quote) => (
                                    <li key={quote.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                                        {editingId === quote.id ? (
                                            <form onSubmit={(e) => handleEditSubmit(e, quote.id)} className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Edit quote content"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    value={editAuthor}
                                                    onChange={(e) => setEditAuthor(e.target.value)}
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Edit author"
                                                    required
                                                />
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        type="submit"
                                                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-xl italic text-gray-800 mb-2">"{quote.content}"</p>
                                                        <p className="text-right text-gray-600">- {quote.author}</p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => startEdit(quote)}
                                                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(quote.id)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Add Quote Form */}
                    <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Quote</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="newContent" className="block text-sm font-medium text-gray-700">
                                    Quote Content
                                </label>
                                <input
                                    id="newContent"
                                    type="text"
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter quote content"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="newAuthor" className="block text-sm font-medium text-gray-700">
                                    Author
                                </label>
                                <input
                                    id="newAuthor"
                                    type="text"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter author name"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Add Quote
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;