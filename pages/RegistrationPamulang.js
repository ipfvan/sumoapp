import React, { useState , useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { formatTanggal , formatJam } from './utils/LocalDateTime';
import { FaCheck, FaCheckCircle , FaCircle , FaCircleNotch } from 'react-icons/fa';
import io from 'socket.io-client';
import LoadingJam from './LoadingJam';
import LoadingDaftar from './LoadingDaftar';


const RegistrationCibinong = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDaftar, setIsLoadingDaftar] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTime, setAvailableTime] = useState('');
  const [tanggalDaftar, setTanggalDaftar] = useState(new Date().toISOString().split('T')[0]);

  const [showRemainingFields, setShowRemainingFields] = useState(false);
  const handleDateChange = async (event) => {
    const selectedDateString = event.target.value;
  
    console.log('Selected Date:', selectedDateString);

    setIsLoading(true);
  
    try {
      const response = await axios.get(`/api/pamulang/available-times?tanggal=${selectedDateString}`);
      setAvailableTime(response.data.availableTime);
  
      console.log('Response:', response.data);
  
      setSelectedDate(selectedDateString);
  
      const currentDateTime = new Date();
      const currentTime = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
  
      console.log('Current Time:', currentTime);
  
      const availableTimeParts = response.data.availableTime.split(':');
      const availableTimeInMinutes = parseInt(availableTimeParts[0]) * 60 + parseInt(availableTimeParts[1]);
  
      const maxRegistrationTimeParts = response.data.maxRegistrationTime.split(':');
      const maxRegistrationTimeInMinutes = parseInt(maxRegistrationTimeParts[0]) * 60 + parseInt(maxRegistrationTimeParts[1]);
  
      if (
        selectedDateString === currentDateTime.toISOString().split('T')[0] &&
        availableTimeInMinutes < currentTime
      ) {
        setShowRemainingFields(false);
        alert('Untuk daftar dadakan hari ini, silahkan hubungi tim SUNAT MODERN lewat whatsapp ya');
      } else if (selectedDateString < currentDateTime.toISOString().split('T')[0]) {
          setShowRemainingFields(false);
          alert('Tanggal yang anda pilih sudah lewat, silahkan pilih tanggal lainnya');
      } else if (availableTimeInMinutes >= maxRegistrationTimeInMinutes) {
        alert(`Jadwal untuk Tanggal ${formatTanggal(selectedDateString)} sepertinya sudah penuh, coba pilih tanggal lainnya`);
        setShowRemainingFields(false);
      } else if (response.data.availableTime >= response.data.breakStartTime && response.data.availableTime < response.data.breakEndTime) {
        setShowRemainingFields(true);
        alert(`Jam yang tersedia untuk Tanggal ${formatTanggal(selectedDateString)} adalah jam ${formatJam(response.data.breakEndTime)}`);
        setAvailableTime(response.data.breakEndTime)
    } else {
      setShowRemainingFields(true);
      alert(`Jam yang tersedia untuk Tanggal ${formatTanggal(selectedDateString)} adalah jam ${formatJam(response.data.availableTime)}`);
  }
    } catch (error) {
      console.error('Error fetching available times: ', error);
    } finally {
      setIsLoading(false); // Set isLoading menjadi false setelah selesai fetch data
    }
    
  };
  
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const handleAgreeTerms = async (event) => {
    event.preventDefault();
    setShowTermsModal(true); // Tutup modal ketentuan
  
    // Lanjutkan dengan mengirimkan data jika pengguna setuju
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
      status: 'Daftar Online',
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
    // ...
    if (showTermsModal === true) {
      setIsLoadingDaftar(true)
    try {
      axios.post('/api/pamulang/pasien', data)

      const socket = io('http://85.31.233.73:3001/');
      const notificationData = {
        title: 'Pendaftaran Pasien Baru',
        body: 'Pasien baru telah terdaftar.',
      };
      socket.emit('sendNotification3', notificationData);
      console.log('Pesan notifikasi dikirim ke server.');
      try {
        await axios.post('/api/pamulang/notifications', {
          nama: data.nama,
          jam: data.jam,
          tanggal: data.tanggal,
          tanggal_daftar: new Date(),
        }); // Send notification
      } catch (error) {
        console.error('Error sending notification:', error);
      }
  
      setRegistrationSuccess(true);
      alert('Pendaftaran berhasil!');
      event.target.reset();
      setSelectedDate(null);
      setShowRemainingFields(false);
      setShowTermsModal(false);
    } catch (error) {
      console.error('Error submitting form: ', error);
      alert('Terjadi kesalahan saat mengirimkan pendaftaran.');
    } finally {
      setIsLoadingDaftar(false);
    }
  }
  };


  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Set the fade-in effect after the component mounts
    setFadeIn(true);
  }, []);

  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'info'

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const [metodeSunatOptions, setMetodeSunatOptions] = useState([]);
  useEffect(() => {
    const fetchMetodeSunatOptions = async () => {
      try {
        const response = await axios.get('/api/pamulang/metode-sunat');
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
        const response = await axios.get('/api/pamulang/metode-bius');
        setMetodeBiusOptions(response.data.metodeBiusOptions);
      } catch (error) {
        console.error('Error fetching metode bius options: ', error);
      }
    };
  
    fetchMetodeBiusOptions();
  }, []);

  return (
    <div>
    {isLoadingDaftar ? (
      // Tampilkan komponen Loading selama isLoading adalah true
      <LoadingDaftar />
    ) : (
    <div>
    {isLoading ? (
      // Tampilkan komponen Loading selama isLoading adalah true
      <LoadingJam />
    ) : (
<div>
<h2 className="text-2xl font-bold mb-2 text-customPurple">Form Pendaftaran Cabang Cibinong</h2>
      <p className='text-customPurple font-semibold mb-5'>Jl Raya Cikaret no.32</p>
<form onSubmit={handleAgreeTerms} className="space-y-4 relative">
<div
  className={`fixed inset-0 z-10 flex items-center justify-center backdrop-blur backdrop-opacity-75 ${
    showTermsModal ? 'visible opacity-100' : 'invisible opacity-0'
  }`}
>
<img
    src="/rocket.png"
    alt="Gambar Tumpang Tindih"
    className="fixed w-1/3 lg:w-1/5 h-auto inset-0 z-20 object-cover left-0 top-0"
  />
  <img
    src="/laser.png"
    alt="Gambar Tumpang Tindih"
    className="fixed w-1/3 lg:w-1/4 h-auto  z-30 right-0 bottom-0 "
  />
  <div className="flex flex-col flex-row lg:w-1/2 bg-white ml-3 mr-3 rounded-lg lg:max-h-[80vh] max-h-[70vh] shadow-md ">
  <div className='border rounded-md bg-white w-full sticky top-0'>
  <div className='flex flex-col flex-row  lg:w-1/6 w-1/5 mx-auto mt-5'>
  <img
    src="/logo.png"
    alt="Gambar Tumpang Tindih"

  />
  </div>
  <h2 className="text-lg text-customPurple font-bold mt-5 mb-3 text-center">Ketentuan Pendaftaran</h2>
  </div>
  <div className='overflow-y-auto p-6 '>
  <p className='text-customPurple text-xs font-bold mt-8'>
1) Anatomi Penis
</p>
<p className='text-customPurple ml-3 mr-3 text-xs mt-1 '>
  Anatomi penis dapat memengaruhi metode yang akan digunakan. Kondisi seperti hidden penis (gemuk), atau beberapa kelainan anatomi seperti web penis dan hipospadia memiliki risiko khusus, dan mungkin hanya dapat diatasi dengan metode Sumo Khusus. Kami sangat menyarankan untuk melakukan pemeriksaan anatomi penis di Klinik Sunat Modern sebelum hari H agenda sunat anda.
</p>
<p className='text-customPurple text-xs font-bold mt-8'>
2) Batita, Remaja, & Dewasa
</p>
<p className='text-customPurple ml-3 mr-3 text-xs mt-1'>
  Untuk usia di bawah 3 tahun atau di atas 12 tahun, kami sarankan untuk berkonsultasi terlebih dahulu dengan tim Sunat Modern melalui WhatsApp, telepon, atau datang langsung ke klinik. Hal ini dikarenakan ada perbedaan dalam prosedur yang memerlukan pemeriksaan laboratorium untuk usia-usia tersebut.
</p>
<p className='text-customPurple text-xs font-bold mt-8'>
3) Jam
</p>
<p className='text-customPurple ml-3 mr-3 text-xs mt-1'>
  Sistem kami telah berupaya maksimal untuk menentukan jam pendaftaran Anda dengan akurat berdasarkan antrian dan jadwal dokter. Namun, terkadang klinik kami mungkin mengalami situasi crowded sehingga jadwal sunat perlu penyesuaian lebih lanjut. Tim Sunat Modern akan segera mengonfirmasi untuk memastikan kepastian waktu Anda.
</p>
<p className='text-customPurple text-xs font-bold mt-8'>
4) Selesaikan Pendaftaran
</p>

<p className='text-customPurple ml-3 mr-3 text-xs mt-1 mb-5'>
  Jika Anda telah membaca dan memahami semua ketentuan di atas, klik tombol "Setuju"  untuk menyelesaikan pendaftaran. Pastikan nomor telepon yang Anda masukkan sudah benar. Tim Sunat Modern akan menghubungi Anda dalam waktu kurang dari 24 jam untuk konfirmasi lebih lanjut. Terima kasih atas kepercayaan Anda :).
