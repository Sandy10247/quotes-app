import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import * as util from './util';

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin && password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        util.axiosInstance.post('/users/login', {
            user: {
                email,
                password,
            }
        }).then(response => {
            const { user: { token } } = response.data;
            login(token);
            navigate('/');
            // Handle login or signup logic here (e.g., API call)
            console.log({ email, password });
            // Reset fields
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        }).catch(err => {
            console.error("error :- ", err);
        });


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                            autoComplete='off'
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            autoComplete='off'
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1 text-blue-600 hover:underline focus:outline-none"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthForm;