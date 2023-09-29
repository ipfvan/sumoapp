

import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { formatTanggal, formatJam, convertedTanggal, parseTanggal} from '../../../../utils/LocalDateTime';
import moment from 'moment';
import { parseISO, format } from 'date-fns';
import LoadingLogistik from '@/pages/LoadingLogistik';

export default function DataPasien()  {
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTime, setAvailableTime] = useState('');
  const [tanggalDaftar, setTanggalDaftar] = useState(new Date().toISOString().split('T')[0]);
  const [jam, setJam] = useState(availableTime);  
  const [selectedStartDate, setSelectedStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedEndDate, setSelectedEndDate] =  useState('2050-12-31');;
  const [dataPasien, setDataPasien] = useState([]);
  const [pasien, setPasien] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState({});
  const [activeForm, setActiveForm] = useState(1);

  
  
  const [resepsionisOptions, setResepsionisOptions] = useState([]);
  const [kaosOptions, setKaosOptions] = useState([]);
  const [celanaOptions, setCelanaOptions] = useState([]);
  const [obatNyeriOptions, setObatNyeriOptions] = useState([]);
  const [obatAntibiotikOptions, setObatAntibiotikOptions] = useState([]);
  const [obatBengkakOptions, setObatBengkakOptions] = useState([]);
  const [suppOptions, setSuppOptions] = useState([]);
  const [klampOptions, setKlampOptions] = useState([]);
  const [staplerOptions, setStaplerOptions] = useState([]);
  useEffect(() => {
    const fetchOptions = async (kategori, setOptions) => {
      try {
        const response = await axios.get(`/api/cibinong/items-by-category?kategori=${kategori}`);
        setOptions(response.data.items);
      } catch (error) {
        console.error(`Error fetching ${kategori} options: `, error);
      }
    };
    fetchOptions('Resepsionis', setResepsionisOptions);
    fetchOptions('Kaos', setKaosOptions);
    fetchOptions('Celana', setCelanaOptions);
    fetchOptions('Obat Nyeri', setObatNyeriOptions);
    fetchOptions('Obat Antibiotik', setObatAntibiotikOptions);
    fetchOptions('Obat Bengkak', setObatBengkakOptions);
    fetchOptions('Supp', setSuppOptions);
    fetchOptions('Klamp', setKlampOptions);
    fetchOptions('Stapler', setStaplerOptions);
  }, []);
  
  const findItemNameById = (itemId, options) => {
    const selectedItem = options.find((item) => item.id === itemId);
    return selectedItem ? selectedItem.item : '';
  };
  
  

  const convertToISODate = (ddmmyyyy) => {
    const parts = ddmmyyyy.split('/');
    const isoDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
    return isoDate;
  };
  
  
  const handleTabClick = (formIndex) => {
    setActiveForm(formIndex);
  };


  const [editData, setEditData] = useState({
    // Inisialisasi data yang akan diedit
    id: '',
    tanggal: '',
    jam: '',
    status: '',
    keterangan: '',
    nama: '',
    usia: '',
    orang_tua: '',
    metode_sunat: '',
    cek_anatomi: '',
    metode_bius: '',
    no_telp: '',
    alamat: '',
    dokter_praktik: '', 
    goody_bag_p: '',
    nacl_p: '',
    butbut_p: '',
    tumblr_p: '',
    kaos_p: '',
    celana_p: '',
    nyeri_p: '',
    antibiotik_p: '',
    bengkak_p: '',
    supp_p: '',
    klamp_p: '',
    stapler_p: '',  
  });
  
  const handleEditClick = (pasien) => {
 

    const cibinongauthenticated = document.cookie.includes('myUsername=cibinong');

if (cibinongauthenticated) {
    setSelectedPasien(pasien);
    setEditData({
      id: pasien.id,
      tanggal: formatTanggal(pasien.tanggal),
      jam: formatJam(pasien.jam),
      status: pasien.status,
      keterangan: pasien.keterangan,
      nama: pasien.nama,
      usia: pasien.usia,
      orang_tua: pasien.orang_tua,
      metode_sunat: pasien.metode_sunat,
      anatomi: pasien.anatomi,
      metode_bius: pasien.metode_bius,
      no_telp: pasien.no_telp,
      alamat: pasien.alamat,
      dokter_praktik: pasien.dokter_praktik, 
      goody_bag_p: pasien.goody_bag_p,
      nacl_p: pasien.nacl_p,
      butbut_p: pasien.butbut_p,
      tumblr_p: pasien.tumblr_p,
      kaos_p: pasien.kaos_p,
      celana_p: pasien.celana_p,
      nyeri_p: pasien.nyeri_p,
      antibiotik_p: pasien.antibiotik_p,
      bengkak_p: pasien.bengkak_p,
      supp_p: pasien.supp_p,
      klamp_p: pasien.klamp_p,
      stapler_p: pasien.stapler_p,
      // Set data lainnya yang akan diedit
    });
    setShowModal(true);
  } else {
    alert('Acces Denied')
  }
  };


