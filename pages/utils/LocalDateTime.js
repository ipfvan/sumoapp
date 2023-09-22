// utils/LocalDateTime.js

import React from "react";

export function formatTanggal(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
  }
  
  export function formatTanggalInput(ddmmyyyy) {
    const parts = ddmmyyyy.split('/');
    const isoDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
    return isoDate;
  };

  
  export function formatJam(timeString) {
    const time = new Date(`1970-01-01T${timeString}`);
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
    }

 export function convertedTanggal(dateString) {
    const parts = dateString.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
    
  

  
  export default function LocalDateTimePage() {
    return <></>;
  }