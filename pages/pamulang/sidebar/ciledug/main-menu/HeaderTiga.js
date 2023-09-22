// components/HeaderSatu.js
import React, { useState } from 'react';
import DataPasien from './data-pasein/DataPasien'; // Impor komponen RegistrationForm
import Config from './configurations/jam/Config';
import Informasi from './informasi/Informasi';
import { FiMenu } from 'react-icons/fi';

const HeaderTiga = ({ sidebarOpen, setSidebarOpen }) => {
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [activeOption, setActiveOption] = useState('DataPasien'); // State untuk mengontrol opsi yang aktif

  const handleOptionClick = (option) => {
    setActiveOption(option); // Mengubah opsi yang aktif saat opsi dipilih
  };

  return (
    <div>
      
      <header className="bg-purple-900 text-white py-4">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">          
          <button
          className="p-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu size={24} />
        </button>
        <span className="text-xl font-semibold ml-3">Ciledug</span>
          </div>
          <ul className="flex space-x-4 mr-20">
            <li>
              <button
                onClick={() => handleOptionClick('DataPasien')}
                className={`${
                  activeOption === 'DataPasien' ? 'bg-green-600' : ''
                } px-2 py-1 rounded`}
              >
                Pasien
              </button>
            </li>
            <li>
              <button
                onClick={() => handleOptionClick('Config')}
                className={`${
                  activeOption === 'Config' ? 'bg-green-600' : ''
                } px-2 py-1 rounded`}
              >
                Configurations
              </button>
            </li>
            <li>
              <button
                onClick={() => handleOptionClick('Informasi')}
                className={`${
                  activeOption === 'Informasi' ? 'bg-green-600' : ''
                } px-2 py-1 rounded`}
              >
                Informasi
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        {activeOption === 'DataPasien' && <DataPasien />}
        {activeOption === 'Config' && <Config />}
        {activeOption === 'Informasi' && <Informasi />}
      </main>
    </div>
  );
};

export default HeaderTiga;
