import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatJam, formatTanggal } from '../../../../../../utils/LocalDateTime';

const JamKhusus = () => {
  const [specialConfigs, setSpecialConfigs] = useState([]);
  const [formData, setFormData] = useState({
    tanggal: '',
    jamMulai: '00:00',
    jamBreak: '00:00',
    jamBreakAkhir: '00:00',
    jamTutup: '00:00',
  });

  useEffect(() => {
    fetchSpecialConfigs();
  }, []);

  const fetchSpecialConfigs = () => {
    axios.get('/api/ciledug/main/config-khusus')
      .then((response) => {
        setSpecialConfigs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching special configs:', error);
      });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const addSpecialConfig = (event) => {
    event.preventDefault();

    axios.post('/api/ciledug/main/config-khusus', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Special config added:', response.data);
        fetchSpecialConfigs(); // Refresh list after adding
        clearForm();
      })
      .catch((error) => {
        console.error('Error adding special config:', error);
      });
  };


  const deleteConfig = (configId) => {
    const confirmation = confirm('Are you sure you want to delete this special config?');
    if (confirmation) {
      axios.delete(`/api/ciledug/main/config-khusus?id=${configId}`)
        .then((response) => {
          console.log('Special config deleted:', response.data);
          fetchSpecialConfigs(); // Refresh list after deleting
        })
        .catch((error) => {
          console.error('Error deleting special config:', error);
        });
    }
  };

return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Config Jam Khusus</h2>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <form onSubmit={addSpecialConfig} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="tanggal" className="text-sm font-medium">
              Tanggal:
            </label>
            <input
              type="date"
              id="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="jamMulai" className="text-sm font-medium">
              Jam Mulai:
            </label>
            <input
              type="time"
              id="jamMulai"
              value={formData.jamMulai}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="jamBreak" className="text-sm font-medium">
              Jam Break:
            </label>
            <input
              type="time"
              id="jamBreak"
              value={formData.jamBreak}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="jamBreakAkhir" className="text-sm font-medium">
              Jam Break Akhir:
            </label>
            <input
              type="time"
              id="jamBreakAkhir"
              value={formData.jamBreakAkhir}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="jamTutup" className="text-sm font-medium">
              Jam Tutup:
            </label>
            <input
              type="time"
              id="jamTutup"
              value={formData.jamTutup}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
            >
              Add Special Config
            </button>
          </form>
        </div>

        <div className="w-1/2">
          <h3 className="text-xl font-semibold mb-5">Existing Special Configs</h3>
          <ul className="space-y-4">
            {specialConfigs.map((config) => (
              <li key={config.id} data-id={config.id}>
                <div className="text-sm font-medium">
                Tanggal: {formatTanggal(config.tanggal)}
              </div>
              <div className="text-sm">
                Jam Mulai: {formatJam(config.jam_mulai_sp) || '-'}
              </div>
              <div className="text-sm">
                Jam Break: {formatJam(config.jam_break_sp) || '-'}
              </div>
              <div className="text-sm">
                Jam Break Akhir: {formatJam(config.jam_break_akhir_sp) || '-'}
              </div>
              <div className="text-sm">
                Jam Tutup: {formatJam(config.jam_tutup_sp) || '-'}
              </div>
                <button
                  onClick={() => deleteConfig(config.id)}
                  className="text-sm text-red-500 hover:text-red-600 transition"
                >
                  Delete
                </button>
                <hr className="my-2" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default JamKhusus;