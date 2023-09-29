import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatTanggal } from '../../../../utils/LocalDateTime';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
const TransaksiMasuk = () => {


  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [itemOptions, setItemOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [tanggalTransaksi, setTanggalTransaksi] = useState(moment().format('YYYY-MM-DD'));
  const [qty, setQty] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  

  const [selectedStartDate, setSelectedStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedEndDate, setSelectedEndDate] =  useState(moment().format('YYYY-MM-DD'));

  const [transaksiData, setTransaksiData] = useState([]);

  const fetchFilteredData = async () => {
    try {
      const response = await axios.get(`/api/pamulang/transaksi-masuk`, {
        params: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        },
      });
      setTransaksiData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  

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

  useEffect(() => {
    axios.get('/api/pamulang/get-options?action=kategori')
      .then(response => {
        setKategoriOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching kategori:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedKategori) {
      axios.get(`/api/pamulang/get-options?action=item&kategori=${selectedKategori}`)
        .then(response => {
          setItemOptions(response.data);
        })
        .catch(error => {
          console.error('Error fetching items:', error);
        });
    }
  }, [selectedKategori]);

  const handleKategoriChange = (event) => {
    const newSelectedKategori = event.target.value;
    setSelectedKategori(newSelectedKategori);
    setSelectedItem('');
  };

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handleTanggalChange = (event) => {
    setTanggalTransaksi(event.target.value);
  };

  const handleQtyChange = (event) => {
    setQty(event.target.value);
  };

  const handlePengirimChange = (event) => {
    setPengirim(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
      const pamulangauthenticated = document.cookie.includes('myUsername=pamulang');

if  (pamulangauthenticated) {
  
    if (selectedKategori && selectedItem && tanggalTransaksi && qty && pengirim) {
      const data = {
        kategori: selectedKategori,
        item: selectedItem,
        tanggal: tanggalTransaksi,
        qty: parseInt(qty),
        pengirim: pengirim
      };
  
      axios.post('/api/pamulang/transaksi-masuk', data)
        .then(response => {
          console.log('Transaksi berhasil disubmit:', response.data);
          fetchFilteredData(selectedStartDate, selectedEndDate);
          setSelectedKategori('');
          setSelectedItem('');
          setTanggalTransaksi(moment().format('YYYY-MM-DD'));
          setQty('');
          setPengirim('');
  
        })
        .catch(error => {
          console.error('Error submitting transaksi:', error);
        });
    } else {
      alert('Harap lengkapi semua data transaksi');
    }
  } else {
    alert('Acces Denied')
  }
  };



  const [bgst, setBgst] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/pamulang/bgst'); // Sesuaikan dengan URL API yang Anda buat
        setBgst(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const findItemNameById = (itemId) => {
    const selectedItem = bgst.find((item) => item.id === itemId);
    return selectedItem ? selectedItem.item : '';
  };




  const handleDragEnd = (result) => {
    if (!result.destination) {
      // Item was dragged outside the list
      console.log('handleDragEnd called', result);
  
      const itemId = result.draggableId; // Assuming itemId is a unique identifier
      console.log('Item dragged out with itemId:', itemId);
      const itemToDelete = transaksiData.find(item => item.id.toString() === itemId);
  
      if (itemToDelete) {
        if  (pamulangauthenticated)  {
        if (itemToDelete.penerima === "Ciledug") {
          // If the item's penerima is "Ciledug", fetch data from the Ciledug database
          axios.get(`/api/pamulang/delete-transaksi-masuk-ciledug`, {
            params: {
              tanggal_transaksi: itemToDelete.tanggal_transaksi,
              barang_id: itemToDelete.barang_id,
              qty: itemToDelete.qty,
              pengirim: "Cibinong"
            }
          })
          .then(ciledugData => {
            if (ciledugData.length > 0) {
              const ciledugItemId = ciledugData[0].id;
              // Perform delete operation using API for Ciledug database
              axios.delete(`/api/pamulang/delete-transaksi-masuk-ciledug?id=${ciledugItemId}`)
                .then(response => {
                  // Update state to reflect deleted item
                  fetchFilteredData(selectedStartDate, selectedEndDate);
                })
                .catch(error => {
                  console.error('Error deleting data from Ciledug:', error);
                });
            } else {
              console.error('Data not found in Ciledug database');
            }
          })
          .catch(error => {
            console.error('Error fetching data from Ciledug:', error);
          });
        } else {
          // Perform delete operation using API for the current database (assumed to be Cibinong)
          axios.delete(`/api/pamulang/transaksi-keluar?id=${itemId}`)
            .then(response => {
              // Update state to reflect deleted item
              fetchFilteredData(selectedStartDate, selectedEndDate);
            })
            .catch(error => {
              console.error('Error deleting transaksi:', error);
            });
          }
        } else {
          alert('Acces Denied')
        }
      } 
      }
    };
  



  const fetchDetailedData = async () => {
    try {
      const response = await axios.get(`/api/pamulang/get-detailed-transaksi-masuk`, {
        params: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        },
      });
      setDetailedTransaksiData(response.data);
    } catch (error) {
      console.error('Error fetching detailed data: ', error);
    }
  };
  
  const [detailedTransaksiData, setDetailedTransaksiData] = useState([]);
  
  useEffect(() => {
    fetchDetailedData();
  }, [selectedStartDate, selectedEndDate]);
  


  const handleSimplifyClick = () => {
    // Filter data to remove entries with barang_id 0
    
  
    // Call API to delete data with barang_id 0
    axios.delete('/api/pamulang/simplify-transaksi-masuk')
      .then(response => {
        console.log('Data with barang_id 0 deleted:', response.data);
        fetchFilteredData(selectedStartDate, selectedEndDate);
      })
      .catch(error => {
        console.error('Error deleting data with barang_id 0:', error);
      });
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-200 rounded-xl">
    <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-md">
      <div className="w-1/3 p-6 border-r overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">Input Transaksi Masuk</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Transaksi:</label>
          <input
            type="date"
            value={tanggalTransaksi}
            onChange={handleTanggalChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kategori:</label>
          <select
            value={selectedKategori}
            onChange={handleKategoriChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-opacity-50"
          >
            <option value="">Pilih Kategori</option>
            {kategoriOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Item:</label>
          <select
            value={selectedItem}
            onChange={handleItemChange}
            disabled={!selectedKategori}
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-opacity-50"
          >
            {/* Options */}
            <option value="">Pilih Item</option>
            {itemOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Qty:</label>
          <input
            type="number"
            value={qty}
            onChange={handleQtyChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pengirim:</label>
          <input
            type="text"
            value={pengirim}
            onChange={handlePengirimChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-900 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring focus:ring-opacity-50"
        >
          Submit
        </button>
        </form>
        </div>
        
  <div className="w-2/3 p-6 overflow-y-auto overflow-x-auto max-h-[calc(70vh)]">
          <h1 className="text-xl font-semibold mb-4">Data Transaksi Masuk</h1>
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
          <button
  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:ring focus:ring-opacity-50"
  onClick={() => {
    if (showDetailedTable) {
      setShowDetailedTable(false);
      setDetailedTransaksiData([]); // Reset detailed data
    } else {
      setShowDetailedTable(true);
      fetchDetailedData(); // Fetch detailed data immediately
    }
  }}
>
  {showDetailedTable ? 'Detail' : 'Advance'}
</button>
          <button
  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:ring focus:ring-opacity-50"
  onClick={handleSimplifyClick}
>
  Simplify
</button>
          
          </div>

          {showDetailedTable ? (
            detailedTransaksiData.length > 0 && (
              <table className="table-auto w-full text-center">
                <thead>
                  <tr>
                    <th className="px-4 py-2 whitespace-nowrap">Tanggal Transaksi</th>
                    <th className="px-4 py-2 whitespace-nowrap">Barang ID</th>
                    <th className="px-4 py-2 whitespace-nowrap">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedTransaksiData.map((item, index) => ( 
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-purple-100' : 'bg-white'}`}>
                      <td className="px-4 py-2 whitespace-nowrap">{formatTanggal(item.tanggal_transaksi)}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{findItemNameById(parseInt(item.barang_id), bgst)}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.total_qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            
              <DragDropContext onDragEnd={handleDragEnd}>
                {transaksiData.length > 0 && (
                <Droppable droppableId="transaksiList" direction="vertical">
                  {(provided) => (
                    <table className="table-auto w-full text-center" ref={provided.innerRef}>
                      <thead>
                        <tr>
                          <th className="px-4 py-2 whitespace-nowrap">Tanggal Transaksi</th>
                          <th className="px-4 py-2 whitespace-nowrap">Barang ID</th>
                          <th className="px-4 py-2 whitespace-nowrap">Qty</th>
                          <th className="px-4 py-2 whitespace-nowrap">Pengirim</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaksiData.map((item, index) => (
                          <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                            {(provided) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${index % 2 === 0 ? 'bg-purple-100' : 'bg-white'}`}
                              >
                                <td className="px-4 py-2 whitespace-nowrap">{formatTanggal(item.tanggal_transaksi)}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{findItemNameById(parseInt(item.barang_id), bgst)}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{item.qty}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{item.pengirim}</td>
                              </tr>
                               )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
             )}
          </DragDropContext>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default TransaksiMasuk;