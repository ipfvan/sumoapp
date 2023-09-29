import React, { useState } from 'react';
import TransaksiKeluar from './TransaksiKeluar';
import TransaksiMasuk from './TransaksiMasuk';

const Transaksi = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-xl p-5">
        <div className="w-full max-w-5xl mx-auto">
      <div className="mb-5 flex justify-center flex-row flex-wrap whitespace-nowrap">
        <button
          className={` inline-block px-7 py-2 text-center ${activeTab === 1 ? 'border-purple-800 text-purple-900 my-2 block border-x-0 border-b-2 border-t-0 pb-3.5 pt-4 text-sm font-medium uppercase leading-tight' : 'border-transparent text-neutral-500'}`}
          onClick={() => handleTabChange(1)}
        >
        Transaksi Keluar
        </button>
        <button
          className={` inline-block px-7 py-2 text-center ${activeTab === 2 ? 'border-purple-800 text-purple-900 my-2 block border-x-0 border-b-2 border-t-0 pb-3.5 pt-4 text-sm font-medium uppercase leading-tight' : 'border-transparent text-neutral-500'}`}
          onClick={() => handleTabChange(2)}
        >
         Transaksi Masuk
        </button>
      </div>
      </div>
        {activeTab === 1 && (
          <div className="w-full">
            <TransaksiKeluar /> {/* Display content of Logistik file */}
          </div>
        )}
        {activeTab === 2 && (
          <div className="w-full">
            <TransaksiMasuk /> {/* Display content of Logistik file */}
          </div>
        )}
    </div>
  );
};

export default Transaksi;
