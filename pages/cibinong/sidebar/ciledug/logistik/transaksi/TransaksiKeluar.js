import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatTanggal } from '../../../../../utils/LocalDateTime';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
const TransaksiKeluar = () => {

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [itemOptions, setItemOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [tanggalTransaksi, setTanggalTransaksi] = useState(moment().format('YYYY-MM-DD'));
  const [qty, setQty] = useState('');
  const [penerima, setPenerima] = useState('');
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  

  const [selectedStartDate, setSelectedStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedEndDate, setSelectedEndDate] =  useState(moment().format('YYYY-MM-DD'));

  const [transaksiData, setTransaksiData] = useState([]);

  const fetchFilteredData = async () => {
    try {
      const response = await axios.get(`/api/ciledug/main/transaksi-keluar`, {
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
    axios.get('/api/ciledug/main/get-options?action=kategori')
      .then(response => {
        setKategoriOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching kategori:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedKategori) {
      axios.get(`/api/ciledug/main/get-options?action=item&kategori=${selectedKategori}`)
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

  const handlePenerimaChange = (event) => {
    setPenerima(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (selectedKategori && selectedItem && tanggalTransaksi && qty && penerima) {
      const data = {
        kategori: selectedKategori,
        item: selectedItem,
        tanggal: tanggalTransaksi,
        qty: parseInt(qty),
        penerima: penerima
      };
  
      axios.post('/api/ciledug/main/transaksi-keluar', data)
        .then(response => {
          console.log('Transaksi berhasil disubmit:', response.data);
          fetchFilteredData(selectedStartDate, selectedEndDate);
          setSelectedKategori('');
          setSelectedItem('');
          setTanggalTransaksi(moment().format('YYYY-MM-DD'));
          setQty('');
          setPenerima('');

          if (penerima === 'Ciledug') {
            const transaksiMasukData = {
              tanggal: tanggalTransaksi,
              item: selectedItem,
              qty: parseInt(qty),
              pengirim: 'Cibinong'
            };
  
            axios.post('/api/ciledug/main/submit-transaksi-masuk-ciledug', transaksiMasukData)
              .then(response => {
                console.log('Transaksi masuk Ciledug berhasil disubmit:', response.data);
              })
              .catch(error => {
                console.error('Error submitting transaksi masuk Ciledug:', error);
              });
          } else if (penerima === 'Cipanas') {
            const transaksiMasukData = {
              tanggal: tanggalTransaksi,
              item: selectedItem,
              qty: parseInt(qty),
              pengirim: 'Cibinong'
            };
  
            axios.post('/api/ciledug/main/submit-transaksi-masuk-cipanas', transaksiMasukData)
              .then(response => {
                console.log('Transaksi masuk Cipanas berhasil disubmit:', response.data);
              })
              .catch(error => {
                console.error('Error submitting transaksi masuk Cipanas:', error);
              });
          } else if (penerima === 'Pamulang') {
            const transaksiMasukData = {
              tanggal: tanggalTransaksi,
              item: selectedItem,
              qty: parseInt(qty),
              pengirim: 'Cibinong'
            };
  
            axios.post('/api/ciledug/main/submit-transaksi-masuk-pamulang', transaksiMasukData)
              .then(response => {
                console.log('Transaksi masuk Cipanas berhasil disubmit:', response.data);
              })
              .catch(error => {
                console.error('Error submitting transaksi masuk Cipanas:', error);
              });
          }
  
        })
        .catch(error => {
          console.error('Error submitting transaksi:', error);
        });
    } else {
      alert('Harap lengkapi semua data transaksi');
    }
  };



  const [bgst, setBgst] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/ciledug/main/bgst'); // Sesuaikan dengan URL API yang Anda buat
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
        if (window.confirm(`Are you sure you want to delete ${findItemNameById(parseInt(itemToDelete.barang_id), bgst)}?`)) {
          // Perform delete operation using API
          axios.delete(`/api/ciledug/main/transaksi-keluar?id=${itemId}`)
            .then(response => {
              // Update state to reflect deleted item
              fetchFilteredData(selectedStartDate, selectedEndDate);
            })
            .catch(error => {
              console.error('Error deleting transaksi:', error);
            });
        }
      }
    }
  };



  const fetchDetailedData = async () => {
    try {
      const response = await axios.get(`/api/ciledug/main/get-detailed-transaksi-keluar`, {
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
    axios.delete('/api/ciledug/main/simplify-transaksi-keluar')
      .then(response => {
        console.log('Data with barang_id 0 deleted:', response.data);
        fetchFilteredData(selectedStartDate, selectedEndDate);
      })
      .catch(error => {
        console.error('Error deleting data with barang_id 0:', error);
      });
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-md">       
  <div className="w-full p-6 overflow-y-auto overflow-x-auto max-h-[calc(70vh)]">
          <h1 className="text-xl font-semibold mb-4">Data Transaksi Keluar</h1>
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
                          <th className="px-4 py-2 whitespace-nowrap">Penerima</th>
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
                                <td className="px-4 py-2 whitespace-nowrap">{item.penerima}</td>
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

export default TransaksiKeluar;








