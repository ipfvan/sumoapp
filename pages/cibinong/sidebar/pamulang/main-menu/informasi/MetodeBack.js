import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MetodeBack = () => {
  const [metodeData, setMetodeData] = useState([]);
  const [editedNamaMetode, setEditedNamaMetode] = useState({});
  const [editedHarga, setEditedHarga] = useState({});
  const [editedFeeDr, setEditedFeeDr] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const [newData, setNewData] = useState({
    nama: '',
    no_telp: '',
    alamat: '',
  });

  useEffect(() => {
    // Fetch and update the metodeData when the component mounts
    fetchMetodeData();
  }, []);

  const fetchMetodeData = async () => {
    try {
      const response = await axios.get(`/api/pamulang/main/metode`);
      const sortedData = response.data.sort((a, b) => a.urutan - b.urutan);
      setMetodeData(sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData({
      ...newData,
      [name]: value,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleAddData = () => {
    // Perform validation if needed
    // Send a POST request to your API to add the new data
    axios
      .post('/api/pamulang/main/metode', newData) // Replace with your API endpoint
      .then((response) => {
        setIsAdding(false);
        // Handle success, e.g., show a success message
        console.log(response.data.message);

        // Clear the input fields
        setNewData({
          nama: '',
          no_telp: '',
          alamat: '',
        });
        // Fetch and update the metodeData to include the newly added data
        fetchMetodeData();
      })
      .catch((error) => {
        console.error('Error adding data:', error);
      });
  };

  const handleAddCancel = () => {
    // Setel mode tambah data menjadi false
    setIsAdding(false);

    // Reset data form tambah data
    setNewData({
      nama_metode: '',
      harga: '',
      fee_dr: '',
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedList = Array.from(metodeData);
    const [movedItem] = updatedList.splice(result.source.index, 1);
    updatedList.splice(result.destination.index, 0, movedItem);
    setMetodeData(updatedList);

    axios.post('/api/pamulang/main/update-order-metode', { updatedList })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error updating order:', error);
      });
  };

  const handleEdit = (id, column) => {
    let editedValue;
    
    switch (column) {
      case "nama_metode":
        editedValue = editedNamaMetode[id];
        break;
      case "harga":
        editedValue = editedHarga[id];
        break;
      case "fee_dr":
        editedValue = editedFeeDr[id];
        break;
      default:
        break;
    }
  
    if (editedValue !== undefined) {
      axios.put('/api/pamulang/main/metode', { id, column, updatedItem: editedValue })
        .then(response => {
          console.log(response.data.message);
          // Clear the edited value for the specific column and item ID
          switch (column) {
            case "nama_metode":
              setEditedNamaMetode({ ...editedNamaMetode, [id]: undefined });
              break;
            case "harga":
              setEditedHarga({ ...editedHarga, [id]: undefined });
              break;
            case "fee_dr":
              setEditedFeeDr({ ...editedFeeDr, [id]: undefined });
              break;
            default:
              break;
          }
          // Update the resepsionisList state to trigger a re-render
          setMetodeData(prevList => {
            const updatedList = prevList.map(metode => {
              if (metode.id === id) {
                return {
                  ...metode,
                  [column]: editedValue
                };
              }
              return metode;
            });
            return updatedList;
          });
        })
        .catch(error => {
          console.error('Error updating metode:', error);
        });
    }
  };


  const handleDelete = (id) => {
    // Tampilkan alert konfirmasi sebelum menghapus
    const shouldDelete = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
  
    if (shouldDelete) {
      // Jika pengguna mengkonfirmasi, maka lakukan penghapusan
      // Replace with your API endpoint to delete a metode entry
      axios.delete(`/api/pamulang/main/metode?id=${id}`)
        .then(() => {
          // Update the UI after successful delete
          setMetodeData((prevData) => prevData.filter((item) => item.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting metode:', error);
        });
    }
  };
  
  const formatCurrency = (value) => {
    // Format angka menjadi "Rp" dengan titik pada setiap 3 angka
    return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  
  return (
<div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Metode</h1>
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">Nama</th>
                  <th className="border border-gray-400 px-4 py-2">Harga</th>
                  <th className="border border-gray-400 px-4 py-2">Fee DR</th>
                  <th className="border border-gray-400 px-4 py-2">Act</th>
                </tr>
              </thead>
              {metodeData.length > 0 && (
                <Droppable droppableId="itemList" type="ITEM">
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {metodeData.map((metode, index) => (
                        <Draggable
                          key={metode.id.toString()}
                          draggableId={metode.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <tr
                              className="text-center"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td className="border border-gray-400 px-4 py-2 text-left">
                                {editedNamaMetode[metode.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedNamaMetode[metode.id]}
                                    onChange={(e) => {
                                      setEditedNamaMetode({
                                        ...editedNamaMetode,
                                        [metode.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(metode.id, "nama_metode")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedNamaMetode({
                                        ...editedNamaMetode,
                                        [metode.id]: metode.nama_metode,
                                      });
                                    }}
                                  >
                                    {metode.nama_metode}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
                                {editedHarga[metode.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedHarga[metode.id]}
                                    onChange={(e) => {
                                      setEditedHarga({
                                        ...editedHarga,
                                        [metode.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(metode.id, "harga")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedHarga({
                                        ...editedHarga,
                                        [metode.id]: metode.harga,
                                      });
                                    }}
                                  >
                                    {formatCurrency(metode.harga)}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
  {editedFeeDr[metode.id] !== undefined ? (
    <input
      type="text"
      value={editedFeeDr[metode.id]}
      onChange={(e) => {
        setEditedFeeDr({
          ...editedFeeDr,
          [metode.id]: e.target.value,
        });
      }}
      onBlur={() => handleEdit(metode.id, "fee_dr")}
    />
  ) : (
    <span
      onClick={() => {
        setEditedFeeDr({
          ...editedFeeDr,
          [metode.id]: metode.fee_dr,
        });
      }}
    >
      {formatCurrency(metode.fee_dr)}
    </span>
  )}
</td>



                          <td className="border border-gray-400">
                            <button
                              className="text-red-500"
                              onClick={() => handleDelete(metode.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          )}
        </table>
      </DragDropContext>

      {isAdding ? ( 
      <div className="mb-4 p-4">
        <h2 className="text-xl font-semibold mb-2">Add New Data</h2>
        <div className="mb-2">
          <input
            type="text"
            name="nama_metode"
            value={newData.nama_metode}
            onChange={handleInputChange}
            placeholder="Metode"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-2">
          <input
            type="number"
            name="harga"
            value={newData.harga}
            onChange={handleInputChange}
            placeholder="Harga"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-2">
          <input
            type="number"
            name="fee_dr"
            value={newData.fee_dr}
            onChange={handleInputChange}
            placeholder="Fee Dr"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleAddData}
            >
              Save
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddCancel}
            >
              Cancel
            </button>
        </div>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleAdd}
        >
          Add Data
        </button>
      )}
    </div>
  );
};

export default MetodeBack;
