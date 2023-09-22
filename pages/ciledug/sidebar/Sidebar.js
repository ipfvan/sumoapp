import React, { useEffect, useState } from 'react';
import Ciledug from './main/Ciledug';
import Cibinong from './cibinong/Cibinong';
import Pamulang from './pamulang/Pamulang';
import { FaHome } from 'react-icons/fa';


const Sidebar = ({ activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen }) => {
  

  const branches = ['Ciledug', 'Cibinong', 'Pamulang'];
  const [selectedBranch, setSelectedBranch] = useState('Ciledug');

  useEffect(() => {
    if (selectedBranch === 'Ciledug') {
      setActiveMenu('menu1'); // Set menu aktif ke 'menu4' jika branch Ciledug dipilih
    } else if (selectedBranch === 'Cibinong') {
      setActiveMenu('menu5'); // Set menu aktif ke 'menu1' jika branch Cibinong dipilih
    } else if (selectedBranch === 'Pamulang') {
      setActiveMenu('menu8'); // Set menu aktif ke 'menu1' jika branch Cibinong dipilih
    } else {
      // Set menu aktif ke nilai default untuk branch lain jika diperlukan
    }
  }, [selectedBranch, setActiveMenu]);


  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };
  
  return (
    <div className='relative'>
      <div className={`fixed bg-white w-1/4 font-semibold h-screen overflow-x-auto p-4 transition-transform duration-300 ease-in-out transform z-10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-lg`}>
      <div className="flex items-center mb-5">
      <FaHome className="text-2xl text-purple-900" /> 
        <select className="px-1 py-2 text-xl text-purple-900 bg-transparent" onChange={handleBranchChange} value={selectedBranch}>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>{branch}</option>
          ))}
        </select>
      </div>
      <div className='mt-5 mb-10'>
      {selectedBranch === 'Ciledug' && <Ciledug activeMenu={activeMenu} setActiveMenu={setActiveMenu} />}
      {selectedBranch === 'Cibinong' && <Cibinong activeMenu={activeMenu} setActiveMenu={setActiveMenu} />}
      {selectedBranch === 'Pamulang' && <Pamulang activeMenu={activeMenu} setActiveMenu={setActiveMenu} />}
      </div>
      <img src="/logo.png" alt="Sumo" className="mt-10 mb-5 " style={{ width: '50%', height: 'auto', display: 'block', margin: '0 auto'}} />        
      </div>
    </div>
  );
};

export default Sidebar;
