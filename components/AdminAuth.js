import { useState } from 'react';
import { auth, signInWithEmailAndPassword, signOut } from '../lib/firebaseClient';
import { useAdmin } from '../lib/adminContext';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isAdmin, isLoading } = useAdmin();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError('Error signing out');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAdmin) {
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}