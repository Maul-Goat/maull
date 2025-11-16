
import React, { useState } from 'react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'mykisah') {
            onLoginSuccess();
        } else {
            setError('Incorrect password.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Admin Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-br from-[#FFB6D9] to-[#FF85B5] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Enter
                    </button>
                </form>
                 <button onClick={() => window.location.hash = ''} className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700">
                    Back to Portfolio
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