const handleEditDataChange = (e) => {
  const { name, value } = e.target;
  setEditData((prevData) => ({
    ...prevData,
    [name]: value,
  }));

  setSelectedPasien((prevPasien) => ({
    ...prevPasien,
    [name]: value,
  }));
};


const handleEditSubmit = async (e) => {
  e.preventDefault();
  const cibinongauthenticated = document.cookie.includes('myUsername=cibinong');

if (cibinongauthenticated) {
    setIsLoading(true);
  try {
    const isoTanggal = convertToISODate(editData.tanggal);

    const cases = [
      "goody_bag_p",
      "nacl_p",
      "butbut_p",
      "tumblr_p",
      "kaos_p",
      "celana_p",
      "nyeri_p",
      "antibiotik_p",
      "bengkak_p",
      "supp_p",
      "klamp_p",
      "stapler_p"
    ];

    for (const caseItem of cases) {
      const modifiedId = `${cases.indexOf(caseItem) + 1}${editData.id}001`;
      const transaksiKeluarResponse = await axios.get(`/api/cibinong/transaksikeluar?id=${modifiedId}`);

      const postData = {
        id: modifiedId,
        barang_id: editData[caseItem],
        tanggal_transaksi: isoTanggal,
        qty: 1,
        penerima: editData.nama,
      };

      if (transaksiKeluarResponse.data.length === 0) {
        const postResponse = await axios.post(`/api/cibinong/transaksikeluar`, postData);
        console.log(postResponse.data.message);
      } else {
        const updateResponse = await axios.put(`/api/cibinong/transaksikeluar`, {
          id: transaksiKeluarResponse.data[0].id,
          ...postData
        });
        console.log(updateResponse.data.message);
      }
    }

    const response = await axios.put(`/api/cibinong/pasien?id=${selectedPasien.id}`, {
      ...editData,
      tanggal: isoTanggal,
    });
    console.log(response.data.message);
    setShowModal(false);
    fetchFilteredData(selectedStartDate, selectedEndDate);
  } catch (error) {
    console.error('Error editing patient data: ', error);
  }  finally {
    setIsLoading(false); // Set isLoading menjadi false setelah selesai fetch data
  }
}
};





  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus data ini?'); 
    const cibinongauthenticated = document.cookie.includes('myUsername=cibinong');

