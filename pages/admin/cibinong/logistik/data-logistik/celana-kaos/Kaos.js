import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatTanggal, formatTanggalInput } from '../../../../../utils/LocalDateTime';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Kaos = () => {
  const [kaosList, setKaosList] = useState([]);
  const [editedItems, setEditedItems] = useState({});
  const [editedQty, setEditedQty] = useState({});
  const [editedSatuan, setEditedSatuan] = useState({});
  const [editedExpired, setEditedExpired] = useState({});
  const convertToISODate = (ddmmyyyy) => {
    const parts = ddmmyyyy.split('/');
    const isoDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
    return isoDate;
  };
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const fetchList = async (kategori, setList) => {
      try {
        const response = await axios.get(`/api/cibinong/barang?kategori=${kategori}`);
        const sortedData = response.data.sort((a, b) => a.urutan - b.urutan);
        setList(sortedData);
      } catch (error) {
        console.error(`Error fetching ${kategori} list: `, error);
      }
    };
    fetchList('Kaos', setKaosList);
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedList = Array.from(kaosList);
    const [movedItem] = updatedList.splice(result.source.index, 1);
    updatedList.splice(result.destination.index, 0, movedItem);
    setKaosList(updatedList);

    axios.post('/api/cibinong/update-order', { updatedList })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error updating order:', error);
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
  
    if (confirmDelete) {
      axios.delete(`/api/cibinong/barang?id=${id}`)
        .then(response => {
          console.log(response.data.message);
          const updatedList = kaosList.filter(item => item.id !== id);
          setKaosList(updatedList);
        })
        .catch(error => {
          console.error('Error deleting item:', error);
        });
    }
  };

  const handleEdit = (id, column) => {
    let editedValue;
    
    switch (column) {
      case "item":
        editedValue = editedItems[id];
        break;
      case "qty":
        editedValue = editedQty[id];
        break;
      case "satuan":
        editedValue = editedSatuan[id];
        break;
      case "expired":
        editedValue = convertToISODate(editedExpired[id]);
        break;
      default:
        break;
    }
  
    if (editedValue !== undefined) {
      axios.put('/api/cibinong/barang', { id, column, updatedItem: editedValue })
        .then(response => {
          console.log(response.data.message);
          // Clear the edited value for the specific column and item ID
          switch (column) {
            case "item":
              setEditedItems({ ...editedItems, [id]: undefined });
              break;
            case "qty":
              setEditedQty({ ...editedQty, [id]: undefined });
              break;
            case "satuan":
              setEditedSatuan({ ...editedSatuan, [id]: undefined });
              break;
            case "expired":
              setEditedExpired({ ...editedExpired, [id]: undefined });
              break;
            default:
              break;
          }
          // Update the resepsionisList state to trigger a re-render
          setKaosList(prevList => {
            const updatedList = prevList.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  [column]: editedValue
                };
              }
              return item;
            });
            return updatedList;
          });
        })
        .catch(error => {
          console.error('Error updating item:', error);
        });
    }
  };

  const handleNewItemChange = (event) => {
    setNewItemName(event.target.value);
  };


  const handleAddNewItem = () => {
    const fetchList = async (kategori, setList) => {
      try {
        const response = await axios.get(`/api/cibinong/barang?kategori=${kategori}`);
        const sortedData = response.data.sort((a, b) => a.urutan - b.urutan);
        setList(sortedData);
      } catch (error) {
        console.error(`Error fetching ${kategori} list: `, error);
      }
    };
  
    axios.post('/api/cibinong/barang', { kategori: 'Kaos', item: newItemName })
      .then(response => {
        console.log(response.data.message);
        fetchList('Kaos', setKaosList);
        setNewItemName('');
      })
      .catch(error => {
        console.error('Error adding new item:', error);
      });
  };
  
  
  
  return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Kaos</h1>
          <DragDropContext onDragEnd={handleDragEnd}>
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">Size</th>
                  <th className="border border-gray-400 px-4 py-2">Qty</th>
                  <th className="border border-gray-400 px-4 py-2">Satuan</th>
                  <th className="border border-gray-400 px-4 py-2">Exp</th>
                  <th className="border border-gray-400 px-4 py-2">Act</th>
                </tr>
              </thead>
              {kaosList.length > 0 && (
                <Droppable droppableId="itemList" type="ITEM">
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {kaosList.map((kaos, index) => (
                        <Draggable
                          key={kaos.id.toString()}
                          draggableId={kaos.id.toString()}
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
                                {editedItems[kaos.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedItems[kaos.id]}
                                    onChange={(e) => {
                                      setEditedItems({
                                        ...editedItems,
                                        [kaos.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(kaos.id, "item")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedItems({
                                        ...editedItems,
                                        [kaos.id]: kaos.item,
                                      });
                                    }}
                                  >
                                    {kaos.item}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
                                {editedQty[kaos.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedQty[kaos.id]}
                                    onChange={(e) => {
                                      setEditedQty({
                                        ...editedQty,
                                        [kaos.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(kaos.id, "qty")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedQty({
                                        ...editedQty,
                                        [kaos.id]: kaos.saldo_qty,
                                      });
                                    }}
                                  >
                                    {kaos.saldo_qty}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
  {editedSatuan[kaos.id] !== undefined ? (
    <input
      type="text"
      value={editedSatuan[kaos.id]}
      onChange={(e) => {
        setEditedSatuan({
          ...editedSatuan,
          [kaos.id]: e.target.value,
        });
      }}
      onBlur={() => handleEdit(kaos.id, "satuan")}
    />
  ) : (
    <span
      onClick={() => {
        setEditedSatuan({
          ...editedSatuan,
          [kaos.id]: kaos.satuan,
        });
      }}
    >
      {kaos.satuan}
    </span>
  )}
</td>

<td className="border border-gray-400 px-4 py-2">
  {editedExpired[kaos.id] !== undefined ? (
    <input
      type="text"
      value={(editedExpired[kaos.id])}
      onChange={(e) => {
        setEditedExpired({
          ...editedExpired,
          [kaos.id]: e.target.value,
        });
      }}
      onBlur={() => handleEdit(kaos.id, "expired")}
    />
  ) : (
    <span
      onClick={() => {
        setEditedExpired({
          ...editedExpired,
          [kaos.id]: formatTanggal(kaos.expired),
        });
      }}
    >
      {formatTanggal(kaos.expired)}
    </span>
  )}
</td>

                          <td className="border border-gray-400">
                            <button
                              className="text-red-500"
                              onClick={() => handleDelete(kaos.id)}
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
      <div className="mt-4">

        <div className="flex space-x-2">
          <input
            type="text"
            value={newItemName}
            onChange={handleNewItemChange}
            className="border rounded-md px-2 py-1 w-full"
            placeholder="Nama Item Baru"
          />
          <button
            onClick={handleAddNewItem}
            className="bg-purple-900 text-white rounded-md px-4 py-2"
          >
            Tambah
          </button>
        </div>
      </div>
      </div>

  );
};

export default Kaos;
