import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AddQuote from './AddQuote';
import { AuthProvider } from './AuthContext';
// import LandingPage from './LandingPage';
// import LandingPageTest from './LandingPageTest'
import LandingPagePure from './LandingPagePure';
import Dashboard from './QuoteDashboard';
// import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/add-quote" element={<AddQuote />} />
                </Routes>
            </Router>
        </AuthProvider>
    </React.StrictMode>
);