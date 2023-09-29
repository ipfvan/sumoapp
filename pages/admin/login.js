

// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import LoadingLogin from '../LoadingLogin';


require('dotenv').config();

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)

    // Hapus cookie yang sudah ada
    document.cookie = 'MyUsername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
    try {

      const response = await fetch(`/api/${username}/authenticate`, {
        method: 'POST',
        body: JSON.stringify({ password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {

        // Setel cookie baru
        document.cookie = `myUsername=${username}; path=/`;
        router.push(`/admin`);
      } else {
        alert('Data Wrong');
      setIsLoading(false);
    }
    } catch (error) {
      // Tangani kesalahan di sini, misalnya, tampilkan pesan kesalahan
      console.error('Error:', error);
      setMessage('An error occurred while authenticating.');
    } 
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
    <div>
    {isLoading ? (
      // Tampilkan komponen Loading selama isLoading adalah true
      <LoadingLogin />
    ) : (
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4">What Are You Looking For?</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />
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
      </div>
              )}
          </div> 
    </div>
  );
};

export default LoginPage;
