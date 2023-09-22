import React, { useState } from 'react';
import JamUmum from './JamUmum';
import JamKhusus from './JamKhusus';
import Metode from '../metode/Metode';

const Config = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabChange = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="w-full mx-auto">
        <div className="w-full max-w-5xl mx-auto">
      <div className="mb-5 flex justify-center flex-row flex-wrap whitespace-nowrap">
        <button
          className={` inline-block px-7 py-2 text-center ${activeTab === 1 ? 'border-purple-800 text-purple-900 my-2 block border-x-0 border-b-2 border-t-0 pb-3.5 pt-4 text-sm font-medium uppercase leading-tight' : 'border-transparent text-neutral-500'}`}
          onClick={() => handleTabChange(1)}
        >
          Jam Umum
        </button>
        <button
          className={` inline-block px-7 py-2 text-center ${activeTab === 2 ? 'border-purple-800 text-purple-900 my-2 block border-x-0 border-b-2 border-t-0 pb-3.5 pt-4 text-sm font-medium uppercase leading-tight' : 'border-transparent text-neutral-500'}`}
          onClick={() => handleTabChange(2)}
        >
         Jam Khusus
        </button>
        <button
          className={` inline-block px-7 py-2 text-center ${activeTab === 3 ? 'border-purple-800 text-purple-900 my-2 block border-x-0 border-b-2 border-t-0 pb-3.5 pt-4 text-sm font-medium uppercase leading-tight' : 'border-transparent text-neutral-500'}`}
          onClick={() => handleTabChange(3)}
        >
          Metode
        </button>
      </div>
      </div>
        {activeTab === 1 && (
          <div className="w-full">
            <JamUmum /> {/* Display content of Logistik file */}
          </div>
        )}
        {activeTab === 2 && (
          <div className="w-full">
            <JamKhusus /> {/* Display content of Logistik file */}
          </div>
        )}
        {activeTab === 3 && (
          <div className="w-full">
            <Metode /> {/* Display content of Logistik file */}
          </div>
        )}
    </div>
  );
};

export default Config;
