import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatJam, formatTanggal } from '../../../../../../utils/LocalDateTime';

const JamKhusus = () => {
  const [specialConfigs, setSpecialConfigs] = useState([]);
  useEffect(() => {
    fetchSpecialConfigs();
  }, []);

  const fetchSpecialConfigs = () => {
    axios.get('/api/cibinong/main/config-khusus')
      .then((response) => {
        setSpecialConfigs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching special configs:', error);
      });
  };


return (
    <div className="p-4">
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
                <hr className="my-2" />
              </li>
            ))}
          </ul>
        </div>

  );
}

export default JamKhusus;