import React, { useState , useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { formatTanggal , formatJam } from './utils/LocalDateTime';
import { FaCheck, FaCheckCircle , FaCircle , FaCircleNotch } from 'react-icons/fa';
import io from 'socket.io-client';
import RegistrationCibinong from './RegistrationCibinong';
import RegistrationCiledug from './RegistrationCiledug';
import RegistrationPamulang from './RegistrationPamulang';

export default function Home() {

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Set the fade-in effect after the component mounts
    setFadeIn(true);
  }, []);

  const [isTabSticky, setIsTabSticky] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // Assume this is your active tab state

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const tabContainer = document.getElementById('tab-container'); // Assuming you give an ID to the tab container
      const tabContainerOffset = tabContainer.offsetTop;

      setIsTabSticky(scrollPosition >= tabContainerOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const branches = ['Cibinong', 'Ciledug', 'Pamulang'];
  const [selectedBranch, setSelectedBranch] = useState('');

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };


  return (
<div className="flex items-center justify-center min-h-screen bg-green-200">
  <div className="container mx-auto">
    <div className="flex flex-col lg:flex-row w-12/12 lg:w-8/12 lg:h-[90vh] bg-white rounded-xl mx-auto shadow-lg">
      <div className="w-full lg:w-1/2 flex flex-col lg:flex-row items-center justify-center mr-1 py-7 relative animate-fadeInDelay">
        <img src="/atas.png" alt="Gambar kiri Atas" className="absolute top-0 left-0 w-2/5 lg:w-3/5 animate-fadeInDelayLong"/>
        <img src="/bawah.png" alt="Gambar Kanan bawah" className="absolute bottom-0 right-0 w-1/4 lg:w-2/6 animate-fadeIn"/>
        <div className="flex flex-col items-center mb-7 mt-5 animate-fadeIn">
          <img src="/sumo.png" alt="Logo" className="w-5/6 lg:w-3/4 mb-12 mt-7 animate-fadeIn"/>
          
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:overflow-x-auto relative">
        <div
          id="tab-container"
          className={`sticky ${isTabSticky ? 'top-0' : ''} bg-white z-10`}
        >
          <div className="flex mb-4">
            <div
              className={`px-7 py-5 text-center font-bold w-1/2 ${activeTab === 'form' ? 'border-customPurple text-customPurple font-bold my-2 block border-x-0 border-b-2 border-t-0 pb-3.5 pt-4 text-sm  uppercase leading-tight' : 'border-transparent text-neutral-500'}`}
              onClick={() => handleTabChange('form')}
            >
              Pendaftaran
            </div>
            <div
              className={`px-7 py-5 text-center font-bold  w-1/2 ${activeTab === 'info' ? 'border-customPurple text-customPurple font-bold my-2 block border-x-0 border-b-2 border-t-0 pb-3.5 pt-4 text-sm  uppercase leading-tight' : 'border-transparent text-neutral-500'}`}
              onClick={() => handleTabChange('info')}
            >
              Metode
            </div>
          </div>
            </div>
            {activeTab === 'form' && (
              <div className='px-7'>
                      <p className='text-customPurple mb-2'>Pilih Cabang</p>
      <div className="flex items-center mb-5">
        <select className="px-4 py-2 border rounded-md" onChange={handleBranchChange} value={selectedBranch}>
          <option value=""></option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>{branch}</option>
          ))}
        </select>
      </div>
      <div className='mb-10'>
      {selectedBranch === 'Cibinong' && <RegistrationCibinong />}
      {selectedBranch === 'Ciledug' && <RegistrationCiledug />}
      {selectedBranch === 'Pamulang' && <RegistrationPamulang />}
      </div>
      </div>
            )}
            {activeTab === 'info' && (
            <div className='flex flex-col relative'>
          
              <div className='bg-customPurple relative'>
        <img src="/waves.svg" alt="Waves SVG" className='w-full' />

      <div className="flex items-center mb-5">
      <FaCircle className="text-customGreen text-xl mr-2 ml-3" />
  <p className="font-bold italic text-2xl text-white">Sumo</p>
  <div className="bg-customGreen rounded-xl p-2 ml-2">
    <p className="font-bold text-2xl text-white">Glueseal</p>
  </div>
</div>
      
      <img src="/shield.png" alt="Waves SVG" className='w-3/4 ml-10' />

      <div className="bg-white p-5 rounded-tl-[30%] rounded-tr-[40%] rounded-bl-[40%] rounded-br-[30%] shadow-lg mx-10 my-5">
  <ul className='text-center text-customPurple'>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Hasil estetik</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Jahitan minim</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Boleh kena air setelah 24 jam</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Tanpa perban</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Tidak wajib kontrol</li>
  </ul>
</div>
      <div>
      <p className='font-bold text-lg text-center text-white ml-5 mt-10 mb-7'> Alat Pengerjaan </p>
      <div className='flex items-center justify-center relative mx-3 mb-10'>
      <img src="/bipolar.png" alt="Waves SVG" className='w-1/3 mr-5' />
       <div className='w=2/3'>
        <p className ='font-bold italic text-md text-center text-white mb-2'>Pensealer</p>
        <ul className='text-xs text-white'>
        <li>Pengambilan kulit dilakukan dengan pensealer, yakni alat khitan terkini yang mempunyai keunggulan dalan merapatkan luka sehingga dapat meminimalisir jumlah jahitan</li>
        </ul>
    </div>
    </div>
    <div className='flex items-center justify-center relative mx-3 mb-10' >
       <div className='w=2/3 mr-3'>
        <p className ='font-bold italic text-md text-center text-white mb-2'>Smart Klamp</p>
        <ul className='text-xs text-white'>
        <li>Mempunyai prinsip sama dengan alat cetak yg berfungsi sebagai alat banti dokter dalam membuat hasil sunat yang lebih presisi</li>
        <li className='mt-3'>Smart klamp akan langsung dilepas setelah pengambilan kulit dilakukan(tidak perlu lepas klamp dikemudian hari)</li>
        </ul>
    </div>
    <img src="/klamp.png" alt="Waves SVG" className='w-1/3 mt-10' />
    </div>
    </div>
    <div className='flex items-center justify-center relative mx-3 mb-10'>
      <img src="/lem.png" alt="Waves SVG" className='w-1/3 mr-5' />
       <div className='w=2/3'>
        <p className ='font-bold italic text-md text-center text-white mb-2'>Liquidseal</p>
        <ul className='text-xs text-white'>
        <li>Cairan pengganti perban yang sekaligus melindungi luka agar aman terkena air</li>
        </ul>
    </div> 
    </div>
    <div className='flex mb-10'>
    <ul className='w-1/8 text-xs font-bold text-white ml-5 '>
        <li>0-12 Tahun</li>
        <li>12 Tahun -21 Tahun</li>
        <li>21 Tahun keatas</li>
        </ul>
        <ul className='w-1/8 text-xs font-bold text-white ml-10 '>
        <li>: Rp 2.250.000</li>
        <li>: Rp 2.250.000</li>
        <li>: Rp 3.000.000</li>
        </ul>
    </div>
    </div>



    <div className='bg-white relative'>
        <img src="/wavepurple.svg" alt="Waves SVG" className='w-full' />

      <div className="flex items-center mb-5">
      <FaCircle className="text-customGreen text-xl mr-2 ml-3" />
  <p className="font-bold italic text-2xl text-customPurple">Sumo</p>
  <div className="bg-customGreen rounded-xl p-2 ml-2">
    <p className="font-bold text-2xl text-white">Laser</p>
  </div>
</div>
      
      <img src="/laser.png" alt="Waves SVG" className='w-3/4 ml-10' />
      <div className="bg-white p-5 rounded-tl-[30%] rounded-tr-[40%] rounded-bl-[40%] rounded-br-[30%] shadow-lg mx-10 my-5">
  <ul className='text-center text-customPurple'>
    <li><FaCheckCircle className="inline text-gray-400 mr-2"/>Tetap ada proses jahit</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Minim pendarahan</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Boleh kena air setelah 24 jam</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Tanpa perban</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Tidak wajib kontrol</li>
  </ul>
</div>
      <div>
      <p className='font-bold text-lg text-center text-customPurple ml-5 mt-10 mb-7'> Alat Pengerjaan </p>
      <div className='flex items-center justify-center relative mx-3'>
      <img src="/cauter.png" alt="Waves SVG" className='w-1/3 mr-5' />
       <div className='w=2/3'>
        <p className ='font-bold italic text-md text-center text-customPurple mb-2'>Electric Cauter</p>
        <ul className='text-xs text-customPurple'>
        <li>Alat khitan yang memanfaatkan energi panas untuk meminimalisir pendarahan saat tindakan</li>
        </ul>
    </div>
    </div>
    <div className='flex items-center justify-center relative mx-3 mb-10' >
       <div className='w=2/3 mr-3'>
        <p className ='font-bold italic text-md text-center text-customPurple mb-2'>Liquidseal</p>
        <ul className='text-xs text-customPurple'>
        <li>Cairan pengganti perban yang sekaligus melindungi luka agar aman terkena air</li>
        </ul>
    </div>
    <img src="/lem.png" alt="Waves SVG" className='w-1/3 mt-10' />
    </div>
    </div>
    <div className='flex mb-10'>
    <ul className='w-1/8 text-xs font-bold text-customPurple ml-5 '>
        <li>0-12 Tahun</li>
        <li>12 Tahun -21 Tahun</li>
        <li>21 Tahun keatas</li>
        </ul>
        <ul className='w-1/8 text-xs font-bold text-customPurple ml-10 '>
        <li>: Rp 2.250.000</li>
        <li>: Rp 2.250.000</li>
        <li>: Rp 3.000.000</li>
        </ul>
    </div>
    </div>


    <div className='bg-customGreen relative'>
        <img src="/waves.svg" alt="Waves SVG" className='w-full' />
      <div className="flex items-center mb-5">
      <FaCircle className="text-customPurple text-xl mr-2 ml-3" />
  <p className="font-bold italic text-2xl text-white">Sumo</p>
  <div className="bg-customPurple rounded-xl p-2 ml-2">
    <p className="font-bold text-2xl text-white">Klamp</p>
  </div>
</div>
      
      <img src="/rocket.png" alt="Waves SVG" className='w-3/4 ml-10' />

      <div className="bg-white p-5 rounded-tl-[30%] rounded-tr-[40%] rounded-bl-[40%] rounded-br-[30%] shadow-lg mx-10 my-5">
  <ul className='text-center text-customPurple'>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Terpasang klamp selama5 hari</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Tanpa jahit</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Hasil estetik</li>
    <li><FaCheckCircle className="inline text-customGreen mr-2"/>Boleh kena air</li>
    <li><FaCheckCircle className="inline text-gray-400 mr-2"/>Wajib kontrol di hari ke-5</li>
  </ul>
</div>
      <div>
      <p className='font-bold text-lg text-center text-white ml-5 mt-10 mb-7'> Alat Pengerjaan </p>
      <div className='flex items-center justify-center relative mx-3'>
      <img src="/klamp.png" alt="Waves SVG" className='w-1/3 mr-5' />
       <div className='w=2/3'>
        <p className ='font-bold italic text-md text-center text-white mb-2'>Smart Klamp</p>
        <ul className='text-xs text-white'>
        <li>Berfungsi sebagai prngganti jahitan, smart klamp akan dibiarkan terpasang selama 5 hari untuk kemudian membentuk kulit mati pada luka sunat</li>
        <li className='mt-3'>Kulit mati akan lepas dengan sendirinya seiring proses penyembuhan</li>
        </ul>
    </div>
    </div>
    <div className='flex items-center justify-center relative mx-3 mb-10' >
       <div className='w=2/3 mr-3'>
        <p className ='font-bold italic text-md text-center text-white mb-2'>Pisau Bedah Kecil</p>
        <ul className='text-xs text-white'>
        <li>Setelah alat klamp berhasil terpasang dengan baik, kulup akan dipotong menggunakan pisau bedah kecil</li>
        </ul>
    </div>
    <img src="/bistouri.png" alt="Waves SVG" className='w-1/3 mt-8' />
    </div>
    </div>
    <div className='flex mb-10'>
    <ul className='w-1/8 text-xs font-bold text-white ml-5 '>
        <li>0-12 Tahun</li>
        <li>12 Tahun -21 Tahun</li>
        <li>21 Tahun keatas</li>
        </ul>
        <ul className='w-1/8 text-xs font-bold text-white ml-10 '>
        <li>: Rp 2.250.000</li>
        <li>: Rp 2.250.000</li>
        <li>: Rp 3.000.000</li>
        </ul>
    </div>

    </div>

    </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


