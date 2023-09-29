
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import HeaderSatu from './cibinong/main-menu/HeaderSatu';
import HeaderDua from './cibinong/logistik/HeaderDua';
import HeaderTiga from './ciledug/main-menu/HeaderTiga';
import HeaderEmpat from './ciledug/logistik/HeaderEmpat';
import HeaderLima from './pamulang/main-menu/HeaderLima';
import HeaderEnam from './pamulang/logistik/HeaderEnam';
import ChangePasswordCibinong from './cibinong/password/ChangePassword';
import ChangePasswordCiledug from './ciledug/password/ChangePasswordCiledug';
import ChangePasswordPamulang from './pamulang/password/ChangePasswordPamulang';
import { useRouter } from 'next/router'
import { FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';
import axios from 'axios';
import { formatJam, formatTanggal } from '@/pages/utils/LocalDateTime';
import { getUsernameFromCookie } from '../utils/Cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 



export default function AdminHome() {

 

  const [activeMenu, setActiveMenu] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Deklarasikan variabel sidebarOpen
  const router = useRouter();


  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [audio, setAudio] = useState(null);
  const username = getUsernameFromCookie();



  useEffect(() => {
    loadNotifications(); // Load notifications when the component mounts
  }, []);


  useEffect(() => {

    const cibinongauthenticated = document.cookie.includes('myUsername=cibinong');
    const ciledugauthenticated = document.cookie.includes('myUsername=ciledug');
    const pamulangauthenticated = document.cookie.includes('myUsername=pamulang');

    const socket = io('http://192.168.1.5:3001')
   
    if (cibinongauthenticated){
    
      socket.on('sendNotification', async (notificationData) => {

        toast('Paisen baru terdaftar!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });

      const newAudio = new Audio('/One.mp3');
      newAudio.play();
      setAudio(newAudio);
      setAudioPlaying(true);

      await loadNotifications(); // Wait for notifications to be loaded
      setIsNewNotification(true);
      // Tangkap notifikasi di sini dan tampilkan sebagai notifikasi browser.
      if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(notificationData.title, {
              body: notificationData.body,
            });
          }
        });
      }
    });

  } else if (ciledugauthenticated){
    
    socket.on('sendNotification2', async (notificationData) => {

      toast('Paisen baru terdaftar!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });


    const newAudio = new Audio('/One.mp3');
    newAudio.play();
    setAudio(newAudio);
    setAudioPlaying(true);

    await loadNotifications(); // Wait for notifications to be loaded
    setIsNewNotification(true);
    // Tangkap notifikasi di sini dan tampilkan sebagai notifikasi browser.
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(notificationData.title, {
            body: notificationData.body,
          });
        }
      });
    }
  });

} else if (pamulangauthenticated){
    
  socket.on('sendNotification3', async (notificationData) => {

    toast('Paisen baru terdaftar!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });


  const newAudio = new Audio('/One.mp3');
  newAudio.play();
  setAudio(newAudio);
  setAudioPlaying(true);


  await loadNotifications(); // Wait for notifications to be loaded
  setIsNewNotification(true);
  // Tangkap notifikasi di sini dan tampilkan sebagai notifikasi browser.
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(notificationData.title, {
          body: notificationData.body,
        });
      }
    });
  }
});
}
   return () => {
      socket.disconnect();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`/api/${username}/notifications`);
      setNotifications(response.data);

      // Check if there are new notifications and set isNewNotification accordingly
      const newNotificationExists = response.data.some(notification => notification.isNew === 1);
      setIsNewNotification(newNotificationExists);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      await axios.delete(`/api/${username}/notifications`);
      setNotifications([]);
      setShowNotifications(false);
      setIsNewNotification(false); // Set isNewNotification to false
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };
  
  const toggleNotifications = async () => {
    if (audioPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setAudioPlaying(false);
    }
  if (showNotifications === true) {
    // Update notification status to viewed on the server when closing notifications
    if (notifications.length > 0) {
      try {
        if (isNewNotification) {
          // Update all notifications' isNew status to 0
          const notificationIds = notifications.map(notification => notification.id);
          await axios.put(`/api/${username}/notifications`, { notificationIds });
  
          console.log('Marked all notifications as viewed');
          setIsNewNotification(false); // Set isNewNotification to false
        }
        await loadNotifications();
      } catch (error) {
        console.error('Error marking notifications as viewed:', error);
      }
    }
  }
    setShowNotifications(!showNotifications);
  };
  
  
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.id) - new Date(a.id)
  );


  useEffect(() => {
    const cibinongauthenticated = document.cookie.includes('myUsername=cibinong');
    const ciledugauthenticated = document.cookie.includes('myUsername=ciledug');
    const pamulangauthenticated = document.cookie.includes('myUsername=pamulang');
    // Periksa apakah pengguna telah otentikasi
    if (cibinongauthenticated) {
      setActiveMenu('menu1');
    } else if (ciledugauthenticated) {
      setActiveMenu('menu5');
    } else if (pamulangauthenticated) {
      setActiveMenu('menu9');
    } else {
      router.push('/admin/login'); // Alihkan ke halaman login jika tidak ada yang cocok
    }
  }, []);


  return (
      <div>
              <ToastContainer />
              <div className='relative'>
        <div className="bg-transparent absolute top-0 right-0 mt-2 p-4">
          <FaBell
            size={24}
            className={`mr-2 ${isNewNotification ? 'text-red-500' : 'text-white'}`}
            onClick={toggleNotifications}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className='max-h-screen overflow-y-auto bg-purple-900 bg-opacity-30 p-5 mt-10 rounded-xl absolute top-10 right-10 shadow-md'>
          {showNotifications && (
            <ul>
  {sortedNotifications.map((log, index) => (
    <li
      key={index}
      className={`p-5 bg-purple-900 bg-opacity-30 rounded-md mb-2 text-black ${
        log.isNew === 1 ? 'bg-white bg-opacity-70' : ''
      }`}
    >
      <p><strong>Nama:</strong> {log.nama}</p>
      <p><strong>Tanggal Sunat:</strong> {formatTanggal(log.tanggal)}</p>
      <p><strong>Jam:</strong> {formatJam(log.jam)}</p>
      <p><strong>Tanggal Daftar:</strong> {formatTanggal(log.tanggal_daftar)}</p>
      <p className='hidden'><strong>Status:</strong> {log.isNew}</p>
    </li>
  ))}
  <button onClick={clearNotifications} className="text-red-500 font-bold hover:underline">
    Clear Notif
  </button>
</ul>
          )}
        </div>
      </div>

        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="transition-all duration-300 ease-in-out" style={{ marginLeft: sidebarOpen ? '25%' : 0 }}>
          {activeMenu === 'menu1' && (
            <HeaderSatu sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu2' && (
            <HeaderDua sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu3' && <div>Maintaining. . .</div>}
          {activeMenu === 'menu4' && (
            <ChangePasswordCibinong sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu5' && (
            <HeaderTiga sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu6' && (
            <HeaderEmpat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu7' && <div>Maintaining. . .</div>}
          {activeMenu === 'menu8' && (
            <ChangePasswordCiledug sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu9' && (
            <HeaderLima sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu10' && (
            <HeaderEnam sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu11' && <div>Maintaining. . .</div>}
          {activeMenu === 'menu12' && (
            <ChangePasswordPamulang sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          
        </div>
      </div>
      
  );
}