if (cibinongauthenticated) {  
    if (isConfirmed) {
      try {
        const response = await axios.delete(`/api/cibinong/pasien?id=${id}`);
        console.log(response.data.message);
  
        // Lakukan fetch ulang data setelah berhasil menghapus
        fetchFilteredData(selectedStartDate, selectedEndDate);
      } catch (error) {
        console.error('Error deleting patient data: ', error);
      }
    }
  } else {
    alert('Acces Denied')
  }
  };

  
  const [metodeSunatOptions, setMetodeSunatOptions] = useState([]);
  useEffect(() => {
    const fetchMetodeSunatOptions = async () => {
      try {
        const response = await axios.get('/api/cibinong/metode-sunat');
        setMetodeSunatOptions(response.data.metodeSunatOptions);
      } catch (error) {
        console.error('Error fetching metode sunat options: ', error);
      }
    };
  
    fetchMetodeSunatOptions();
  }, []);



  const [metodeBiusOptions, setMetodeBiusOptions] = useState([]);
  useEffect(() => {
    const fetchMetodeBiusOptions = async () => {
      try {
        const response = await axios.get('/api/cibinong/metode-bius');
        setMetodeBiusOptions(response.data.metodeBiusOptions);
      } catch (error) {
        console.error('Error fetching metode bius options: ', error);
      }
    };
  
    fetchMetodeBiusOptions();
  }, []);

 
  
  // Fungsi untuk mengambil data pasien berdasarkan tanggal filter
  const fetchFilteredData = async () => {
    try {
      const response = await axios.get(`/api/cibinong/pasien`, {
        params: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        },
      });
      setDataPasien(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // Panggil fungsi fetchFilteredData saat komponen dimuat pertama kali atau saat selectedStartDate berubah
  useEffect(() => {
    fetchFilteredData();
  }, [selectedStartDate, selectedEndDate]);

  // Fungsi untuk meng-handle perubahan tanggal awal
  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    setSelectedStartDate(startDate);
    setSelectedEndDate(startDate); // Set tanggal akhir sama dengan tanggal awal saat pertama kali diubah
  };

  // Fungsi untuk meng-handle perubahan tanggal akhir
  const handleEndDateChange = (event) => {
    setSelectedEndDate(event.target.value);
  };


  const handleJamChange =  async (event) => {
    setJam(event.target.value);
  };
  const handleDateChange = async (event) => {
    const selectedDateString = event.target.value;

    try {
    const response = await axios.get(`/api/cibinong/available-times?tanggal=${selectedDateString}`);
    setAvailableTime(response.data.availableTime);

    // Tampilkan pesan sebagai alert
    
  } catch (error) {
    console.error('Error fetching available times: ', error);
  }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const cibinongauthenticated = document.cookie.includes('myUsername=cibinong');

if (cibinongauthenticated) {
   // Dapatkan nilai dari input-form sesuai dengan nama kolom di database
    const formData = new FormData(event.target);
    formData.append('tanggal_daftar', tanggalDaftar);
    const data = {
      tanggal_daftar: new Date(),
      tanggal: formData.get('tanggal') || '---',
      jam: formData.get('jam') || '---',
      nama: formData.get('nama') || '---',
      usia: formData.get('usia') || '---',
      orang_tua: formData.get('orang_tua') || '---',
      metode_sunat: formData.get('metode_sunat') || '---',
      anatomi: formData.get('anatomi') || '---',
      metode_bius: formData.get('metode_bius') || '---',
      no_telp: formData.get('no_telp') || '---',
      alamat: formData.get('alamat') || '---',
      keterangan: formData.get('keterangan') || '---',
      status: 'Daftar Offline',
    dokter_praktik: '---', 
    goody_bag_p: '---',
    nacl_p: '---',
    butbut_p: '---',
    tumblr_p: '---',
    kaos_p: '---',
    celana_p: '---',
    nyeri_p: '---',
    antibiotik_p: '---',
    bengkak_p: '---',
    supp_p: '---',
    klamp_p: '---',
    stapler_p: '---',


    };

    try {
      await axios.post('/api/cibinong/pasien', data);
      alert('Pendaftaran berhasil!');
      fetchFilteredData(selectedStartDate, selectedEndDate);
     
      // Reset form setelah pendaftaran berhasil
      event.target.reset();
    } catch (error) {
      console.error('Error submitting form: ', error);
      alert('Terjadi kesalahan saat mengirimkan pendaftaran.');
    }
  } else{
    alert('Acces Denied')
  }
  };

  

  return (
 
    <div className="min-h-screen bg-gray-100 rounded-xl">
         <div>
    {isLoading ? (
      // Tampilkan komponen Loading selama isLoading adalah true
      <LoadingLogistik />
    ) : (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-4">Form Pendaftaran Pasien</h1>
        <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
          <div className="flex space-x-4">
            <label htmlFor="tanggal" className="w-1/3 flex-shrink-0">Tanggal</label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              onChange={handleDateChange}
              className="w-full border p-2 rounded" placeholder='DD/MM/YYYY'
            />
          </div>
          <div className="flex space-x-4">
            <label htmlFor="jam" className="w-1/3 flex-shrink-0">Jam</label>
            <input
              type="time"
              id="jam"
              name="jam"
              defaultValue={availableTime}
              onBlur={(e) => setJam(e.target.value)}
              className="w-full border p-2 rounded" placeholder='HH:MM'
            />
          </div>
          {/* Lanjutkan dengan input lainnya */}
          {/* Input Nama */}
        <div className="flex space-x-4">
          <label htmlFor="nama" className="w-1/3 flex-shrink-0">Nama</label>
          <input
            type="text"
            id="nama"
            name="nama"
            className="w-full border p-2 rounded" placeholder='Nama'
          />
        </div>

        {/* Input Usia */}
        <div className="flex space-x-4">
          <label htmlFor="usia" className="w-1/3 flex-shrink-0">Usia</label>
          <input
            type="text"
            id="usia"
            name="usia"
            className="w-full border p-2 rounded" placeholder='Usia'
          />
        </div>

        {/* Input Orang Tua */}
        <div className="flex space-x-4">
          <label htmlFor="orang_tua" className="w-1/3 flex-shrink-0">Orang Tua</label>
          <input
            type="text"
            id="orang_tua"
            name="orang_tua"
            className="w-full border p-2 rounded" placeholder='Orang Tua'
          />
        </div>

        {/* Input Metode */}
        <div className="flex space-x-4">
  <label htmlFor="metode_sunat" className="w-1/3 flex-shrink-0">Metode Sunat</label>
  <select
    id="metode_sunat"
    name="metode_sunat"
    className="w-full border p-2 rounded"
  >
    <option value="">Pilih Metode Sunat</option>
    {metodeSunatOptions.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
</div>

{/* Input Anatomi */}
<div className="flex space-x-4">
  <label htmlFor="anatomi" className="w-1/3 flex-shrink-0">Anatomi</label>
  <select
    id="anatomi"
    name="anatomi"
    className="w-full border p-2 rounded"
  >
    <option value="">Pilih Anatomi</option>
    <option value="Nanggung">Nanggung</option>
    <option value="Belum Cek">Belum Cek</option>
    <option value="Sudah Cek">Sudah Cek</option>
    <option value="Kelainan Lain">Kelainan Lain</option>
  </select>
</div>


{/* Input Metode Bius */}
<div className="flex space-x-4">
  <label htmlFor="metode_bius" className="w-1/3 flex-shrink-0">Metode Bius</label>
  <select
    id="metode_bius"
    name="metode_bius"
    className="w-full border p-2 rounded"
  >
    <option value="">Pilih Metode Bius</option>
    {metodeBiusOptions.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
</div>

<div className="flex space-x-4">
  <label htmlFor="no_telp" className="w-1/3 flex-shrink-0">No Telp</label>
  <input
    type="text"
    id="no_telp"
    name="no_telp"
    className="w-full border p-2 rounded" placeholder='No Telp'
  />
</div>
<div className="flex space-x-4">
  <label htmlFor="alamat" className="w-1/3 flex-shrink-0">Alamat</label>
  <input
    type="text"
    id="alamat"
    name="alamat"
    className="w-full border p-2 rounded" placeholder='alamat'
  />
</div>


{/* ... Lanjutkan dengan input lainnya */}

{/* Input Keterangan */}
<div className="flex space-x-4">
  <label htmlFor="keterangan" className="w-1/3 flex-shrink-0">Keterangan</label>
  <input
  type="text"
  id="keterangan"
  name="keterangan"
  className="w-full border p-2 rounded"
/>
</div>
        {/* ... Lanjutkan dengan input lainnya */}
          <button
            type="submit"
            className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Daftar
          </button>
        </form >
          <h2 className="text-xl font-semibold mt-8">Data Pasien</h2>
          <div className="flex space-x-4 mb-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="startDate"></label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="endDate"></label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={selectedEndDate}
              onChange={handleEndDateChange}
              className="border p-2 rounded"
            />
          </div>
        </div>
          
        <div className="overflow-x-auto shadow-md sm:roundedl-g1">
          <table className="table-auto w-full border mt-4">
            <thead>
              <tr className="bg-purple-900 text-white uppercase text-sm leading-normal"> 
              <th className="py-3 px-4 text-left">no</th> 
                <th className="py-3 px-4 text-left">Tanggal</th>
                <th className="py-3 px-4 text-left">Jam</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Keterangan</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Usia</th>
                <th className="py-3 px-4 text-center">Orang Tua</th>
                <th className="py-3 px-4 text-left">Metode</th>
                <th className="py-3 px-4 text-left">Anatomi</th>
                <th className="py-3 px-4 text-left">Bius</th>
                <th className="py-3 px-4 text-left">No. Telp</th>
                <th className="py-3 px-4 text-left">Alamat</th>
                <th className="py-3 px-4 text-center">Dokter</th>
                <th className="py-3 px-4 text-center">Tanggal Daftar</th>
                <th className="py-3 px-4 text-center">Goody Bag</th>
                <th className="py-3 px-4 text-center">NaCl</th>
                <th className="py-3 px-4 text-center">But But</th>
                <th className="py-3 px-4 text-center">Tumblr</th>
                <th className="py-3 px-4 text-center">Kaos</th>
                <th className="py-3 px-4 text-center">Celana</th>
                <th className="py-3 px-4 text-center">Nyeri</th>
                <th className="py-3 px-4 text-center">Antibiotik</th>
                <th className="py-3 px-4 text-center">Bengkak</th>
                <th className="py-3 px-4 text-center">Supp</th>
                <th className="py-3 px-4 text-center">Klamp</th>
                <th className="py-3 px-4 text-center">Stapler</th>
                <th className="py-3 px-4 text-center">Edit</th>
                <th className="py-3 px-4 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="text-black text-md text-center font-light ">
            {dataPasien.map((pasien, index) => (
               <tr
    key={pasien.id}
    className={`border-b ${pasien.status === "Selesai" ? 'bg-green-100' : pasien.status === "Cancel" ? 'bg-red-100' : ''}`}
  >
 

 <td className="py-3 px-4">{index + 1}</td>
                  <td className="p-4 whitespace-nowrap">{formatTanggal(pasien.tanggal)}</td>
                  <td className="p-4 whitespace-nowrap">{formatJam(pasien.jam)}</td>
                  <td className="p-2 whitespace-nowrap">{pasien.status}</td>
                  <td className="py-3 px-4">{pasien.keterangan}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.nama}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.usia}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.orang_tua}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.metode_sunat}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.anatomi}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.metode_bius}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.no_telp}</td>
                  <td className="py-3 px-4">{pasien.alamat}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.dokter_praktik}</td>
                  <td className="p-4 whitespace-nowrap">{formatTanggal(pasien.tanggal_daftar)}</td> 
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.goody_bag_p),resepsionisOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.nacl_p),resepsionisOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.butbut_p),resepsionisOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.tumblr_p),resepsionisOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.kaos_p), kaosOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.celana_p), celanaOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.nyeri_p), obatNyeriOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.antibiotik_p), obatAntibiotikOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.bengkak_p), obatBengkakOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.supp_p), suppOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.klamp_p), klampOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.stapler_p), staplerOptions)}</td>
                  <td className="py-3 px-4 text-center">
                  <button
                  onClick={() => handleEditClick(pasien)}
                  className=" text-blue-900 hover:underline"
                >
                  Edit
                </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleDelete(pasien.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-10 bg-opacity-50 bg-gray-900">
    <div className="bg-white w-full sm:w-96 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Data {editData.nama} </h2>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="mr-2">
          <button
            onClick={() => setActiveForm(1)}
            className={`inline-block p-4 ${
              activeForm === 1
                ? 'text-purple-900 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
                : ''
            }`}
          >
            Form 1
          </button>
        </li>
        <li>
          <button
            onClick={() => setActiveForm(2)}
            className={`inline-block p-4 ${
              activeForm === 2
                ? 'text-purple-900 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
                : ''
            }`}
          >
            Form 2
          </button>
        </li>
      </ul>

      <div className="my-4"></div>


      <form onSubmit={handleEditSubmit} className="space-y-4">
        {activeForm === 1 && (
          <>
<div className="overflow-y-auto max-h-[calc(50vh)]">            
<input type="hidden" id="editId"></input>            
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="editTanggal">Tanggal</label>
                    <input
                      type="text"
                      id="editTanggal"
                      name="tanggal"
                      value={editData.tanggal}
                      onChange={handleEditDataChange}
                      className="border p-2 rounded"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="editJam">Jam</label>
                    <input
                      type="text"
                      id="editJam"
                      name="jam"
                      value={editData.jam}
                      onChange={handleEditDataChange}
                      className="border p-2 rounded"
                    />

                  </div>
                  <div className="flex flex-col space-y-2">
                  <label htmlFor="editNama">Nama</label>
                  <input
                    type="text"
                    id="editNama"
                    name="nama"
                    value={editData.nama}
                    onChange={handleEditDataChange}
                    className="border p-2 rounded"
                  />
                </div>

                <div className="flex flex-col space-y-2">
  <label htmlFor="editUsia">Usia</label>
  <input
    type="text"
    id="editUsia"
    name="usia"
    value={editData.usia}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
  />
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editOrangTua">Orang Tua</label>
  <input
    type="text"
    id="editOrangTua"
    name="orang_tua"
    value={editData.orang_tua}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
  />
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editMetodeSunat">Metode</label>
  <select
    type="text"
    id="editMetodeSunat"
    name="metode_sunat"
    value={editData.metode_sunat}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
      <option value=""></option>
    {metodeSunatOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
      ))}
  </select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editAnatomi">Anatomi</label>
  <select
    type="text"
    id="editAnatomi"
    name="anatomi"
    value={editData.anatomi}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value=""></option>
    <option value="Belum Cek">Belum Cek</option>
    <option value="Nanggung">Nanggung</option>
    <option value="Sudah Cek">Sudah Cek</option>
    <option value="Kelainan Lain">Kelainan Lain</option>
</select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editMetodeBius">Bius</label>
  <select
    type="text"
    id="editMetodeBius"
    name="metode_bius"
    value={editData.metode_bius}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value=""></option>
  {metodeBiusOptions.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
    ))}
