import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatTanggal, formatTanggalInput } from '../../../../../utils/LocalDateTime';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Stapler = () => {
  const [klampList, setStaplerList] = useState([]);
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
        const response = await axios.get(`/api/pamulang/main/barang?kategori=${kategori}`);
        const sortedData = response.data.sort((a, b) => a.urutan - b.urutan);
        setList(sortedData);
      } catch (error) {
        console.error(`Error fetching ${kategori} list: `, error);
      }
    };
    fetchList('Stapler', setStaplerList);
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedList = Array.from(klampList);
    const [movedItem] = updatedList.splice(result.source.index, 1);
    updatedList.splice(result.destination.index, 0, movedItem);
    setStaplerList(updatedList);

    axios.post('/api/pamulang/main/update-order', { updatedList })
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
      axios.delete(`/api/pamulang/main/barang?id=${id}`)
        .then(response => {
          console.log(response.data.message);
          const updatedList = klampList.filter(item => item.id !== id);
          setStaplerList(updatedList);
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
      axios.put('/api/pamulang/main/barang', { id, column, updatedItem: editedValue })
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
          setStaplerList(prevList => {
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
        const response = await axios.get(`/api/pamulang/main/barang?kategori=${kategori}`);
        const sortedData = response.data.sort((a, b) => a.urutan - b.urutan);
        setList(sortedData);
      } catch (error) {
        console.error(`Error fetching ${kategori} list: `, error);
      }
    };
  
    axios.post('/api/pamulang/main/barang', { kategori: 'Stapler', item: newItemName })
      .then(response => {
        console.log(response.data.message);
        fetchList('Stapler', setStaplerList);
        setNewItemName('');
      })
      .catch(error => {
        console.error('Error adding new item:', error);
      });
  };
  
  
  
  return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Stapler</h1>
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
              {klampList.length > 0 && (
                <Droppable droppableId="itemList" type="ITEM">
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {klampList.map((stapler, index) => (
                        <Draggable
                          key={stapler.id.toString()}
                          draggableId={stapler.id.toString()}
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
                                {editedItems[stapler.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedItems[stapler.id]}
                                    onChange={(e) => {
                                      setEditedItems({
                                        ...editedItems,
                                        [stapler.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(stapler.id, "item")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedItems({
                                        ...editedItems,
                                        [stapler.id]: stapler.item,
                                      });
                                    }}
                                  >
                                    {stapler.item}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
                                {editedQty[stapler.id] !== undefined ? (
                                  <input
                                    type="text"
                                    value={editedQty[stapler.id]}
                                    onChange={(e) => {
                                      setEditedQty({
                                        ...editedQty,
                                        [stapler.id]: e.target.value,
                                      });
                                    }}
                                    onBlur={() => handleEdit(stapler.id, "qty")}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setEditedQty({
                                        ...editedQty,
                                        [stapler.id]: stapler.saldo_qty,
                                      });
                                    }}
                                  >
                                    {stapler.saldo_qty}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-400 px-4 py-2">
  {editedSatuan[stapler.id] !== undefined ? (
    <input
      type="text"
      value={editedSatuan[stapler.id]}
      onChange={(e) => {
        setEditedSatuan({
          ...editedSatuan,
          [stapler.id]: e.target.value,
        });
      }}
      onBlur={() => handleEdit(stapler.id, "satuan")}
    />
  ) : (
    <span
      onClick={() => {
        setEditedSatuan({
          ...editedSatuan,
          [stapler.id]: stapler.satuan,
        });
      }}
    >
      {stapler.satuan}
    </span>
  )}
</td>

<td className="border border-gray-400 px-4 py-2">
  {editedExpired[stapler.id] !== undefined ? (
    <input
      type="text"
      value={(editedExpired[stapler.id])}
      onChange={(e) => {
        setEditedExpired({
          ...editedExpired,
          [stapler.id]: e.target.value,
        });
      }}
      onBlur={() => handleEdit(stapler.id, "expired")}
    />
  ) : (
    <span
      onClick={() => {
        setEditedExpired({
          ...editedExpired,
          [stapler.id]: formatTanggal(stapler.expired),
        });
      }}
    >
      {formatTanggal(stapler.expired)}
    </span>
  )}
</td>

                          <td className="border border-gray-400">
                            <button
                              className="text-red-500"
                              onClick={() => handleDelete(stapler.id)}
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

export default Stapler;
