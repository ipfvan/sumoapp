import React from 'react';;
import { FaTruck, FaDatabase, FaFileMedicalAlt, FaUser} from 'react-icons/fa';

const Cibinong = ({ activeMenu, setActiveMenu }) => {
  return (
<div className='relative'>
  <div>
    <ul>
      <li
        className={`cursor-pointer ${
          activeMenu === 'menu5' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu5')}
      >
        <div className="flex items-center">
          <FaFileMedicalAlt className="mr-3 text-xl" /> Main Menu {/* Tambahkan ikon FaHome sebelum teks */}
        </div>
      </li>
      <li
        className={`cursor-pointer ${
          activeMenu === 'menu6' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu6')}
      >
        <div className="flex items-center">
          <FaTruck className="mr-3 text-xl" /> Logistik {/* Tambahkan ikon FaTruck sebelum teks */}
        </div>
      </li>
      <li
        className={`cursor-pointer ${
          activeMenu === 'menu7' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu7')}
      >
        <div className="flex items-center">
          <FaDatabase className="mr-3 text-xl" /> Report {/* Tambahkan ikon FaFileAlt sebelum teks */}
        </div>
      </li>
    </ul>
  </div>
</div>
  );
};

export default Cibinong;
