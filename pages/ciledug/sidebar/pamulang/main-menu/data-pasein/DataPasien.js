'use client'

import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { formatTanggal, formatJam, convertedTanggal, parseTanggal} from '../../../../../utils/LocalDateTime';
import moment from 'moment';
import { parseISO, format } from 'date-fns';

export default function DataPasien()  {

  const [selectedStartDate, setSelectedStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedEndDate, setSelectedEndDate] =  useState('2050-12-31');;
  const [dataPasien, setDataPasien] = useState([]);

  
  
  const [resepsionisOptions, setResepsionisOptions] = useState([]);
  const [kaosOptions, setKaosOptions] = useState([]);
  const [celanaOptions, setCelanaOptions] = useState([]);
  const [obatNyeriOptions, setObatNyeriOptions] = useState([]);
  const [obatAntibiotikOptions, setObatAntibiotikOptions] = useState([]);
  const [obatBengkakOptions, setObatBengkakOptions] = useState([]);
  const [suppOptions, setSuppOptions] = useState([]);
  const [klampOptions, setKlampOptions] = useState([]);
  const [staplerOptions, setStaplerOptions] = useState([]);
  useEffect(() => {
    const fetchOptions = async (kategori, setOptions) => {
      try {
        const response = await axios.get(`/api/pamulang/main/items-by-category?kategori=${kategori}`);
        setOptions(response.data.items);
      } catch (error) {
        console.error(`Error fetching ${kategori} options: `, error);
      }
    };
    fetchOptions('Resepsionis', setResepsionisOptions);
    fetchOptions('Kaos', setKaosOptions);
    fetchOptions('Celana', setCelanaOptions);
    fetchOptions('Obat Nyeri', setObatNyeriOptions);
    fetchOptions('Obat Antibiotik', setObatAntibiotikOptions);
    fetchOptions('Obat Bengkak', setObatBengkakOptions);
    fetchOptions('Supp', setSuppOptions);
    fetchOptions('Klamp', setKlampOptions);
    fetchOptions('Stapler', setStaplerOptions);
  }, []);
  
  const findItemNameById = (itemId, options) => {
    const selectedItem = options.find((item) => item.id === itemId);
    return selectedItem ? selectedItem.item : '';
  };
  
  

  const convertToISODate = (ddmmyyyy) => {
    const parts = ddmmyyyy.split('/');
    const isoDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
    return isoDate;
  };
  
  
 
 
  
  // Fungsi untuk mengambil data pasien berdasarkan tanggal filter
  const fetchFilteredData = async () => {
    try {
      const response = await axios.get(`/api/pamulang/main/pasien`, {
        params: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        },
      });
      setDataPasien(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // Panggil fungsi fetchFilteredData saat komponen dimuat pertama kali atau saat selectedStartDate berubah
  useEffect(() => {
    fetchFilteredData();
  }, [selectedStartDate, selectedEndDate]);

  // Fungsi untuk meng-handle perubahan tanggal awal
  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    setSelectedStartDate(startDate);
    setSelectedEndDate(startDate); // Set tanggal akhir sama dengan tanggal awal saat pertama kali diubah
  };

  // Fungsi untuk meng-handle perubahan tanggal akhir
  const handleEndDateChange = (event) => {
    setSelectedEndDate(event.target.value);
  };


  

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
          <h2 className="text-xl font-semibold mt-8">Data Pasien</h2>
          <div className="flex space-x-4 mb-4">
          <div className="flex flex-col space-y-1">
            <label htmlFor="startDate"></label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="endDate"></label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={selectedEndDate}
              onChange={handleEndDateChange}
              className="border p-2 rounded"
            />
          </div>
        </div>
          
        <div className="overflow-x-auto shadow-md sm:roundedl-g1">
          <table className="table-auto w-full border mt-4">
            <thead>
              <tr className="bg-purple-900 text-white uppercase text-sm leading-normal"> 
              <th className="py-3 px-4 text-left">no</th> 
                <th className="py-3 px-4 text-left">Tanggal</th>
                <th className="py-3 px-4 text-left">Jam</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Keterangan</th>
                <th className="py-3 px-4 text-center">Nama</th>
                <th className="py-3 px-4 text-center">Usia</th>
                <th className="py-3 px-4 text-center">Orang Tua</th>
                <th className="py-3 px-4 text-left">Metode</th>
                <th className="py-3 px-4 text-left">Anatomi</th>
                <th className="py-3 px-4 text-left">Bius</th>
                <th className="py-3 px-4 text-left">No. Telp</th>
                <th className="py-3 px-4 text-left">Alamat</th>
                <th className="py-3 px-4 text-center">Dokter</th>
                <th className="py-3 px-4 text-center">Tanggal Daftar</th>
                <th className="py-3 px-4 text-center">Goody Bag</th>
                <th className="py-3 px-4 text-center">NaCl</th>
                <th className="py-3 px-4 text-center">But But</th>
                <th className="py-3 px-4 text-center">Tumblr</th>
                <th className="py-3 px-4 text-center">Kaos</th>
                <th className="py-3 px-4 text-center">Celana</th>
                <th className="py-3 px-4 text-center">Nyeri</th>
                <th className="py-3 px-4 text-center">Antibiotik</th>
                <th className="py-3 px-4 text-center">Bengkak</th>
                <th className="py-3 px-4 text-center">Supp</th>
                <th className="py-3 px-4 text-center">Klamp</th>
                <th className="py-3 px-4 text-center">Stapler</th>
              </tr>
            </thead>
            <tbody className="text-black text-md text-center font-light ">
            {dataPasien.map((pasien, index) => (
               <tr
    key={pasien.id}
    className={`border-b ${pasien.status === "Selesai" ? 'bg-green-100' : pasien.status === "Cancel" ? 'bg-red-100' : ''}`}
  >
 

 <td className="py-3 px-4">{index + 1}</td>
                  <td className="p-4 whitespace-nowrap">{formatTanggal(pasien.tanggal)}</td>
                  <td className="p-4 whitespace-nowrap">{formatJam(pasien.jam)}</td>
                  <td className="p-2 whitespace-nowrap">{pasien.status}</td>
                  <td className="py-3 px-4">{pasien.keterangan}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.nama}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.usia}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.orang_tua}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.metode_sunat}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.anatomi}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.metode_bius}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.no_telp}</td>
                  <td className="py-3 px-4">{pasien.alamat}</td>
                  <td className="p-4 whitespace-nowrap">{pasien.dokter_praktik}</td>
                  <td className="p-4 whitespace-nowrap">{formatTanggal(pasien.tanggal_daftar)}</td> 
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.goody_bag_p),resepsionisOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.nacl_p),resepsionisOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.butbut_p),resepsionisOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.tumblr_p),resepsionisOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.kaos_p), kaosOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.celana_p), celanaOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.nyeri_p), obatNyeriOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.antibiotik_p), obatAntibiotikOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.bengkak_p), obatBengkakOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.supp_p), suppOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.klamp_p), klampOptions)}</td>
                  <td className="p-4 whitespace-nowrap">{findItemNameById(parseInt(pasien.stapler_p), staplerOptions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};








