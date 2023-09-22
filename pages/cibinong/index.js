

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import HeaderSatu from './sidebar/main/main-menu/HeaderSatu';
import HeaderDua from './sidebar/main/logistik/HeaderDua';
import HeaderTiga from './sidebar/ciledug/main-menu/HeaderTiga';
import HeaderEmpat from './sidebar/ciledug/logistik/HeaderEmpat';
import HeaderLima from './sidebar/pamulang/main-menu/HeaderLima';
import HeaderEnam from './sidebar/pamulang/logistik/HeaderEnam';
import ChangePassword from './sidebar/main/password/ChangePassword';
import { useRouter } from 'next/router'
import { FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';
import axios from 'axios';
import { formatJam, formatTanggal } from '../utils/LocalDateTime';


export default function CibinongHome() {
  const [activeMenu, setActiveMenu] = useState('menu1');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Deklarasikan variabel sidebarOpen
  const router = useRouter();
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  

  useEffect(() => {
    loadNotifications(); // Load notifications when the component mounts
  }, []);

  useEffect(() => {
    const socket = io('http://192.168.1.6:3001');

    socket.on('startAudio', () => {
      const newAudio = new Audio('/One.mp3');
      newAudio.play();
      setAudio(newAudio);
      setAudioPlaying(true);
      setIsAudioPlaying(true);
    });

    socket.on('stopAudio', () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setAudioPlaying(false);
        setIsAudioPlaying(false);
      }
    });

    socket.on('newPatientLog', async (patientData) => {
      await loadNotifications(); // Wait for notifications to be loaded
      setIsNewNotification(true); // Set isNewNotification to true when new notification is received
    });
    

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await axios.get('/api/cibinong/main/notifications');
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
      await axios.delete('/api/cibinong/main/notifications');
      setNotifications([]);
      setShowNotifications(false);
      setIsNewNotification(false); // Set isNewNotification to false
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };
  
  const toggleNotifications = async () => {
    if (isAudioPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setAudioPlaying(false);
      setIsAudioPlaying(false);
    }
  
    // Update notification status to viewed on the server
    if (isNewNotification && notifications.length > 0) {
      try {
        // Update all notifications' isNew status to 0
        const notificationIds = notifications.map(notification => notification.id);
        await axios.put('/api/cibinong/main/notifications/', { notificationIds });
        
        console.log('Marked all notifications as viewed');
        setIsNewNotification(false); // Set isNewNotification to false
      } catch (error) {
        console.error('Error marking notifications as viewed:', error);
      }
    }
  
    setShowNotifications(!showNotifications);
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.id) - new Date(a.id)
  );


  useEffect(() => {
    // Periksa apakah pengguna telah otentikasi
    const authenticatedcibinong = document.cookie.includes('authenticatedcibinong=true');

    // Jika pengguna tidak otentikasi, redirect ke halaman login
    if (!authenticatedcibinong) {
    router.push('/cibinong/login');
    }
  }, []);

  return (
      <div>
      <div className='relative'>
        <div className="bg-transparent absolute top-0 right-0 mt-2 p-4">
          <FaBell
            size={24}
            className={`mr-2 ${isNewNotification ? 'text-red-500' : 'text-white'}`}
            onClick={toggleNotifications}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className='bg-white p-5 mt-10 rounded-xl absolute top-10 right-0 shadow-md'>
          {showNotifications && (
            <ul>
              {sortedNotifications.map((log, index) => (
                <li key={index} className="mb-2">
                  <p><strong>Nama:</strong> {log.nama}</p>
                  <p><strong>Tanggal Sunat:</strong> {formatTanggal(log.tanggal)}</p>
                  <p><strong>Jam:</strong> {formatJam(log.jam)}</p>
                  <p><strong>Tanggal Daftar:</strong> {formatTanggal(log.tanggal_daftar)}</p>
                </li>
              ))}
              <button onClick={clearNotifications} className="text-blue-500 hover:underline">
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
            <ChangePassword sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu5' && (
            <HeaderTiga sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu6' && (
            <HeaderEmpat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu7' && <div>Maintaining. . .</div>}
          {activeMenu === 'menu8' && (
            <HeaderLima sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu9' && (
            <HeaderEnam sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}
          {activeMenu === 'menu10' && <div>Maintaining. . .</div>}
        </div>
      </div>
  );
}