</select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editNoTelp">No. Telp</label>
  <input
    type="text"
    id="editNoTelp"
    name="no_telp"
    value={editData.no_telp}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
  />
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editAlamat">Alamat</label>
  <input
    type="text"
    id="editAlamat"
    name="alamat"
    value={editData.alamat}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
  />
</div>

</div>
          </>
        )}
        {activeForm === 2 && (
          <>

<div className="overflow-y-auto max-h-[calc(50vh)]">
  <div className="flex flex-col space-y-2">
  <label htmlFor="editStatus">Status</label>
  <select
    type="text"
    id="editStatus"
    name="status"
    value={editData.status}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="Selesai">Selesai</option>
    <option value="Cancel">Cancel</option>
    <option value="Daftar Offline">Daftar Offline</option>
    <option value="Daftar Online">Daftar Online</option>
</select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editKeterangan">Keterangan</label>
  <input
    type="text"
    id="editKeterangan"
    name="keterangan"
    value={editData.keterangan}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
  />
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editGoodyBagP">Goody Bag</label>
  <select
    id="editGoodyBagP"
    name="goody_bag_p"
    value={editData.goody_bag_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
  >
    <option value="ANJING"></option> 
    {resepsionisOptions
      .filter(option => option.item === "Goody Bag")
      .map((option) => (
        <option key={option.id} value={option.id}>
          {"YA"}
        </option>
      ))}
  </select>
</div>


<div className="flex flex-col space-y-2">
  <label htmlFor="editNaclP">NaCl</label>
  <select
    type="text"
    id="editNaclP"
    name="nacl_p"
    value={editData.nacl_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="ANJING"></option> 
    {resepsionisOptions
      .filter(option => option.item === "Botol Nacl")
      .map((option) => (
        <option key={option.id} value={option.id}>
          {"YA"}
        </option>
      ))}
  </select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editButbutP">Butbut</label>
  <select
    type="text"
    id="editButbutP"
    name="butbut_p"
    value={editData.butbut_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="ANJING"></option> 
    {resepsionisOptions
      .filter(option => option.item === "Botol But But")
      .map((option) => (
        <option key={option.id} value={option.id}>
          {"YA"}
        </option>
      ))}
  </select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editTumblrP">Tumblr</label>
  <select
    type="text"
    id="editTumblrP"
    name="tumblr_p"
    value={editData.tumblr_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="ANJING"></option> 
    {resepsionisOptions
      .filter(option => option.item === "Tumblr")
      .map((option) => (
        <option key={option.id} value={option.id}>
          {"YA"}
        </option>
      ))}
  </select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editKaosP">Kaos</label>
  <select
    type="text"
    id="editKaosP"
    name="kaos_p"
    value={editData.kaos_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
      <option value="ANJING"></option>
    {kaosOptions.map((option) => (
      <option key={option.id} value={option.id}>
        {option.item}
      </option>
      ))}
  </select>
</div>


<div className="flex flex-col space-y-2">
  <label htmlFor="editAntibiotikP">Celana</label>
  <select
     type="text"
     id="editCelanaP"
     name="celana_p"
     value={editData.celana_p}
     onChange={handleEditDataChange}
     className="border p-2 rounded"
>
      <option value=""></option>
    {celanaOptions.map((option) => (
      <option key={option.id} value={option.id}>
        {option.item}
      </option>
      ))}
  </select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editAntibiotikP">Nyeri</label>
  <select
     type="text"
     id="editNyeriP"
     name="nyeri_p"
     value={editData.nyeri_p}
     onChange={handleEditDataChange}
     className="border p-2 rounded"
     >
     <option value="ANJING"></option>
   {obatNyeriOptions.map((option) => (
     <option key={option.id} value={option.id}>
       {option.item}
     </option>
     ))}
 </select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editAntibiotikP">Antibiotik</label>
  <select
    type="text"
    id="editAntibiotikP"
    name="antibiotik_p"
    value={editData.antibiotik_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="ANJING"></option>
  {obatAntibiotikOptions.map((option) => (
    <option key={option.id} value={option.id}>
      {option.item}
    </option>
    ))}
</select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editBengkakP">Bengkak</label>
  <select
    type="text"
    id="editBengkakP"
    name="bengkak_p"
    value={editData.bengkak_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="ANJING"></option>
  {obatBengkakOptions.map((option) => (
    <option key={option.id} value={option.id}>
      {option.item}
    </option>
    ))}
</select>
</div>


<div className="flex flex-col space-y-2">
  <label htmlFor="editSuppP">Supp</label>
  <select
    type="text"
    id="editSuppP"
    name="supp_p"
    value={editData.supp_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="ANJING"></option>
  {suppOptions.map((option) => (
    <option key={option.id} value={option.id}>
      {option.item}
    </option>
    ))}
</select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editKlampP">Klamp</label>
  <select
    type="text"
    id="editKlampP"
    name="klamp_p"
    value={editData.klamp_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="ANJING"></option>
  {klampOptions.map((option) => (
    <option key={option.id} value={option.id}>
      {option.item}
    </option>
    ))}
</select>
</div>

<div className="flex flex-col space-y-2">
  <label htmlFor="editStaplerP">Stapler</label>
  <select
    type="text"
    id="editStaplerP"
    name="stapler_p"
    value={editData.stapler_p}
    onChange={handleEditDataChange}
    className="border p-2 rounded"
    >
    <option value="ANJING"></option>
  {staplerOptions.map((option) => (
    <option key={option.id} value={option.id}>
      {option.item}
    </option>
    ))}
</select>
</div>
</div>

          </>
        )}

        <button type="submit" className="bg-purple-900 text-white px-4 py-2 rounded">
          Simpan Perubahan
        </button>
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Batal
        </button>
      </form>
    </div>
  </div>
          )}

        </div>
      </div>
      )}
      </div>
    </div>

  );
};








