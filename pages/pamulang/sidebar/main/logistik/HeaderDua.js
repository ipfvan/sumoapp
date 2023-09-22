// components/HeaderSatu.js
import React, { useState } from 'react';
import DataLogistik from './data-logistik/DataLogistik';
import Transaksi from './transaksi/Transaksi';

import { FiMenu } from 'react-icons/fi';

const HeaderDua = ({ sidebarOpen, setSidebarOpen }) => {
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [activeOption, setActiveOption] = useState('DataLogistik'); // State untuk mengontrol opsi yang aktif

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
        <span className="text-xl font-semibold ml-3">Pamulang</span>
          </div>
          <ul className="flex space-x-4 mr-20">
            <li>
              <button
                onClick={() => handleOptionClick('DataLogistik')}
                className={`${
                  activeOption === 'DataLogistik' ? 'bg-green-600' : ''
                } px-2 py-1 rounded`}
              >
               Data Logistik
              </button>
            </li>
            <li>
              <button
                onClick={() => handleOptionClick('Transaksi')}
                className={`${
                  activeOption === 'Transaksi' ? 'bg-green-600' : ''
                } px-2 py-1 rounded`}
              >
                Transaksi
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        {activeOption === 'DataLogistik' && <DataLogistik />}
        {activeOption === 'Transaksi' && <Transaksi />}
      </main>
    </div>
  );
};

export default HeaderDua;
