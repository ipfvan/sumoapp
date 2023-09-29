import { useState, useEffect } from 'react';
import axios from 'axios';

const ChangePasswordCiledug = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/menyembunyikan password



  useEffect(() => {
    // Lakukan permintaan GET ke endpoint API
    axios.get('/api/ciledug/current-password')
      .then((response) => {
        setCurrentPassword(response.data.password);
      })
      .catch((error) => {
        console.error('Failed to fetch current password', error);
      });
  }, []);

  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const passwordInputType = showPassword ? 'text' : 'password';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/ciledug/update-password', { newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to update password');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-200">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Edit Password</h1>
        <div className='mb-5'>
          <h1>
            Current Password :{' '}
            <span className={showPassword ? 'text-black' : 'text-transparent'}>
              {currentPassword}
            </span>
            <button
              onClick={handleTogglePassword}
              className="ml-2 focus:outline-none"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
            </label>
            <input
              type={passwordInputType}
              id="newPassword"
              name="newPassword"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-purple-900 text-white px-4 py-2 rounded-md hover:bg-purple-900"
            >
              Update Password
            </button>
          </div>
          {message && <div className="text-indigo-600">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordCiledug;
