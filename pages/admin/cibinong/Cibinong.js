
import React, { useState, useEffect } from 'react';;
import { FaTruck, FaDatabase, FaFileMedicalAlt, FaUser} from 'react-icons/fa';

const Cibinong = ({ activeMenu, setActiveMenu }) => {
  const [showPasswordMenu, setShowPasswordMenu] = useState(false);

  useEffect(() => {
    // Cek apakah cookie myUsername=cibinong ada
    if (document.cookie.includes('myUsername=cibinong')) {
      // Jika cookie ada, tampilkan menu4 (Password)
      setShowPasswordMenu(true);
    } else {
      // Jika cookie tidak ada, sembunyikan menu4 (Password)
      setShowPasswordMenu(false);
    }
  }, []);

  return (
<div className='relative'>
  <div>
    <ul>
      <li
        className={`cursor-pointer ${
          activeMenu === 'menu1' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu1')}
      >
        <div className="flex items-center">
          <FaFileMedicalAlt className="mr-3 text-xl" /> Main Menu {/* Tambahkan ikon FaHome sebelum teks */}
        </div>
      </li>
      <li
        className={`cursor-pointer ${
          activeMenu === 'menu2' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu2')}
      >
        <div className="flex items-center">
          <FaTruck className="mr-3 text-xl" /> Logistik {/* Tambahkan ikon FaTruck sebelum teks */}
        </div>
      </li>
      <li
        className={`cursor-pointer ${
          activeMenu === 'menu3' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu3')}
      >
        <div className="flex items-center">
          <FaDatabase className="mr-3 text-xl" /> Report {/* Tambahkan ikon FaFileAlt sebelum teks */}
        </div>
      </li>
          {showPasswordMenu && (
            <li
              className={`cursor-pointer ${
                activeMenu === 'menu4' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
              } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
              onClick={() => setActiveMenu('menu4')}
            >
              <div className="flex items-center">
                <FaUser className="mr-3 text-xl" /> Password {/* Tambahkan ikon FaFileAlt sebelum teks */}
              </div>
            </li>
          )}
    </ul>
  </div>
</div>
  );
};

export default Cibinong;
