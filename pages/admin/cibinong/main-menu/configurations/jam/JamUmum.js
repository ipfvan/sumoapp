// pages/jam.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatJam } from '../../../../../utils/LocalDateTime';

const JamUmum = () => {

  const [jam, setJam] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    jamMulai: '',
    jamBreak: '',
    jamBreakAkhir: '',
    jamTutup: '',
  });

  useEffect(() => {
    // Mengambil data jam dari endpoint yang telah Anda buat
    axios.get('/api/cibinong/configurations') // Gantilah '/api/cibinong/endpoint' dengan URL yang sesuai
      .then((response) => {
        setJam(response.data);
      })
      .catch((error) => {
        console.error('Error fetching jam:', error);
      });
  }, []);

  const handleEditClick = () => {
    const cibinongauthenticated = document.cookie.includes('myUsername=cibinong');

if (cibinongauthenticated) {
    setEditing(true);
    // Mengisi data formulir dengan data jam yang ada
    if (jam.length > 0) {
      const jamItem = jam[0];
      setFormData({
        jamMulai: jamItem.jam_mulai,
        jamBreak: jamItem.jam_break,
        jamBreakAkhir: jamItem.jam_break_akhir,
        jamTutup: jamItem.jam_tutup,
      });
    }
  } else {
    alert('Acces Denied')
  }
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

const handleUpdateClick = () => {
  // Mengirim data formulir yang diperbarui ke server untuk pembaruan
  axios.post('/api/cibinong/configurations', formData)
    .then((response) => {
      console.log('Configuration updated successfully');
      setEditing(false);

      // Lakukan fetch ulang untuk mendapatkan data yang paling mutakhir
      axios.get('/api/cibinong/configurations')
        .then((response) => {
          setJam(response.data);
        })
        .catch((error) => {
          console.error('Error fetching jam after update:', error);
        });
    })
    .catch((error) => {
      console.error('Error updating configuration:', error);
    });
};



  return (
    <div className="flex bg-purple-200 justify-center items-center p-20 ">
    <div className="border rounded-lg shadow-lg bg-white p-10">
      <h2 className="text-3xl font-bold mb-4">Config Jam Umum</h2>
      {editing ? (
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block font-semibold">Jam Mulai:</label>
            <input
              type="time"
              name="jamMulai"
              value={formData.jamMulai}
              onChange={handleInputChange}
              className="border rounded py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Jam Break:</label>
            <input
              type="time"
              name="jamBreak"
              value={formData.jamBreak}
              onChange={handleInputChange}
              className="border rounded py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Jam Break Akhir:</label>
            <input
              type="time"
              name="jamBreakAkhir"
              value={formData.jamBreakAkhir}
              onChange={handleInputChange}
              className="border rounded py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Jam Tutup:</label>
            <input
              type="time"
              name="jamTutup"
              value={formData.jamTutup}
              onChange={handleInputChange}
              className="border rounded py-2 px-3"
            />
          </div>
          <div>
            <button
              onClick={handleUpdateClick}
              className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
         <ul className="list-disc pl-4">
  {jam.map((jamItem, index) => (
    <li key={index}>
      Jam Mulai: {formatJam(jamItem.jam_mulai)}
      <br />
      Jam Break: {formatJam(jamItem.jam_break)}
      <br />
      Jam Break Akhir: {formatJam(jamItem.jam_break_akhir)}
      <br />
      Jam Tutup: {formatJam(jamItem.jam_tutup)}
    </li>
  ))}
</ul>
          <button
            onClick={handleEditClick}
            className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          >
            Edit
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default JamUmum;
