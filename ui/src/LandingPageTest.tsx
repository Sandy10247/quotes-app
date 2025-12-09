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

function LandingPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const fetchQuotes = async () => {
        try {
            const response = await util.axiosInstance.get('/quotes/all');
            const { quotes } = response.data;
            setQuotes(quotes);
        } catch (err) {
            setError('Failed to fetch quotes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Add Quote check :- ", token)
        if (token == "EMPTY") { navigate('/login') };
        fetchQuotes()
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content || !author) {
            setError('Please fill in both fields');
            return;
        }
        try {
            await axios.post('http://localhost:3001/quotes', { content, author }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Quote added!');
            setContent('');
            setAuthor('');
            setError('');
            fetchQuotes(); // Refresh the quote list
        } catch (err) {
            setError('Failed to add quote');
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
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Section 1: Show All User Quotes */}
                    <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Quotes</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {quotes.length === 0 ? (
                            <p className="text-gray-600 text-center">No quotes yet. Add some!</p>
                        ) : (
                            <ul className="space-y-4">
                                {quotes.map((quote) => (
                                    <li key={quote.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                                        <p className="text-xl italic text-gray-800 mb-2">"{quote.content}"</p>
                                        <p className="text-right text-gray-600">- {quote.author}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Section 2: Add Quote Form */}
                    <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Quote</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                    Quote Content
                                </label>
                                <input
                                    id="content"
                                    type="text"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter quote content"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                                    Author
                                </label>
                                <input
                                    id="author"
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
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
                        {success && <p className="mt-4 text-green-500 text-center">{success}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;