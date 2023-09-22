// pages/jam.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatJam } from '../../../../../../utils/LocalDateTime';

const JamUmum = () => {
  const [jam, setJam] = useState([]);

  useEffect(() => {
    // Mengambil data jam dari endpoint yang telah Anda buat
    axios.get('/api/cibinong/main/configurations') // Gantilah '/api/cibinong/main/endpoint' dengan URL yang sesuai
      .then((response) => {
        setJam(response.data);
      })
      .catch((error) => {
        console.error('Error fetching jam:', error);
      });
  }, []);




  return (
    <div className="p-4">
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
        </div>
      
    </div>
  );
};

export default JamUmum;
