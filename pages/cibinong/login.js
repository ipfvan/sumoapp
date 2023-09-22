// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

require('dotenv').config(); 

const LoginPage = () => {

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/cibinong/main/authenticate', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {

      document.cookie = 'authenticatedcibinong=true; path=/';

      router.push('/cibinong');
    } else {
      setMessage('Authentication failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">What Are You Looking For?</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />
          <button
            type="submit"
            className="bg-purple-900 hover:bg-blue-600 text-white rounded p-2 w-full"
          >
            Login
          </button>
        </form>
        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
