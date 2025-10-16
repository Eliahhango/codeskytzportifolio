import { useState, useEffect } from 'react';

export default function AdminAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store session token in localStorage or sessionStorage
        sessionStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear session token
      sessionStorage.removeItem('admin_token');
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token));
        if (payload.exp > Date.now() && payload.admin) {
          setIsLoggedIn(true);
        } else {
          sessionStorage.removeItem('admin_token');
        }
      } catch (error) {
        sessionStorage.removeItem('admin_token');
      }
    }
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (isLoggedIn) {
    return (
      <div className="p-4">
        <p className="text-green-600 mb-4">Logged in as admin</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="p-4 space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}