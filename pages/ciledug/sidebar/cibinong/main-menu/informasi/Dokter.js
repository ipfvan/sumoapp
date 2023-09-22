import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Dokter = () => {
  const [metodeData, setMetodeData] = useState([]);
  const [editedNama, setEditedNama] = useState({});
  const [editedNoTelp, setEditedNoTelp] = useState({});
  const [editedAlamat, setEditedAlamat] = useState({});
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
      const response = await axios.get(`/api/cibinong/main/dokter`);
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
      .post('/api/cibinong/main/dokter', newData) // Replace with your API endpoint
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

    axios.post('/api/cibinong/main/update-order-dokter', { updatedList })
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
      case "nama":
        editedValue = editedNama[id];
        break;
      case "no_telp":
        editedValue = editedNoTelp[id];
        break;
      case "alamat":
        editedValue = editedAlamat[id];
        break;
      default:
        break;
    }
  
    if (editedValue !== undefined) {
      axios.put('/api/cibinong/main/dokter', { id, column, updatedItem: editedValue })
        .then(response => {
          console.log(response.data.message);
          // Clear the edited value for the specific column and item ID
          switch (column) {
            case "nama":
              setEditedNamaMetode({ ...editedNama, [id]: undefined });
              break;
            case "no_telp":
              setEditedNoTelp({ ...editedNoTelp, [id]: undefined });
              break;
            case "alamat":
              setEditedAlamat({ ...editedAlamat, [id]: undefined });
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
      axios.delete(`/api/cibinong/main/dokter?id=${id}`)
        .then(() => {
          // Update the UI after successful delete
          setMetodeData((prevData) => prevData.filter((item) => item.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting metode:', error);
        });
    }
  };
  


  
  return (
<div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Dokter</h1>
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">Nama</th>
                  <th className="border border-gray-400 px-4 py-2">No Telp</th>
                  <th className="border border-gray-400 px-4 py-2">Alamat</th>
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
                                {editedNama[metode.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedNama[metode.id]}
                                    onChange={(e) => {
                                      setEditedNama({
                                        ...editedNama,
                                        [metode.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(metode.id, "nama")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedNama({
                                        ...editedNama,
                                        [metode.id]: metode.nama,
                                      });
                                    }}
                                  >
                                    {metode.nama}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
                                {editedNoTelp[metode.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedNoTelp[metode.id]}
                                    onChange={(e) => {
                                      setEditedNoTelp({
                                        ...editedNoTelp,
                                        [metode.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(metode.id, "no_telp")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedNoTelp({
                                        ...editedNoTelp,
                                        [metode.id]: metode.no_telp,
                                      });
                                    }}
                                  >
                                    {metode.no_telp}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
  {editedAlamat[metode.id] !== undefined ? (
    <input
      type="text"
      value={editedAlamat[metode.id]}
      onChange={(e) => {
        setEditedAlamat({
          ...editedAlamat,
          [metode.id]: e.target.value,
        });
      }}
      onBlur={() => handleEdit(metode.id, "alamat")}
    />
  ) : (
    <span
      onClick={() => {
        setEditedAlamat({
          ...editedAlamat,
          [metode.id]: metode.alamat,
        });
      }}
    >
      {metode.alamat}
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
            name="nama"
            value={newData.nama}
            onChange={handleInputChange}
            placeholder="Nama"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="no_telp"
            value={newData.no_telp}
            onChange={handleInputChange}
            placeholder="No Telp"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="alamat"
            value={newData.alamat}
            onChange={handleInputChange}
            placeholder="Alamat"
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
export default Dokter;
