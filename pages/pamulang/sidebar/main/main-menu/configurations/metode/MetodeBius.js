import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MetodeBius = () => {
  const [metodeBiusList, setMetodeBiusList] = useState([]);
  const [newMetode, setNewMetode] = useState({ nama_bius: '' });
  const [editMetode, setEditMetode] = useState({ id: null, nama_bius: '' });

  useEffect(() => {
    fetchMetodeBiusList();
  }, []);

  const fetchMetodeBiusList = () => {
    axios.get('/api/pamulang/main/metodebius')
      .then((response) => {
        setMetodeBiusList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMetode({ ...newMetode, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/pamulang/main/metodebius', newMetode)
      .then(() => {
        fetchMetodeBiusList();
        setNewMetode({ nama_bius: '' });
      })
      .catch((error) => {
        console.error('Error adding data:', error);
      });
  };

  const handleEdit = (id, namaMetode) => {
    setEditMetode({ id, nama_bius: namaMetode });
  };

  const handleUpdate = () => {
    axios.put(`/api/pamulang/main/metodebius?id=${editMetode.id}`, editMetode)
      .then(() => {
        fetchMetodeBiusList();
        setEditMetode({ id: null, nama_bius: '' });
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };


  const handleDelete = (id) => {
    const shouldDelete = window.confirm('Apakah Anda yakin ingin menghapus data ini?');

    if (!shouldDelete) {
      return; // Batal menghapus jika pengguna membatalkan konfirmasi
    }

    // Menghapus data dari server menggunakan Axios
    axios.delete(`/api/pamulang/main/metodebius?id=${id}`) // Ganti dengan URL delete endpoint yang sesuai
      .then(() => {
        // Setelah berhasil menghapus data, ambil ulang daftar metodeBiusList
        fetchMetodeBiusList();
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
      });
  };

  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mt-10">Metode Bius</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Nama Metode</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {metodeBiusList.map((metode, index) => (
            <tr key={metode.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{editMetode.id === metode.id ? (
                <input
                  type="text"
                  name="nama_bius"
                  value={editMetode.nama_bius}
                  onChange={(e) => setEditMetode({ ...editMetode, nama_bius: e.target.value })}
                  className="mr-2 px-2 py-1 border rounded"
                  required
                />
              ) : (
                metode.nama_bius
              )}</td>
              <td className="border border-gray-300 px-4 py-2">
                {editMetode.id === metode.id ? (
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(metode.id, metode.nama_bius)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(metode.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          name="nama_bius"
          value={newMetode.nama_bius}
          onChange={handleInputChange}
          placeholder="Nama Metode"
          className="mr-2 px-2 py-1 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Tambahkan
        </button>
      </form>
    </div>
  );
}

export default MetodeBius;
