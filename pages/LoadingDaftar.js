// components/Loading.js
import React from 'react';

const LoadingDaftar = () => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black opacity-75">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Mendaftarkan</p>
    </div>
  );
};

export default LoadingDaftar;
