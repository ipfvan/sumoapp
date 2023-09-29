
import React, { useState, useEffect } from 'react';;
import { FaTruck, FaDatabase, FaFileMedicalAlt, FaUser} from 'react-icons/fa';

const Pamulang = ({ activeMenu, setActiveMenu }) => {
  const [showPasswordMenu, setShowPasswordMenu] = useState(false);

  useEffect(() => {
    // Cek apakah cookie myUsername=cibinong ada
    if (document.cookie.includes('myUsername=pamulang')) {
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
          activeMenu === 'menu9' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu9')}
      >
        <div className="flex items-center">
          <FaFileMedicalAlt className="mr-3 text-xl" /> Main Menu {/* Tambahkan ikon FaHome sebelum teks */}
        </div>
      </li>
      <li
        className={`cursor-pointer ${
          activeMenu === 'menu10' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu10')}
      >
        <div className="flex items-center">
          <FaTruck className="mr-3 text-xl" /> Logistik {/* Tambahkan ikon FaTruck sebelum teks */}
        </div>
      </li>
      <li
        className={`cursor-pointer ${
          activeMenu === 'menu11' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
        } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
        onClick={() => setActiveMenu('menu11')}
      >
        <div className="flex items-center">
          <FaDatabase className="mr-3 text-xl" /> Report {/* Tambahkan ikon FaFileAlt sebelum teks */}
        </div>
      </li>
          {showPasswordMenu && (
            <li
              className={`cursor-pointer ${
                activeMenu === 'menu12' ? 'bg-purple-900 text-white' : 'bg-transparent text-purple-900'
              } py-2 px-4 rounded-md mb-2 transition-colors duration-300 flex items-center justify-between`}
              onClick={() => setActiveMenu('menu12')}
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

export default Pamulang;