</p>
</div>

    <div className='border rounded-md shadow-md bg-white w-full sticky bottom-0'>
    <div className="mt-4 flex justify-end ">
    <button
        type="submit"
        className="bg-customPurple text-white px-4 py-2 rounded hover:bg-blue-600 mb-10 mr-2"
      >
        Setuju
      </button>
      <button
  type="button" // Tambahkan atribut type dengan nilai "button" di sini
  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-10 mr-3"
  onClick={() => setShowTermsModal(false)}
>
  Batal
</button>
</div>
    </div>
  </div>
</div>
      <div className="form-group">
        <label htmlFor="tanggal">Tanggal</label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          value={selectedDate}
          onChange={handleDateChange}
          className="border rounded p-2 w-full"
        />
        <p className="text-sm italic mt-2">
                      (Pilih tanggal untuk melihat jam yang tersedia.)
                    </p>
      </div>
      {/* Sisanya dari form Anda */}
      {showRemainingFields && (
                <div className="lg:flex space-x-4">
                <div className="flex-1">
                  <div className="form-group">
                    <label for="jam">Jam</label>
                    <input
                      type="text"
                      id="jam"
                      name="jam"
                      value={formatJam(availableTime)}
                      readOnly
                      className="p-2 w-full"
                    />
                    <p className="text-sm italic mb-5">
                      (Jam disesuaikan berdasarkan antrian dan agenda dokter.)
                    </p>
                  </div>
      
            <div className="form-group">
              <label htmlFor="nama">Nama</label>
              <input
                type="text"
                id="nama"
                name="nama"
                required
                className="border rounded p-2 mb-7 w-full"
              />
            </div>
            <div className="form-group">
              <label htmlFor="usia">Usia</label>
              <input
                type="text"
                id="usia"
                name="usia"
                required
                className="border rounded p-2 mb-7 w-full"
              />
            </div>
            <div className="form-group">
              <label htmlFor="orang_tua">Nama Orang Tua</label>
              <input
                type="text"
                id="orang_tua"
                name="orang_tua"
                required
                className="border rounded p-2 mb-7 w-full"
              />
            </div>
            <div className="form-group">
    <label htmlFor="anatomi">Sudah cek anatomi penis di klinik Sunat Modern?</label>
    <select
        id="anatomi"
        name="anatomi"
        required
        className="border rounded p-2 mb-7 w-full"
    >
        <option value=""></option>
        <option value="Sudah Cek">Sudah Cek</option>
        <option value="Belum Cek">Belum Cek</option>
    </select>
</div>
      <div className="form-group">
        <label htmlFor="metode_sunat">Metode Sunat</label>
        <select
          type="text"
          id="metode_sunat"
          name="metode_sunat"
          required
          className="border rounded p-2 mb-2 w-full"
        >
          <option value=""></option>
    {metodeSunatOptions.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
    </select>

        <p className="text-sm italic mb-7">
                      (Untuk anak gemuk silahkan pilih Sumo Khusus.)
                    </p>
      </div>
      <div className="form-group">
        <label htmlFor="metode_bius">Metode Bius</label>
        <select
          type="text"
          id="metode_bius"
          name="metode_bius"
          required
          className="border rounded p-2 mb-7 w-full"
          >
          <option value=""></option>
    {metodeBiusOptions.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
    </select>
      </div>
      <div className="form-group">
        <label htmlFor="no_telp">Nomor Telpon</label>
        <input
          type="text"
          id="no_telp"
          name="no_telp"
          required
          className="border rounded p-2 mb-7 w-full"
        />
      </div>
      <div className="form-group">
        <label htmlFor="alamat">Alamat</label>
        <input
          type="text"
          id="alamat"
          name="alamat"
          required
          className="border rounded p-2 mb-7 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-customPurple text-white px-4 py-2 rounded hover:bg-blue-600 mb-10 mr-2"
      >
        Daftar
      </button>
      </div>
        </div>
      )}
      
      </form>
      </div>  
          )}
          </div>
                    )}
                    </div>         
  );
};

export default RegistrationCibinong;
