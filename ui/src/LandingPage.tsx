import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import * as util from './util';
import AddQuote from './AddQuote';

interface Quote {
    id: number;
    content: string;
    author: string;
}

function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Add Quote check :- ", token)
        if (token == "EMPTY") { navigate('/login') };
    }, [token]);

    useEffect(() => {

        const fetchQuotes = async () => {
            try {
                const response = await util.axiosInstance.get('/quotes/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { quotes } = response.data;
                setQuotes(quotes);
            } catch (err) {
                setError('Failed to fetch quotes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [token, navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Your Quotes</h1>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Logout
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {quotes.length === 0 ? (
                    <p className="text-gray-600 text-center">No quotes yet. Add some!</p>
                ) : (
                    <ul className="space-y-6">
                        {quotes.map((quote) => (
                            <li key={quote.id} className="bg-white shadow-md rounded-lg p-6">
                                <p className="text-xl italic text-gray-800 mb-2">"{quote.content}"</p>
                                <p className="text-right text-gray-600">- {quote.author}</p>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/add-quote')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add New Quote
                    </button>
                </div>
            </div>
            <AddQuote />
        </div>
    );
}

export default QuotesPage;